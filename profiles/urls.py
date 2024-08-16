from django.urls import path
from .views import ProfileList, ProfileDetail, ProfileListMostFollowed

urlpatterns = [
    path('profiles/', ProfileList.as_view()),
    path('profiles/<int:pk>/', ProfileDetail.as_view()),
    path('profiles/most_followed/', ProfileListMostFollowed.as_view()),
]
