from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Message


class MessageTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', password='password')
        self.user2 = User.objects.create_user(username='user2', password='password')
        self.client.login(username='user1', password='password')

    def test_send_message(self):
        url = '/messaging/send/'
        data = {'recipient': self.user2.id, 'content': 'Hello!'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Message.objects.count(), 1)
        self.assertEqual(Message.objects.get().content, 'Hello!')

    def test_receive_messages(self):
        
        # Clear existing messages to ensure a clean state
        Message.objects.all().delete()
    
        # Create a new message for the test
        Message.objects.create(sender=self.user1, recipient=self.user2, content='Hello!')
        
        # Login as user2 to receive messages
        self.client.login(username='user2', password='password')
        url = '/messaging/'
        response = self.client.get(url, format='json')
        
        # Check the response status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        # Check the content of the received message
        self.assertEqual(response.data['results'][0]['content'], 'Hello!')
        
