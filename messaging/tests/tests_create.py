# drf-api/messaging/tests/tests_create.py

from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from messaging.models import Message

class MessageSendTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', password='password')
        self.user2 = User.objects.create_user(username='user2', password='password')
        self.client.login(username='user1', password='password')

    def test_send_message(self):
        url = f'/messages/{self.user2.id}/send/'
        data = {'content': 'Hello!', 'recipient_id': self.user2.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Message.objects.count(), 1)
        self.assertEqual(Message.objects.get().content, 'Hello!')

    def test_receive_messages(self):
        Message.objects.all().delete()
        Message.objects.create(sender=self.user1, recipient=self.user2, content='Hello!')
        self.client.login(username='user2', password='password')
        url = f'/messages/{self.user1.id}/'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['content'], 'Hello!')
