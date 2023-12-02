# urls.py

from django.urls import path

from rest_framework_simplejwt.views import TokenObtainPairView
from .views import PetSeekerSignUpView, seeker_login, SeekerRetrieveUpdateDestroyView,CustomUserRetrieveView


app_name = 'seeker'

urlpatterns = [
    path('account/', PetSeekerSignUpView.as_view(), name='signup'),
    path('token/', seeker_login, name='login'),
    path('<int:seeker_pk>/', SeekerRetrieveUpdateDestroyView.as_view(), name='seeker_detail'),
    path('customuser/<int:user_pk>/', CustomUserRetrieveView.as_view(), name='user_detail'),
]
