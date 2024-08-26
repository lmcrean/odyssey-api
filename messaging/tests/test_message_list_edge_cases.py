from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth.models import User
from messaging.models import Message
from profiles.models import Profile
from django.utils import timezone
from rest_framework import status

class MessageListViewTest(APITestCase):

    def setUp(self):
        # Create users
        self.user1 = User.objects.create(username="user1")
        self.user2 = User.objects.create(username="user2")
        self.user3 = User.objects.create(username="user3")

        # Create profile for user2 with an image
        Profile.objects.update_or_create(
            owner=self.user2,
            defaults={"image": "https://example.com/user2.jpg"}
        )

    def test_message_list_view_no_messages(self):
        """Test that the message list view returns an empty list when there are no messages."""
        self.client.force_authenticate(user=self.user1)

        response = self.client.get(reverse('message-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(len(data), 0)  # No messages should result in an empty list

    def test_message_list_view_unauthenticated(self):
        """Test that an unauthenticated user cannot access the message list."""
        response = self.client.get(reverse('message-list'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
