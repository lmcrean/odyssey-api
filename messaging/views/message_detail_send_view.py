# drf-api/messaging/views/message_detail_send_view.py

# the user is able to send a message
# that will append to MessageDetailView
# just like in a Whatsapp chat or any classic chat interface

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework.exceptions import ValidationError
from messaging.models import Message
from messaging.serializers import MessageSerializer

class MessageDetailSendView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        recipient_id = self.kwargs['user_id']
        try:
            recipient = User.objects.get(id=recipient_id)
        except User.DoesNotExist:
            raise ValidationError('Recipient does not exist')
        serializer.save(sender=self.request.user, recipient=recipient)

