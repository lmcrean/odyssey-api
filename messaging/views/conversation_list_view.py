# views/conversation_list_view.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
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
