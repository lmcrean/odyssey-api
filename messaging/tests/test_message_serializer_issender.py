# messaging/tests/test_message_serializer_issender.py

from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from profiles.models import Profile
from messaging.models import Message

class IsSenderFieldTests(APITestCase):

    def setUp(self):
        # Create users
        self.sender_user = User.objects.create_user(username='sender_user', password='password')
        self.recipient_user = User.objects.create_user(username='recipient_user', password='password')

        # Create profiles for the users
        Profile.objects.get_or_create(owner=self.sender_user)
        Profile.objects.get_or_create(owner=self.recipient_user)

        # Create a message where sender_user sends a message to recipient_user
        self.message = Message.objects.create(
            sender=self.sender_user,
            recipient=self.recipient_user,
            content="Message from sender_user"
        )

        # Initialize API client
        self.client = APIClient()

    def test_is_sender_field_true_for_sender(self):
        # Log in as the sender of the message
        self.client.login(username='sender_user', password='password')

        # Perform GET request to retrieve the message list
        url = reverse('message-detail', kwargs={'user_id': self.message.recipient.id})
        response = self.client.get(url)

        # Verify response status code and structure
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Parse JSON content
        content = response.json()
        
        self.assertIn('results', content)
        self.assertIsInstance(content['results'], list)
        self.assertGreater(len(content['results']), 0)

        # Check that is_sender is True for the sender in the first message
        first_message = content['results'][0]
        self.assertIn('is_sender', first_message)
        self.assertTrue(first_message['is_sender'])

    def test_is_sender_field_false_for_recipient(self):
        # Log in as the recipient of the message
        self.client.login(username='recipient_user', password='password')

        # Perform GET request to retrieve the message list
        url = reverse('message-detail', kwargs={'user_id': self.message.sender.id})
        response = self.client.get(url)

        # Verify response status code and structure
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Parse JSON content
        content = response.json()
        
        self.assertIn('results', content)
        self.assertIsInstance(content['results'], list)
        self.assertGreater(len(content['results']), 0)

        # Check that is_sender is False for the recipient in the first message
        first_message = content['results'][0]
        self.assertIn('is_sender', first_message)
        self.assertFalse(first_message['is_sender'])