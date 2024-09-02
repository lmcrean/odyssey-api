from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from posts.models import Post
from comments.models import Comment
from likes.models import Like
from profiles.models import Profile
import json
from django.db import IntegrityError

class Command(BaseCommand):
    help = 'Populate the database with initial data'

    def handle(self, *args, **options):
        with open('mock_data.json', 'r') as file:
            data = json.load(file)

        # First, create all users
        for profile_data in data['profiles']:
            try:
                user = User.objects.create_user(username=profile_data['username'], password='password123')
            except IntegrityError:
                user = User.objects.get(username=profile_data['username'])

            profile, _ = Profile.objects.get_or_create(owner=user)
            profile.name = profile_data.get('name', '')
            profile.content = profile_data.get('content', '')
            profile.save()

        # Then, create posts, comments, and likes
        for profile_data in data['profiles']:
            user = User.objects.get(username=profile_data['username'])
            if 'posts' in profile_data:
                for post_data in profile_data['posts']:
                    post, _ = Post.objects.get_or_create(
                        owner=user,
                        title=post_data['title'],
                        defaults={
                            'content': post_data['content'],
                            'image': post_data.get('image', '')
                        }
                    )

                    for comment_data in post_data.get('comments', []):
                        comment_user = User.objects.get(id=comment_data['user_id'])
                        Comment.objects.get_or_create(
                            owner=comment_user,
                            post=post,
                            content=comment_data['content']
                        )

                    for like_id in post_data.get('likes', []):
                        like_user = User.objects.get(id=like_id)
                        Like.objects.get_or_create(owner=like_user, post=post)
            else:
                print(f"User {user.username} has no posts.")
                continue

        self.stdout.write(self.style.SUCCESS('Successfully populated the database'))