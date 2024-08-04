# drf-api/messaging/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from messaging.models import Message

class MessageSerializer(serializers.ModelSerializer):
    recipient_id = serializers.IntegerField(write_only=True)

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'sender', 'recipient', 'content', 'image', 'timestamp', 'read']
        read_only_fields = ['id', 'sender', 'timestamp', 'read', 'recipient']