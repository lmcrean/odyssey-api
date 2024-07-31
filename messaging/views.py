from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Message
from .serializers import MessageSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from django.contrib.auth.models import User


class ConversationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        conversations = User.objects.filter(
            Q(sent_messages__recipient=user) | Q(received_messages__sender=user)
        ).distinct()

        conversation_data = [
            {"id": conversation.id, "username": conversation.username}
            for conversation in conversations
        ]
        return Response(conversation_data)



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


class MessageCreateView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


class MessageDetailView(generics.RetrieveAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(
            recipient=self.request.user
        ) | Message.objects.filter(
            sender=self.request.user
        )
