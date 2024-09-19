from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Follower

class FollowerTests(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', password='pass1234')
        self.user2 = User.objects.create_user(username='user2', password='pass1234')
        self.client = APIClient()

    def test_follow_and_unfollow(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.post('/api/followers/', {'followed': self.user2.id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Follower.objects.filter(owner=self.user1, followed=self.user2).exists())

        follower = Follower.objects.get(owner=self.user1, followed=self.user2)
        response = self.client.delete(f'/api/followers/{follower.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Follower.objects.filter(owner=self.user1, followed=self.user2).exists())

    def test_follow_nonexistent_user(self):
        self.client.force_authenticate(user=self.user1)
        non_existent_user_id = User.objects.order_by('-id').first().id + 1
        response = self.client.post('/api/followers/', {'followed': non_existent_user_id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('object does not exist', str(response.data['followed'][0]))

    def test_follow_self(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.post('/api/followers/', {'followed': self.user1.id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_double_follow(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.post('/api/followers/', {'followed': self.user2.id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.post('/api/followers/', {'followed': self.user2.id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('You are already following this user', str(response.data))