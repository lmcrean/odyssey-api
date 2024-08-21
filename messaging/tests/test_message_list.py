# drf_api/messaging/tests/test_message_list.py

from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
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
        # Perform a GET request to the MessageListView
        response = self.client.get('/messages/')

        # Ensure the request was successful
        self.assertEqual(response.status_code, 200)

        # Check that the recipient profile image is included in the response
        response_data = response.json()
        self.assertIn('recipient_profile_image', response_data[0])

        # Confirm the recipient profile image URL is correct
        self.assertEqual(response_data[0]['recipient_profile_image'], 'https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg')
