# drf_api/messaging/views/message_delete_view.py

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from messaging.models import Message
from messaging.serializers import MessageSerializer

class MessageDeleteView(generics.DestroyAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        try:
            message = Message.objects.get(pk=self.kwargs['pk'])
        except Message.DoesNotExist:
            raise NotFound("Message not found.")
        
        if message.sender != self.request.user:
            raise PermissionDenied("You do not have permission to delete this message.")
        
        return message