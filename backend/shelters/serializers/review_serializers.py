
from rest_framework import serializers
from accounts.models.seekers import CustomUser, PetSeeker
from ..models.shelter import PetShelter
from ..models.reviews import Review
from chats.models.messages import Message
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from chats.serializers.message_serializers import MessageSerializer
from django.contrib.contenttypes.models import ContentType


class ReviewSerializer(serializers.ModelSerializer):

    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['creation_time', 'shelter', 'seeker', 'user']


