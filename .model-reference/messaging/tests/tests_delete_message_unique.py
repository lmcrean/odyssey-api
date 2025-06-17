# drf_api/messaging/tests/tests_delete_message_unique.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from messaging.models import Message

class MessageDeleteTest(APITestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.login(username='testuser', password='testpassword')
        
        # Create another user to be the recipient
        self.recipient = User.objects.create_user(username='recipientuser', password='testpassword')
        
        # Create a test message
        self.message = Message.objects.create(
            sender=self.user,
            recipient=self.recipient,
            content='Test message content'
        )
        
        # URL for deleting the message
        self.url = reverse('message-delete', kwargs={'pk': self.message.id})

    def test_delete_message(self):
        # Delete the message
        response = self.client.delete(self.url)
        
        # Check if the response status code is 204 No Content
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Verify the message has been deleted
        self.assertFalse(Message.objects.filter(id=self.message.id).exists())

    def tearDown(self):
        self.client.logout()
