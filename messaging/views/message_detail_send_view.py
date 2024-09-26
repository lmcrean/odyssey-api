from rest_framework import generics, status, serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from messaging.models import Message
from messaging.serializers import MessageSerializer
from profiles.models import Profile
from django.core.exceptions import ObjectDoesNotExist


class MessageDetailSendView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        sender = self.request.user
        sender_profile = Profile.objects.get(owner=sender)
        recipient_id = self.kwargs['user_id']
        all_user_ids = list(User.objects.values_list('id', flat=True))


        try:
            recipient = User.objects.get(id=recipient_id)
            recipient_profile = Profile.objects.get(owner=recipient)

            if recipient == sender:
                raise serializers.ValidationError({'detail': 'Cannot send a message to yourself'})
            
            serializer.save(sender=sender, recipient=recipient)
        except ObjectDoesNotExist as e:
            raise serializers.ValidationError({'detail': f'Recipient not found: {str(e)}'})
        except Exception as e:
            raise

        

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except serializers.ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'detail': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)