# File: drf_api/messaging/tests/test_message_list.py

from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from django.urls import reverse
from rest_framework import status
from profiles.models import Profile
from messaging.models import Message

class MessageListViewTest(TestCase):
    def setUp(self):
        # Create two users
        self.sender = User.objects.create_user(username='sender', password='password123')
        self.recipient = User.objects.create_user(username='recipient', password='password123')

        # Create or get a profile for the recipient
        self.recipient_profile, created = Profile.objects.get_or_create(
            owner=self.recipient,
            defaults={'image': 'https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg'}
        )

        # Create a message from sender to recipient
        self.message = Message.objects.create(sender=self.sender, recipient=self.recipient, content='Hello')

        # Set up the API client and authenticate the sender
        self.client = APIClient()
        self.client.force_authenticate(user=self.sender)

    def test_message_list_includes_recipient_profile_image(self):
        # Get the correct URL for the message list view
        url = reverse('message-list')  # This should resolve to '/api/messages/'
        
        # Perform a GET request to the MessageListView
        response = self.client.get(url)

        # Ensure the request was successful
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check that the response is a valid JSON
        self.assertEqual(response['Content-Type'], 'application/json')

        # Parse the JSON response
        response_data = response.json()

        # Check that we have at least one message in the response
        self.assertTrue(len(response_data) > 0, "No messages found in the response")

        # Check that the recipient profile image is included in the response
        self.assertIn('recipient_profile_image', response_data[0], "recipient_profile_image not found in response")

        # Confirm the recipient profile image URL is correct
        self.assertEqual(
            response_data[0]['recipient_profile_image'], 
            'https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg',
            "Incorrect recipient profile image URL"
        )

        # Additional checks
        self.assertIn('id', response_data[0], "id not found in response")
        self.assertIn('username', response_data[0], "username not found in response")
        self.assertIn('last_message', response_data[0], "last_message not found in response")
        self.assertIn('last_message_time', response_data[0], "last_message_time not found in response")

        # Check the values of the response
        self.assertEqual(response_data[0]['username'], 'recipient', "Incorrect username")
        self.assertEqual(response_data[0]['last_message'], 'Hello', "Incorrect last message")