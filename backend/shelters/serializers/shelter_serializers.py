from rest_framework import serializers
from accounts.models.seekers import CustomUser
from ..models.shelter import PetShelter, ShelterImage
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password

class PetShelterSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)

class PetShelterSignUpSerializer(serializers.ModelSerializer):
    shelter_name = serializers.CharField(write_only=True, max_length=30, required=True)
    password1 = serializers.CharField(write_only=True, max_length=30, required=True)
    class Meta:
        model = CustomUser
        fields = ['username', 'password', 'email', 'shelter_name', 'password1']

    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            # Catch ValidationError and raise a Serializer error
            error_messages = ' '.join(map(str, e.messages))
            raise serializers.ValidationError(error_messages)

        return value

    def validate_password1(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            # Catch ValidationError and raise a Serializer error
            error_messages = ' '.join(map(str, e.messages))
            raise serializers.ValidationError(error_messages)

        return value

    def validate(self, data):

        data = super().validate(data)

        return data

class ShelterImageSerializer(serializers.ModelSerializer):
    class Meta: 
        model = ShelterImage
        fields = ['image_file', 'id']
        read_only_fields = ['id']


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username','phone_number', 'address', 'email', 'profile_photo']
        read_only_fields = ['id', 'username']

class PetShelterRetrieveSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()
    shelter_images = ShelterImageSerializer(many=True, read_only=True)

    class Meta:
        model = PetShelter
        fields = [ 'shelter_name', 'mission_statement', 'user', 'shelter_images', 'id']
        

        
class CustomUserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username','phone_number', 'password', 'address', 'email', 'profile_photo']
        read_only_fields = ['username']
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'read_only': True}
        }
    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            # Catch ValidationError and raise a Serializer error
            error_messages = ' '.join(map(str, e.messages))
            raise serializers.ValidationError(error_messages)

        return value

    def validate(self, data):

        data = super().validate(data)

        return data

"""
Must send array of images want to keep
"""
class PetShelterUpdateSerializer(serializers.ModelSerializer):
    user = CustomUserUpdateSerializer(required=False)
    shelter_images = ShelterImageSerializer(many=True, read_only=True)
    class Meta: 
        model = PetShelter
        fields = ['shelter_name', 'mission_statement', 'user', 'shelter_images']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        if user_data:
            user_serializer = CustomUserUpdateSerializer(instance.user, data=user_data, partial=True)
            if user_serializer.is_valid():
                user_serializer.save()

        return super().update(instance, validated_data)
    