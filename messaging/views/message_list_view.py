# views/message_list_view.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.contrib.auth.models import User
from profiles.models import Profile


class MessageListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        messages = User.objects.filter(
            Q(sent_messages__recipient=user) | Q(received_messages__sender=user)
        ).distinct()

        message_data = []
        for message in messages:
            # Get recipient profile image or fallback to default
            try:
                profile = Profile.objects.get(owner=message)
                recipient_profile_image = profile.image.url if profile.image else 'https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg'
            except Profile.DoesNotExist:
                recipient_profile_image = 'https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg'

            # Append data to message_data list
            message_data.append({
                "id": message.id,
                "username": message.username,
                "recipient_profile_image": recipient_profile_image,
            })

        return Response(message_data)