from rest_framework import serializers
from .models import Follower
from django.contrib.auth.models import User

class FollowerSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    followed_name = serializers.ReadOnlyField(source='followed.username')

    class Meta:
        model = Follower
        fields = [
            'id', 'owner', 'created_at', 'followed', 'followed_name'
        ]

    def validate_followed(self, value):
        request = self.context['request']

        if value == request.user:
            raise serializers.ValidationError("You can't follow yourself.")

        if Follower.objects.filter(owner=request.user, followed=value).exists():
            raise serializers.ValidationError("You are already following this user.")

        return value

    def validate(self, data):
        if not User.objects.filter(pk=data['followed'].pk).exists():
            raise serializers.ValidationError({"followed": "The user you are trying to follow does not exist."})
        return data

    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise serializers.ValidationError({'detail': 'possible duplicate'})