from django.contrib.auth.models import User
from posts.models import Post
from rest_framework import status
from rest_framework.test import APITestCase
import json

class PostDetailViewTests(APITestCase):
    def setUp(self):
        adam = User.objects.create_user(username='adam', password='pass')
        brian = User.objects.create_user(username='brian', password='pass')
        Post.objects.create(
            owner=adam, title='a title', content='adams content'
        )
        Post.objects.create(
            owner=brian, title='another title', content='brians content'
        )

    def test_can_retrieve_post_using_valid_id(self):
        response = self.client.get('/api/posts/1/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        self.assertEqual(data['title'], 'a title')

    def test_cant_retrieve_post_using_invalid_id(self):
        response = self.client.get('/api/posts/999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_can_update_own_post(self):
        self.client.login(username='adam', password='pass')
        response = self.client.put('/api/posts/1/', {'title': 'a new title'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        post = Post.objects.filter(pk=1).first()
        self.assertEqual(post.title, 'a new title')

    def test_user_cant_update_another_users_post(self):
        self.client.login(username='adam', password='pass')
        response = self.client.put('/api/posts/2/', {'title': 'a new title'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)