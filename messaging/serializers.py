# messaging/serializers.py

from rest_framework import serializers
from .models import Message


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = [
            'id', 'sender', 'recipient', 'content', 'image', 'timestamp', 'read']
        read_only_fields = ['id', 'sender', 'timestamp', 'read']