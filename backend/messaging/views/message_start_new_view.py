# drf_api/messaging/views/message_start_new_view.py

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.contrib.auth.models import User
from messaging.models import Message
from messaging.serializers import MessageSerializer

class MessageListStartNewView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        recipient_id = self.kwargs['user_id']
        
        if not recipient_id:
            raise ValidationError('Recipient ID is required.')

        try:
            recipient = User.objects.get(id=recipient_id)

        except User.DoesNotExist:

            raise ValidationError('Recipient does not exist.')

        if recipient == self.request.user:
            raise ValidationError('Cannot start a chat with yourself.')

        serializer.save(sender=self.request.user, recipient=recipient)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response(response.data, status=status.HTTP_201_CREATED)
