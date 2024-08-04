# views/message_list_view.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.contrib.auth.models import User


class MessageListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        messages = User.objects.filter(
            Q(sent_messages__recipient=user) | Q(received_messages__sender=user)
        ).distinct()

        message_data = [
            {"id": message.id, "username": message.username}
            for message in messages
        ]
        return Response(message_data)
