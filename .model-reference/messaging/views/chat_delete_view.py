# drf_api/messaging/views/chat_delete_view.py

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, NotFound
from messaging.models import Message
from django.db.models import Q

class ChatDeleteView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, user_id):
        current_user = request.user

        # Fetch messages between current user and the specified user_id
        messages = Message.objects.filter(
            (Q(sender=current_user) & Q(recipient_id=user_id)) |
            (Q(sender_id=user_id) & Q(recipient=current_user))
        )

        if not messages.exists():
            return Response({"detail": "Chat not found."}, status=status.HTTP_404_NOT_FOUND)

        # Check if current user has permission to delete these messages
        if not all(msg.sender == current_user or msg.recipient == current_user for msg in messages):
            raise PermissionDenied("You do not have permission to delete this chat.")

        # Delete the messages
        messages.delete()

        return Response({"detail": "Chat deleted successfully."}, status=status.HTTP_200_OK)
