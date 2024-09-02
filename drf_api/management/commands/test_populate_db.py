from django.test import TestCase
from unittest.mock import patch, mock_open
from django.core.management import call_command
from django.contrib.auth.models import User
from posts.models import Post
from comments.models import Comment
from likes.models import Like
import json

class TestPopulateDb(TestCase):
    def setUp(self):
        self.mock_data = {
            "profiles": [
                {
                    "id": 1,
                    "username": "testuser",
                    "name": "Test User",
                    "content": "Test content",
                    "posts": [
                        {
                            "title": "Test Post",
                            "content": "Test content",
                            "image": "test_image.jpg",
                            "likes": [2],
                            "comments": [
                                {"user_id": 2, "content": "Test comment"}
                            ]
                        }
                    ]
                },
                {
                    "id": 2,
                    "username": "testuser2",
                    "name": "Test User 2",
                    "content": "Test content 2"
                }
            ]
        }

    @patch('builtins.open', new_callable=mock_open)
    def test_populate_db(self, mock_file):
        mock_file.return_value.__enter__.return_value.read.return_value = json.dumps(self.mock_data)
        
        call_command('populate_db')

        # Check if users were created
        self.assertEqual(User.objects.count(), 2)
        user1 = User.objects.get(username='testuser')
        self.assertEqual(user1.profile.name, 'Test User')
        self.assertEqual(user1.profile.content, 'Test content')

        # Check if post was created
        self.assertEqual(Post.objects.count(), 1)
        post = Post.objects.first()
        self.assertEqual(post.title, 'Test Post')
        self.assertEqual(post.content, 'Test content')
        self.assertEqual(post.image, 'test_image.jpg')

        # Check if likes were created
        self.assertEqual(Like.objects.count(), 1)
        like = Like.objects.first()
        self.assertEqual(like.owner, User.objects.get(username='testuser2'))
        self.assertEqual(like.post, post)

        # Check if comment was created
        self.assertEqual(Comment.objects.count(), 1)
        comment = Comment.objects.first()
        self.assertEqual(comment.content, 'Test comment')
        self.assertEqual(comment.owner, User.objects.get(username='testuser2'))

        # Check user without posts
        user2 = User.objects.get(username='testuser2')
        self.assertEqual(user2.profile.name, 'Test User 2')
        self.assertEqual(user2.profile.content, 'Test content 2')
        self.assertEqual(user2.post_set.count(), 0)