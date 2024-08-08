# drf-api/messaging/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from messaging.models import Message


class MessageSerializer(serializers.ModelSerializer):
    date = serializers.SerializerMethodField()
    time = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = ['id', 'sender', 'recipient', 'content', 'image', 'date', 'time', 'read']
        read_only_fields = ['id', 'sender', 'date', 'time', 'read', 'recipient']
    
    def get_date(self, obj):
        return obj.timestamp.strftime('%d %b %Y')
    
    def get_time(self, obj):
        return obj.timestamp.strftime('%H:%M')