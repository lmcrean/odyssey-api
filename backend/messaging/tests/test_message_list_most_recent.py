from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth.models import User
from messaging.models import Message
from profiles.models import Profile
from django.utils import timezone

class MessageListViewTest(APITestCase):

    def setUp(self):
        # Create users
        self.user1 = User.objects.create(username="user1")
        self.user2 = User.objects.create(username="user2")
        self.user3 = User.objects.create(username="user3")

        # Check if profile for user2 already exists, and if so, update it; otherwise, create a new one
        Profile.objects.update_or_create(
            owner=self.user2,
            defaults={"image": "https://example.com/user2.jpg"}
        )
        
        # Create an older message between user1 and user2
        Message.objects.create(
            sender=self.user1,
            recipient=self.user2,
            content="This is a message that is not the most recent, so should not appear",
            timestamp=timezone.now() - timezone.timedelta(days=3)  # Older message
        )
        
        # Create a long message that will be the most recent
        Message.objects.create(
            sender=self.user2,
            recipient=self.user1,
            content="This is a very long message from user2 that is also the most recent, so it should appear",
            timestamp=timezone.now() - timezone.timedelta(minutes=5)  # Most recent message
        )

    def test_message_list_view(self):
        # Authenticate as user1
        self.client.force_authenticate(user=self.user1)
        
        # Make the request to the message list view
        response = self.client.get(reverse('message-list'))  # Assuming the URL is named 'message-list'
        
        # Ensure the response is successful
        self.assertEqual(response.status_code, 200)
        
        # Parse the response data
        data = response.json()
        
        # Check the number of message users returned
        self.assertEqual(len(data), 1)
        
        # Verify that the last message for user2 is truncated to 50 characters and ends with "..."
        self.assertEqual(data[0]['last_message'], "This is a very long message from user2 that is als...")  # Truncated to 50 characters
        self.assertTrue(data[0]['last_message_time'])  # Should contain a formatted time string

        # Ensure that the older message does not appear in the last_message field
        self.assertNotEqual(data[0]['last_message'], "This is a message that is not the most recent, so should not appear")

        # Test fallback image for user3 (without a profile image)
        Message.objects.create(
            sender=self.user1,
            recipient=self.user3,
            content="Hello from user1",
            timestamp=timezone.now() - timezone.timedelta(minutes=2)
        )
        
        # Make the request again
        response = self.client.get(reverse('message-list'))
        
        # Ensure the response is successful
        self.assertEqual(response.status_code, 200)
        
        # Parse the response data
        data = response.json()
        
        # Check the number of message users returned
        self.assertEqual(len(data), 2)
        
        # Verify the fields for user3 in the response
        self.assertEqual(data[1]['id'], self.user3.id)
        self.assertEqual(data[1]['username'], self.user3.username)
        self.assertEqual(data[1]['recipient_profile_image'], "https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg")
        self.assertEqual(data[1]['last_message'], "Hello from user1")