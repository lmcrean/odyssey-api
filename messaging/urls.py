# messaging/urls.py

from django.urls import path
from .views import MessageListView, MessageCreateView, MessageDetailView

urlpatterns = [
    path('messaging/', MessageListView.as_view(), name='message-list'),
    path('messaging/send/',
         MessageCreateView.as_view(), name='message-create'),
    path('messaging/<int:pk>/', MessageDetailView.as_view(),
         name='message-detail'),
]
