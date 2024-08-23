from django.test import TestCase
from django.contrib.auth.models import User
from posts.models import Post
from rest_framework import status
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile


class PostEditTest(TestCase):
    def setUp(self):
        # Create a user and log them in
        self.user = User.objects.create_user(username='testuser', password='password')
        self.client.login(username='testuser', password='password')

        # Create a post to edit later
        self.post = Post.objects.create(
            owner=self.user,
            title="Original Title",
            content="Original Content",
            image="original_image.jpg"
        )

        # URL for editing the post
        self.url = reverse('post-detail', kwargs={'pk': self.post.id})

    def test_edit_post_image(self):
        # Create a mock image file
        mock_image = SimpleUploadedFile(
            name='updated_image.jpg', 
            content=b'new image content', 
            content_type='image/jpeg'
        )

        # Form data with the image file
        updated_data = {
            'title': 'Updated Title',
            'content': 'Updated Content',
            'image': mock_image
        }

        # Send PUT request to update the post with multipart data
        response = self.client.put(self.url, updated_data, format='multipart')

        # Print the response data for debugging
        print(response.data)

        # Fetch the updated post from the database
        self.post.refresh_from_db()

        # Assertions
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.post.title, updated_data['title'])  # Check that the title was updated
        self.assertEqual(self.post.content, updated_data['content'])  # Check that the content was updated
        self.assertEqual(self.post.image.name, 'updated_image.jpg')  # Check that the image was updated
