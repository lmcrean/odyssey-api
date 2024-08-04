# messaging/urls.py

from django.urls import path
from .views import MessageListView, MessageDetailView

urlpatterns = [
    path('messages/', MessageListView.as_view(), name='message-list'),
    path('messages/<int:user_id>/', MessageDetailView.as_view(), name='message-detail'),
]