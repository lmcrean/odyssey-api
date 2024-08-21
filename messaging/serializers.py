from rest_framework import serializers
from django.contrib.auth.models import User
from messaging.models import Message
from profiles.models import Profile

class MessageSerializer(serializers.ModelSerializer):
    date = serializers.SerializerMethodField()
    time = serializers.SerializerMethodField()
    sender_profile_image = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'sender', 'recipient', 'content', 'image', 'date', 'time', 'read', 'sender_profile_image']
        read_only_fields = ['id', 'sender', 'date', 'time', 'read', 'recipient']

    def get_date(self, obj):
        return obj.timestamp.strftime('%d %b %Y')

    def get_time(self, obj):
        return obj.timestamp.strftime('%H:%M')

    def get_sender_profile_image(self, obj):
        profile = Profile.objects.get(user=obj.sender)
        return profile.image.url if profile.image else None
