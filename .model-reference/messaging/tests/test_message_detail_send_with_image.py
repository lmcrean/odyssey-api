from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from messaging.models import Message
from django.core.files.uploadedfile import SimpleUploadedFile
from io import BytesIO
from PIL import Image

class MessageWithImageTestCase(APITestCase):
    def setUp(self):
        self.sender = User.objects.create_user(username='sender', password='password123')
        self.recipient = User.objects.create_user(username='recipient', password='password123')
        self.client.login(username='sender', password='password123')

    def generate_test_image(self):
        image = Image.new('RGB', (100, 100), color = (73, 109, 137))
        image_file = BytesIO()
        image.save(image_file, 'JPEG')
        image_file.seek(0)
        return SimpleUploadedFile('test_image.jpg', image_file.getvalue(), content_type='image/jpeg')

    def test_send_message_with_image(self):
        url = reverse('message-detail-send', kwargs={'user_id': self.recipient.id})
        data = {
            'content': 'Test message with image',
            'image': self.generate_test_image(),
        }
        
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        message = Message.objects.get(id=response.data['id'])
        self.assertIsNotNone(message.image)
        self.assertTrue(message.image.url.startswith('http'))

class MessageWithImageValidationTestCase(APITestCase):
    def setUp(self):
        self.sender = User.objects.create_user(username='sender', password='password123')
        self.recipient = User.objects.create_user(username='recipient', password='password123')
        self.client.login(username='sender', password='password123')

    def generate_large_image(self):
        # Create a file larger than 5MB
        large_data = b'0' * (6 * 1024 * 1024)  # 6MB of data
        return SimpleUploadedFile('large_test_image.jpg', large_data, content_type='image/jpeg')

    def generate_invalid_file(self):
        return SimpleUploadedFile('invalid_file.txt', b'Not an image', content_type='text/plain')

    def test_reject_invalid_image(self):
        url = reverse('message-detail-send', kwargs={'user_id': self.recipient.id})
        data = {
            'content': 'Test message with invalid image',
            'image': self.generate_invalid_file(),
        }
        
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Invalid image file', str(response.data['image'][0]))

    def test_reject_large_image(self):
        url = reverse('message-detail-send', kwargs={'user_id': self.recipient.id})
        data = {
            'content': 'Test message with large image',
            'image': self.generate_large_image(),
        }
        
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Image file too large', str(response.data['image'][0]))