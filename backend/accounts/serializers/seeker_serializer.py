from rest_framework import serializers

from accounts.models.seekers import CustomUser, PetSeeker
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from ..models import CustomUser

def validate_letters(value):
    if not value.isalpha():
        raise ValidationError('Only letters are allowed.')


class PetSeekerSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)



class PetSeekerSignUpSerializer(serializers.ModelSerializer):
    firstname = serializers.CharField( max_length=30,required=True, validators=[validate_letters])
    lastname = serializers.CharField( max_length=30,required=True, validators=[validate_letters])
    password1 = serializers.CharField( max_length=30,required=True)
    
    class Meta:
        model = CustomUser
        fields = ['username', 'password', 'email', 'firstname', 'lastname', 'password1']

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




class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'phone_number', 'address', 'email', 'profile_photo']
        read_only_fields = ['username']


class PetSeekerRetrieveSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()

    class Meta:
        model = PetSeeker
        fields = ['firstname','lastname', 'user']

class CustomUserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username','phone_number', 'password', 'address', 'email', 'profile_photo']
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'read_only': True},
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

class PetSeekerUpdateSerializer(serializers.ModelSerializer):
    user = CustomUserUpdateSerializer(required=False)
    class Meta: 
        model = PetSeeker
        fields = ['firstname','lastname', 'user','dog_notification','cat_notification','other_notification']
    def validate_firstname(self, value):
        if not value.isalpha():
            raise serializers.ValidationError('Only letters are allowed for the firstname.')
        return value

    def validate_lastname(self, value):
        if not value.isalpha():
            raise serializers.ValidationError('Only letters are allowed for the lastname.')
        return value