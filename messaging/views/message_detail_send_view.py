from rest_framework import generics, status, serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from messaging.models import Message
from messaging.serializers import MessageSerializer

class MessageDetailSendView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        recipient_id = self.kwargs['user_id']
        try:
            recipient = User.objects.get(id=recipient_id)
            if recipient == self.request.user:
                raise serializers.ValidationError({'detail': 'Cannot send a message to yourself'})
        except User.DoesNotExist:
            raise serializers.ValidationError({'detail': 'Recipient does not exist'})
        serializer.save(sender=self.request.user, recipient=recipient)

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except serializers.ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:

            return Response({'detail': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)