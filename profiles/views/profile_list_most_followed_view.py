from django.db.models import Count
from rest_framework import generics
from profiles.models import Profile
from profiles.serializers import ProfileSerializer

class ProfileListMostFollowed(generics.ListAPIView):
    """
    API view to list profiles ordered by the number of followers, 
    including posts, post count, followers count, and last updated.
    """
    serializer_class = ProfileSerializer

    def get_queryset(self):
        # Annotate profiles with followers_count, posts_count, and order by followers_count in descending order
        return Profile.objects.annotate(
            followers_count=Count('owner__followed', distinct=True),
            posts_count=Count('owner__post', distinct=True)  # Count posts
        ).order_by('-followers_count')
