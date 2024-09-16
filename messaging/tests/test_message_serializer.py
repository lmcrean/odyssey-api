# File: messaging/tests/test_message_serializer.py

from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from profiles.models import Profile
from messaging.models import Message

class MessageSerializerTests(APITestCase):

    def setUp(self):
        # Create users
        self.user_with_image = User.objects.create_user(username='user_with_image', password='password')
        self.user_without_image = User.objects.create_user(username='user_without_image', password='password')

        # Ensure profiles are created with the default image
        self.profile_with_image, created = Profile.objects.get_or_create(owner=self.user_with_image)
        self.profile_without_image, created = Profile.objects.get_or_create(owner=self.user_without_image)

        # Create messages for testing
        self.message_with_image = Message.objects.create(
            sender=self.user_with_image,
            recipient=self.user_without_image,
            content="Message from user_with_image"
        )

        self.message_without_image = Message.objects.create(
            sender=self.user_without_image,
            recipient=self.user_with_image,
            content="Message from user_without_image"
        )

        # Initialize API client
        self.client = APIClient()

    def test_message_exists(self):
        # Log in the user
        self.client.login(username='user_with_image', password='password')

        # Perform GET request to retrieve the message list
        url = reverse('message-detail', kwargs={'user_id': self.message_with_image.recipient.id})
        response = self.client.get(url)

        # Verify that the response contains a list of messages inside the "results" key
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Parse JSON content
        content = response.json()
        
        self.assertIn('results', content)
        self.assertIsInstance(content['results'], list)
        self.assertGreater(len(content['results']), 0)
        self.assertIn('id', content['results'][0])

    def test_sender_profile_image_is_default(self):
        # Log in the user
        self.client.login(username='user_with_image', password='password')

        # Perform GET request to retrieve the message list
        url = reverse('message-detail', kwargs={'user_id': self.message_with_image.recipient.id})
        response = self.client.get(url)

        # Verify response status code and structure
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Parse JSON content
        content = response.json()
        
        self.assertIn('results', content)
        self.assertIsInstance(content['results'], list)
        self.assertGreater(len(content['results']), 0)

        # Check that the sender profile image is the default image in the first message
        first_message = content['results'][0]
        self.assertIn('sender_profile_image', first_message)
        self.assertEqual(
            first_message['sender_profile_image'],
            'https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg'
        )