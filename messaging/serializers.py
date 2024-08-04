# drf-api/messaging/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from messaging.models import Message

class MessageSerializer(serializers.ModelSerializer):
    recipient_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Message
        fields = ['id', 'sender', 'recipient', 'recipient_id', 'content', 'image', 'timestamp', 'read']
        read_only_fields = ['id', 'sender', 'timestamp', 'read', 'recipient']

    def create(self, validated_data):
        recipient_id = validated_data.pop('recipient_id')
        recipient = User.objects.get(id=recipient_id)
        validated_data['recipient'] = recipient
        message = Message.objects.create(**validated_data)
        return message