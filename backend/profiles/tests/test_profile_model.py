from django.test import TestCase
from django.contrib.auth.models import User
from profiles.models import Profile

class ProfileModelTest(TestCase):

    def test_default_profile_image_url(self):
        # Create a new user, which should trigger profile creation
        user = User.objects.create(username="testuser")
        profile = Profile.objects.get(owner=user)

        # Verify that the profile image URL matches the generated Cloudinary URL
        expected_url = 'https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg'

        self.assertEqual(profile.image.url, expected_url)
