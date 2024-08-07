# drf_api/messaging/tests/tests_chat_delete.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from messaging.models import Message
from django.db.models import Q  # Importing Q for complex queries


class ChatDeleteTest(APITestCase):
    def setUp(self):
        # Create two users
        self.user1 = User.objects.create_user(username='user1', password='password')
        self.user2 = User.objects.create_user(username='user2', password='password')
        self.client.login(username='user1', password='password')

        # Create messages between the two users
        self.message1 = Message.objects.create(sender=self.user1, recipient=self.user2, content='Message 1 from user1 to user2')
        self.message2 = Message.objects.create(sender=self.user2, recipient=self.user1, content='Message 2 from user2 to user1')
        self.message3 = Message.objects.create(sender=self.user1, recipient=self.user2, content='Message 3 from user1 to user2')

        # URL for deleting the chat
        self.url = reverse('chat-delete', kwargs={'user_id': self.user2.id})

    def test_delete_chat(self):
        # Delete the chat
        response = self.client.delete(self.url)
        
        # Check if the response status code is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify that all messages between user1 and user2 are deleted
        messages = Message.objects.filter(
            (Q(sender=self.user1) & Q(recipient=self.user2)) |
            (Q(sender=self.user2) & Q(recipient=self.user1))
        )
        self.assertEqual(messages.count(), 0)

        # Verify that the response contains the success message
        self.assertEqual(response.data['detail'], "Chat deleted successfully.")

    def tearDown(self):
        self.client.logout()