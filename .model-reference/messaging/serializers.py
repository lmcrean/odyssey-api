from rest_framework import serializers
from django.contrib.auth.models import User
from messaging.models import Message
from profiles.models import Profile
from django.utils import timezone
from django.db.models import Q
from PIL import Image

class MessageSerializer(serializers.ModelSerializer):
    date = serializers.SerializerMethodField()
    time = serializers.SerializerMethodField()
    sender_profile_image = serializers.SerializerMethodField()
    recipient_profile_image = serializers.SerializerMethodField()
    is_sender = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    last_message_time = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'sender', 'recipient', 'content', 'image', 'date', 'time', 'read',
                  'sender_profile_image', 'recipient_profile_image', 'is_sender', 'last_message', 'last_message_time']
        read_only_fields = ['id', 'sender', 'date', 'time', 'read', 'recipient']

    def get_date(self, obj):
        return obj.timestamp.strftime('%d %b %Y')

    def get_time(self, obj):
        return obj.timestamp.strftime('%H:%M')

    def get_sender_profile_image(self, obj):
        try:
            profile = Profile.objects.get(owner=obj.sender)
            return profile.image.url if profile.image else 'https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg'
        except Profile.DoesNotExist:
            return 'https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg'

    def get_recipient_profile_image(self, obj):
        try:
            profile = Profile.objects.get(owner=obj.recipient)
            return profile.image.url if profile.image else 'https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg'
        except Profile.DoesNotExist:
            return 'https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg'

    def get_is_sender(self, obj):
        request = self.context.get('request')
        return obj.sender == request.user if request else False

    def get_last_message(self, obj):
        last_message_obj = Message.objects.filter(
            (Q(sender=obj.sender) & Q(recipient=obj.recipient)) |
            (Q(sender=obj.recipient) & Q(recipient=obj.sender))
        ).order_by('-timestamp').first()
        
        if last_message_obj:
            if len(last_message_obj.content) > 50:
                return last_message_obj.content[:50] + '...'
            return last_message_obj.content
        return None

    def get_last_message_time(self, obj):
        # Retrieve the time or date of the most recent message
        last_message_obj = Message.objects.filter(
            (Q(sender=obj.sender) & Q(recipient=obj.recipient)) |
            (Q(sender=obj.recipient) & Q(recipient=obj.sender))
        ).order_by('-timestamp').first()

        if last_message_obj:
            time_difference = timezone.now() - last_message_obj.timestamp
            if time_difference.days > 365:
                return last_message_obj.timestamp.strftime('%d %b %Y')
            elif time_difference.days >= 1:
                return last_message_obj.timestamp.strftime('%d %b')
            else:
                return last_message_obj.timestamp.strftime('%H:%M')
        return None

    def validate_image(self, image):
        if image.size > 5 * 1024 * 1024:  # 5MB limit
            raise serializers.ValidationError("Image file too large (max 5MB)")

        try:
            img = Image.open(image)
            img.verify()  # Verifies the image without loading the full content
        except:
            raise serializers.ValidationError("Invalid image file")
        
        return image

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.image:
            representation['image'] = instance.image.url
        return representation