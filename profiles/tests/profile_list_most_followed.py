from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from profiles.models import Profile
from posts.models import Post
from followers.models import Follower


class ProfileListMostFollowedViewTest(APITestCase):
    def setUp(self):
        # Create users and their profiles if they don't already exist
        self.user1, _ = User.objects.get_or_create(username='user1', password='pass')
        self.user2, _ = User.objects.get_or_create(username='user2', password='pass')
        self.user3, _ = User.objects.get_or_create(username='user3', password='pass')

        # Check if profiles already exist and create if not
        self.profile1, _ = Profile.objects.get_or_create(owner=self.user1, defaults={'name': "User 1"})
        self.profile2, _ = Profile.objects.get_or_create(owner=self.user2, defaults={'name': "User 2"})
        self.profile3, _ = Profile.objects.get_or_create(owner=self.user3, defaults={'name': "User 3"})

        # Add followers
        Follower.objects.create(owner=self.user1, followed=self.user2)
        Follower.objects.create(owner=self.user3, followed=self.user2)
        Follower.objects.create(owner=self.user1, followed=self.user3)

        # Add 6 posts for each user with Cloudinary URLs
        for i in range(1, 7):
            Post.objects.get_or_create(
                owner=self.user1,
                title=f"User 1 Post {i}",
                defaults={'image': f"https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/user1_{i}.jpg"}
            )
            Post.objects.get_or_create(
                owner=self.user2,
                title=f"User 2 Post {i}",
                defaults={'image': f"https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/user2_{i}.jpg"}
            )
            Post.objects.get_or_create(
                owner=self.user3,
                title=f"User 3 Post {i}",
                defaults={'image': f"https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/user3_{i}.jpg"}
            )
        pass

    def test_most_followed_profiles(self):
        response = self.client.get('/profiles/most_followed/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Ensure 3 profiles are returned within the 'results' field
        results = response.data['results']
        self.assertEqual(len(results), 3, msg=f"Expected 3 profiles, got {len(results)}. Data: {results}")

        # Check if the profiles are ordered by follower count
        self.assertEqual(results[0]['id'], self.profile2.id, msg=f"Expected profile2 to be first, got {results[0]}")
        self.assertEqual(results[1]['id'], self.profile3.id, msg=f"Expected profile3 to be second, got {results[1]}")
        self.assertEqual(results[2]['id'], self.profile1.id, msg=f"Expected profile1 to be third, got {results[2]}")

        # Check the follower counts
        self.assertEqual(results[0]['followers_count'], 2, msg=f"Expected 2 followers for profile2, got {results[0]['followers_count']}")
        self.assertEqual(results[1]['followers_count'], 1, msg=f"Expected 1 follower for profile3, got {results[1]['followers_count']}")
        self.assertEqual(results[2]['followers_count'], 0, msg=f"Expected 0 followers for profile1, got {results[2]['followers_count']}")

        # Check that each user has exactly 6 posts returned
        self.assertEqual(results[0]['posts_count'], 6, msg=f"Expected 6 posts for profile2, got {results[0]['posts_count']}")
        self.assertEqual(len(results[0]['posts']), 6, msg=f"Expected 6 post URLs for profile2, got {len(results[0]['posts'])}")

        # Ensure the URLs are in the Cloudinary format
        for i in range(6):
            self.assertTrue(results[0]['posts'][i].startswith('https://res.cloudinary.com/'), msg=f"Post URL {results[0]['posts'][i]} is not in the expected format")

        # Confirm specific post URLs for user2
        self.assertEqual(results[0]['posts'][0], "https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/user2_1.jpg")
        self.assertEqual(results[0]['posts'][5], "https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/user2_6.jpg")

        pass

    pass