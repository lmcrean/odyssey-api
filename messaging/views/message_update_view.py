# drf_api/messaging/views/message_update_view.py
 
from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from messaging.models import Message
from messaging.serializers import MessageSerializer

class MessageUpdateView(generics.UpdateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        message = super().get_object()
        if message.sender != self.request.user:
            raise PermissionDenied('You do not have permission to edit this message.')
        return message