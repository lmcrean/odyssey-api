# messaging/views/message_detail_view.py

# passed testing - this was working perfectly as a simple view to read a thread of messages. 

# MessageDetailSend view is now being developed to append messages on to the end

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