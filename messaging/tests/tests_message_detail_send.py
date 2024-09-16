# drf-api/messaging/tests/tests_message_detail_send.py

from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from messaging.models import Message
from django.urls import reverse

class MessageSendTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', password='password')
        self.user2 = User.objects.create_user(username='user2', password='password')
        self.client.login(username='user1', password='password')

    def test_send_message(self):
        url = reverse('message-detail-send', kwargs={'user_id': self.user2.id})
        data = {'content': 'Hello!', 'recipient_id': self.user2.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Message.objects.count(), 1)
        self.assertEqual(Message.objects.get().content, 'Hello!')

    def test_receive_messages(self):
        Message.objects.all().delete()
        Message.objects.create(sender=self.user1, recipient=self.user2, content='Hello!')
        self.client.login(username='user2', password='password')
        url = reverse('message-detail', kwargs={'user_id': self.user1.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        content = response.json()
        self.assertEqual(len(content['results']), 1)
        self.assertEqual(content['results'][0]['content'], 'Hello!')