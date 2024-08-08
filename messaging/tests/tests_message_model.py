# messaging/tests/tests_message_model.py

from django.test import TestCase
from django.utils import timezone
from django.contrib.auth.models import User
from messaging.models import Message
from freezegun import freeze_time

class MessageModelTests(TestCase):

    def setUp(self):
        self.sender = User.objects.create(username='sender')
        self.recipient = User.objects.create(username='recipient')

    @freeze_time("2024-08-08 15:30:00")
    def test_message_timestamp(self):
        message = Message.objects.create(
            sender=self.sender,
            recipient=self.recipient,
            content="Test message"
        )
        self.assertEqual(message.timestamp, timezone.now())
