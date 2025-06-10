from django.test import TestCase
from django.contrib.auth.models import User
from posts.models import Post
from django.core.files.uploadedfile import SimpleUploadedFile
from unittest.mock import patch
from rest_framework import status
from PIL import Image
import tempfile


class PostCreateTest(TestCase):
    def setUp(self):
        # Create a user to associate the post with
        self.user = User.objects.create_user(username='testuser', password='pass')

    @patch('cloudinary.uploader.upload')
    def test_create_post_with_image_and_cloudinary(self, mock_upload):
        self.client.login(username='testuser', password='pass')

        # Mock Cloudinary response
        mock_upload.return_value = {
            'public_id': 'media/images/test_image',
            'url': 'https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/test_image'
        }

        # Create a temporary image file
        with tempfile.NamedTemporaryFile(suffix='.jpg') as temp_image:
            # Use Python Imaging Library to generate an image file
            image = Image.new('RGB', (100, 100), color='blue')
            image.save(temp_image, format='JPEG')
            temp_image.seek(0)

            # Define the post data including the image
            post_data = {
                'title': 'Test Post',
                'content': 'This is a test post content',
                'image': temp_image,
            }

            response = self.client.post('/api/posts/', post_data, format='multipart')

            # Assert that the post creation was successful (HTTP 201)
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

            # Assert that the post was created in the database
            self.assertEqual(Post.objects.count(), 1)
            post = Post.objects.get()
            self.assertEqual(post.title, 'Test Post')
            self.assertEqual(post.owner, self.user)

            # Assert that the mocked Cloudinary URL was used with .jpg extension
            self.assertEqual(post.image.url + ".jpg", 'https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/test_image.jpg')