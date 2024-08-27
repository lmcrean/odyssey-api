# messaging/models.py

from django.db import models
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField


class Message(models.Model):
    sender = models.ForeignKey(
        User,
        related_name='sent_messages',
        on_delete=models.CASCADE
    )
    recipient = models.ForeignKey(
        User,
        related_name='received_messages',
        on_delete=models.CASCADE
    )
    content = models.TextField(blank=True)
    image = CloudinaryField('image', blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return (
            f'Message from {self.sender} to {self.recipient} '
            f'at {self.timestamp}'
        )
