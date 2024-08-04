# drf-api/messaging/views/message_detail_send_view.py

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from messaging.models import Message
from messaging.serializers import MessageSerializer
from rest_framework.exceptions import ValidationError

class MessageDetailSendView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        recipient_id = self.kwargs['user_id']
        try:
            recipient = User.objects.get(id=recipient_id)
        except User.DoesNotExist:
            raise ValidationError('Recipient does not exist')
        serializer.save(sender=self.request.user, recipient_id=recipient_id)