from django.urls import path

from rest_framework_simplejwt.views import TokenObtainPairView

from .views.shelter import PetShelterSignUpView, ShelterImageCreateView, ShelterImageDeleteView,ShelterRetrieveUpdateDestroyView

from .views.shelter import PetShelterListView, shelter_login, google_login
from .views.reviews import CreateListView, CreateReviewMessageView, MessageListAPIView

app_name = 'shelter'

urlpatterns = [
    path('account/', PetShelterSignUpView.as_view(), name='signup'),
    path('token/', shelter_login, name='login'),
    path('api/auth/google/', google_login, name='google_login'),
    path('<int:shelter_pk>/', ShelterRetrieveUpdateDestroyView.as_view(), name='detail'),
    path('', PetShelterListView.as_view(), name='list'),
    path('<int:shelter_pk>/review/', CreateListView.as_view(), name='list-head-review'),
    path('<int:shelter_pk>/review/<int:review_pk>/', MessageListAPIView.as_view(), name='list_review'),
    path('<int:shelter_pk>/review/<int:review_pk>/message/', CreateReviewMessageView.as_view(), name='create_review_message'),
    #path('<int:shelter_pk>/pet/', CreatePetView.as_view(), name='create_pet'),
    #path('<int:shelter_pk>/pet/<int:pet_pk>/', PetDetailView.as_view(), name='pet_detail'),
    path('<int:shelter_pk>/image/', ShelterImageCreateView.as_view(), name='create'),
    path('<int:shelter_pk>/image/<int:image_pk>/', ShelterImageDeleteView.as_view(), name='delete'),
]