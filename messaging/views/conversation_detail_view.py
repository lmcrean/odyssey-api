# messaging/views/conversation_detail_view.py

from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from messaging.models import Message
from messaging.serializers import MessageSerializer

class ConversationDetailView(ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        other_user_id = self.kwargs['user_id']
        return Message.objects.filter(
            (Q(sender=user) & Q(recipient_id=other_user_id)) |
            (Q(sender_id=other_user_id) & Q(recipient=user))
        ).order_by('timestamp')