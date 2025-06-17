# messaging/views/message_detail_view.py

from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from messaging.models import Message
from messaging.serializers import MessageSerializer

class MessageDetailView(ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        other_user_id = self.kwargs['user_id']
        return Message.objects.filter(
            (Q(sender=user) & Q(recipient_id=other_user_id)) |
            (Q(sender_id=other_user_id) & Q(recipient=user))
        ).order_by('timestamp')

    def perform_destroy(self, instance):
        if instance.sender != self.request.user:
            raise ValidationError('You do not have permission to delete this message.')
        instance.delete()

    def get_serializer_context(self):
        return {'request': self.request}