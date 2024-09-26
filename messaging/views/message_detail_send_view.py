from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Q
from messaging.models import Message
from messaging.serializers import MessageSerializer

class MessageDetailSendView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        recipient_id = self.kwargs['user_id']
        print(f"Recipient ID: {recipient_id}")

        try:
            recipient = User.objects.get(id=recipient_id)
            print(f"Recipient found: {recipient.username}, ID: {recipient.id}")
        except User.DoesNotExist:
            print(f"No user found with ID: {recipient_id}")
            return Response({'detail': 'Recipient does not exist'}, status=status.HTTP_404_NOT_FOUND)

        if recipient == self.request.user:
            return Response({'detail': 'Cannot send a message to yourself'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if a chat already exists
        existing_chat = Message.objects.filter(
            Q(sender=self.request.user, recipient=recipient) |
            Q(sender=recipient, recipient=self.request.user)
        ).exists()

        if not existing_chat:
            print(f"Creating new chat between {self.request.user.username} and {recipient.username}")
        else:
            print(f"Appending to existing chat between {self.request.user.username} and {recipient.username}")

        serializer.save(sender=self.request.user, recipient=recipient)

    def create(self, request, *args, **kwargs):
        print(f"Received data: {request.data}")
        response = super().create(request, *args, **kwargs)
        print(f"Message created: {response.data}")
        return response