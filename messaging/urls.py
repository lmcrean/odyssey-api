# messaging/urls.py

from django.urls import path
from .views import ConversationListView, ConversationDetailView

urlpatterns = [
    path('conversations/', ConversationListView.as_view(), name='conversation-list'),
    path('conversations/<int:user_id>/', ConversationDetailView.as_view(), name='conversation-detail'),
]