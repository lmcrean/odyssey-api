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
        print(f"Performing create: Recipient ID: {recipient_id}")
        try:
            recipient = User.objects.get(id=recipient_id)
            print(f"Recipient found: {recipient}")
        except User.DoesNotExist:
            print("Recipient does not exist")
            raise ValidationError('Recipient does not exist')

        # Pass recipient_id to the serializer
        serializer.save(sender=self.request.user, recipient=recipient)
        print(f"Message created: {serializer.instance}")