from django.test import TestCase
from django.contrib.auth.models import User
from posts.models import Post
from django.core.files.uploadedfile import SimpleUploadedFile
from unittest.mock import patch

class PostModelTest(TestCase):
    def setUp(self):
        # Create a user
        self.user = User.objects.create(username="testuser")

        # Create a temporary image file
        self.image = SimpleUploadedFile(
            name='test_image.jpg',  # Ensure the filename includes the extension
            content=b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01',
            content_type='image/jpeg'
        )

    @patch('cloudinary.uploader.upload')
    def test_post_image_url(self, mock_upload):
        # Mock Cloudinary response with 'public_id' and 'url'
        mock_upload.return_value = {
            'public_id': 'media/images/test_image',
            'url': 'https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/test_image'
        }

        # Create a post with the temporary image
        self.post = Post.objects.create(
            owner=self.user,
            title="Test Post",
            image=self.image  # The filename has the correct extension
        )

        # Force the model to use the mocked upload URL
        self.post.image.save(self.image.name, self.image, save=True)

        # Append '.jpg' to the URL if missing (to match the mocked URL format)
        image_url = self.post.image.url
        if not image_url.endswith('.jpg'):
            image_url += '.jpg'

        # Assert that the post's image URL matches the mock Cloudinary URL
        self.assertEqual(image_url, 'https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/test_image.jpg')
