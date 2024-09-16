# drf_api/messaging/tests/tests_message_update.py


from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from messaging.models import Message
from django.urls import reverse

class MessageUpdateTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='user1', password='password')
        self.other_user = User.objects.create_user(username='user2', password='password')
        self.message = Message.objects.create(
            sender=self.user, recipient=self.other_user, content="Original message"
        )
        self.client = APIClient()
        self.client.login(username='user1', password='password')

    def test_update_message_success(self):
        url = reverse('message-update', kwargs={'pk': self.message.id})
        data = {'content': 'Updated message content'}
        response = self.client.patch(url, data, format='json')
        self.message.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.message.content, 'Updated message content')

    def test_update_message_unauthorized(self):
        self.client.logout()
        self.client.login(username='user2', password='password')
        url = reverse('message-update', kwargs={'pk': self.message.id})
        data = {'content': 'Updated message content'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)