# views/message_list_view.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.contrib.auth.models import User
from profiles.models import Profile
from messaging.models import Message
from messaging.serializers import MessageSerializer


class MessageListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        # Fetch users who have sent/received messages with the current user
        message_users = User.objects.filter(
            Q(sent_messages__recipient=user) | Q(received_messages__sender=user)
        ).distinct()

        message_data = []
        for message_user in message_users:
            # Get recipient profile image or fallback to default
            try:
                profile = Profile.objects.get(owner=message_user)
                recipient_profile_image = profile.image.url if profile.image else 'https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg'
            except Profile.DoesNotExist:
                recipient_profile_image = 'https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg'

            # Get the most recent message between the user and message_user
            last_message_obj = Message.objects.filter(
                (Q(sender=user) & Q(recipient=message_user)) |
                (Q(sender=message_user) & Q(recipient=user))
            ).order_by('-timestamp').first()

            if last_message_obj:
                serializer = MessageSerializer(last_message_obj, context={'request': request})
                message_data.append({
                    "id": message_user.id,
                    "username": message_user.username,
                    "recipient_profile_image": recipient_profile_image,
                    "last_message": serializer.data['last_message'],
                    "last_message_time": serializer.data['last_message_time']
                })

        return Response(message_data)