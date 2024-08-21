# drf-api/messaging/serializers.py

from rest_framework import serializers
from messaging.models import Message
from profiles.models import Profile

class MessageSerializer(serializers.ModelSerializer):
    date = serializers.SerializerMethodField()
    time = serializers.SerializerMethodField()
    sender_profile_image = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'sender', 'sender_profile_image', 'recipient', 'content', 'image', 'date', 'time', 'read']
        read_only_fields = ['id', 'sender', 'sender_profile_image', 'date', 'time', 'read', 'recipient']
    
    def get_date(self, obj):
        return obj.timestamp.strftime('%d %b %Y')
    
    def get_time(self, obj):
        return obj.timestamp.strftime('%H:%M')

    def get_sender_profile_image(self, obj):
        # Return the sender's profile image URL, if available
        if hasattr(obj.sender, 'profile') and obj.sender.profile.image:
            return obj.sender.profile.image.url
        return None