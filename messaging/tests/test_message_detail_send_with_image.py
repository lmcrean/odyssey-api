from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from messaging.models import Message
from cloudinary.uploader import upload
from io import BytesIO
from PIL import Image

class MessageWithImageTestCase(APITestCase):
    def setUp(self):
        # Create users for sender and recipient
        self.sender = User.objects.create_user(username='sender', password='password123')
        self.recipient = User.objects.create_user(username='recipient', password='password123')
        self.client.login(username='sender', password='password123')

    def generate_test_image(self):
        # Generate a simple image to use for testing
        image = Image.new('RGB', (100, 100), color = (73, 109, 137))
        image_file = BytesIO()
        image.save(image_file, 'JPEG')
        image_file.name = 'test_image.jpg'
        image_file.seek(0)
        return image_file

    def test_message_with_image(self):
        url = reverse('message-detail-send', kwargs={'user_id': self.recipient.id})
        data = {
            'content': 'Test message with image',
            'image': self.generate_test_image(),
        }
        
        # Perform the POST request to send a message with an image
        response = self.client.post(url, data, format='multipart')

        # Check that the request was successful
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Verify the message was created with the image
        message = Message.objects.get(id=response.data['id'])
        self.assertIsNotNone(message.image)
        self.assertTrue(message.image.url.startswith('http'))  # Check that the image has a valid URL

class MessageWithImageValidationTestCase(APITestCase):
    def setUp(self):
        self.sender = User.objects.create_user(username='sender', password='password123')
        self.recipient = User.objects.create_user(username='recipient', password='password123')
        self.client.login(username='sender', password='password123')

    def generate_test_image(self, size=(7000, 7000), color=(73, 109, 137)):
        # Generate a solid color image
        image = Image.new('RGB', size, color=color)
        image_file = BytesIO()
        image.save(image_file, 'JPEG', quality=100)  # Save at highest quality to increase size
        image_file.name = 'large_test_image.jpg'
        image_file.seek(0)
        return image_file

    def generate_invalid_file(self):
        invalid_file = BytesIO(b'Not an image')
        invalid_file.name = 'invalid_file.txt'
        return invalid_file

    def test_reject_invalid_image(self):
        url = reverse('message-detail-send', kwargs={'user_id': self.recipient.id})
        data = {
            'content': 'Test message with invalid image',
            'image': self.generate_invalid_file(),
        }
        
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Invalid image file', response.data['image'][0])

    def test_reject_large_image(self):
        url = reverse('message-detail-send', kwargs={'user_id': self.recipient.id})
        
        # Create a dummy file larger than 5MB
        large_file = BytesIO(b"A" * (6 * 1024 * 1024))  # 6MB file
        large_file.name = 'large_test_image.jpg'
        large_file.seek(0)
        
        data = {
            'content': 'Test message with large image',
            'image': large_file,
        }
        
        # Perform the POST request
        response = self.client.post(url, data, format='multipart')

        # Check if the response indicates the file was too large
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Image file too large', response.data['image'][0])