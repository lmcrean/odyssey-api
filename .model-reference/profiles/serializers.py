from rest_framework import serializers
from .models import Profile
from followers.models import Follower
from posts.models import Post


class ProfileSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField()
    following_id = serializers.SerializerMethodField()
    posts_count = serializers.ReadOnlyField()
    followers_count = serializers.ReadOnlyField()
    following_count = serializers.ReadOnlyField()
    posts = serializers.SerializerMethodField()
    user_id = serializers.ReadOnlyField(source='owner.id')

    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner

    def get_following_id(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            following = Follower.objects.filter(
                owner=user, followed=obj.owner
            ).first()
            return following.id if following else None
        return None

    def get_posts(self, obj):
        # Query for the latest six posts by the profile owner
        posts = Post.objects.filter(owner=obj.owner).order_by('-created_at')[:6]
        return [post.image.url for post in posts]  # Return only the image URLs

    class Meta:
        model = Profile
        fields = [
            'id', 'owner', 'created_at', 'updated_at', 'name',
            'content', 'image', 'is_owner', 'following_id',
            'posts_count', 'followers_count', 'following_count',
            'posts', 'user_id',
        ]