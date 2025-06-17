from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from messaging.models import Message
from django.core.files.uploadedfile import SimpleUploadedFile
from io import BytesIO
from PIL import Image

class MessageDetailSendViewTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', password='password123')
        self.user2 = User.objects.create_user(username='user2', password='password123')
        self.client.login(username='user1', password='password123')

    def generate_test_image(self):
        image = Image.new('RGB', (100, 100), color = (73, 109, 137))
        image_file = BytesIO()
        image.save(image_file, 'JPEG')
        image_file.seek(0)
        return SimpleUploadedFile('test_image.jpg', image_file.getvalue(), content_type='image/jpeg')

    def test_send_message_with_image(self):
        url = reverse('message-detail-send', kwargs={'user_id': self.user2.id})
        data = {
            'content': 'Hello, this is a test message with an image.',
            'image': self.generate_test_image()
        }
        response = self.client.post(url, data, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Message.objects.count(), 1)
        self.assertIsNotNone(Message.objects.first().image)

    def test_send_message_existing_chat(self):
        # Create an existing message to simulate an existing chat
        Message.objects.create(sender=self.user1, recipient=self.user2, content="Existing message")

        url = reverse('message-detail-send', kwargs={'user_id': self.user2.id})
        data = {
            'content': 'Hello, this is a test message for an existing chat.'
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Message.objects.count(), 2)
        self.assertEqual(Message.objects.latest('timestamp').content, data['content'])

    def test_send_message_new_chat(self):
        url = reverse('message-detail-send', kwargs={'user_id': self.user2.id})
        data = {
            'content': 'Hello, this is a test message for a new chat.'
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Message.objects.count(), 1)
        self.assertEqual(Message.objects.first().content, data['content'])

    def test_send_message_to_nonexistent_user(self):
        nonexistent_user_id = User.objects.latest('id').id + 1
        url = reverse('message-detail-send', kwargs={'user_id': nonexistent_user_id})
        data = {
            'content': 'This message should not be sent.'
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Message.objects.count(), 0)

    def test_send_message_to_self(self):
        url = reverse('message-detail-send', kwargs={'user_id': self.user1.id})
        data = {
            'content': 'This message should not be sent to myself.'
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Message.objects.count(), 0)