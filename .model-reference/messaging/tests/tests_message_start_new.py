# drf-api/messaging/tests/tests_message_start_new_view.py


from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from messaging.models import Message

class MessageListStartNewViewTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', password='password')
        self.user2 = User.objects.create_user(username='user2', password='password')
        self.client.login(username='user1', password='password')

    def test_start_new_chat(self):
        url = reverse('message-start-new', kwargs={'user_id': self.user2.id})
        data = {'content': 'Hello, user2!'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Message.objects.count(), 1)
        self.assertEqual(Message.objects.get().content, 'Hello, user2!')

    def test_start_new_chat_self(self):
        url = reverse('message-start-new', kwargs={'user_id': self.user1.id})
        data = {'content': 'Hello, myself!'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_start_new_chat_nonexistent_user(self):
        url = reverse('message-start-new', kwargs={'user_id': 999})
        data = {'content': 'Hello, non-existent user!'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)