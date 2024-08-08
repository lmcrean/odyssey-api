# drf-api/messaging/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from messaging.models import Message


class MessageSerializer(serializers.ModelSerializer):
    formatted_timestamp = serializers.SerializerMethodField()
    class Meta:
        model = Message
        fields = ['id', 'sender', 'recipient', 'content', 'image', 'formatted_timestamp', 'read']
        read_only_fields = ['id', 'sender', 'formatted_timestamp', 'read', 'recipient']
    
    def get_formatted_timestamp(self, obj):
        return obj.timestamp.strftime('%d %b %Y %H:%M')