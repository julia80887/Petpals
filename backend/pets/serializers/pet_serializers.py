from rest_framework import serializers
from accounts.models import CustomUser
from ..models import PetImage, Pet
from shelters.models import PetShelter
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password


class PetImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetImage
        fields = ('id', 'image_file')
        read_only_fields = ['id']

class PetShelterSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetShelter
        fields = '__all__'
        read_only_fields = ('user',)

class PetRetrieveSerializer(serializers.ModelSerializer):
    shelter = PetShelterSerializer(required=False)
    pet_images = PetImageSerializer(many=True, read_only=True)

    class Meta:
        model = Pet
        fields = '__all__'
        read_only_fields = ('publication_date', 'shelter', 'pet_images')

class PetUpdateSerializer(serializers.ModelSerializer):
    shelter = PetShelterSerializer(required=False)
    pet_images = PetImageSerializer(many=True, required=False)

    class Meta: 
        model = Pet
        fields = '__all__'
        read_only_fields = ('publication_date', 'shelter', 'pet_images')

class PetSerializer(serializers.ModelSerializer):
    shelter = PetShelterSerializer(required=False)
    pet_images = PetImageSerializer(many=True, required=False)

    class Meta:
        model = Pet
        fields = '__all__'
        read_only_fields = ('publication_date', 'shelter')

# class PetSerializer(serializers.ModelSerializer):
#     shelter = PetShelterSerializer(required=False)
#     pet_images = PetImageSerializer(many=True, required=False)

#     class Meta:
#         model = Pet
#         fields = '__all__'
#         read_only_fields = ('publication_date',)

#     def create(self, validated_data):
#         if 'pet_images' in validated_data:
#             pet_images_data = validated_data.pop('pet_images')

#         # Retrieve shelter ID from the URL
#         shelter_id = self.context['view'].kwargs.get('shelter_id')
        
#         # Add shelter information to the validated data
#         validated_data['shelter'] = PetShelter.objects.get(id=shelter_id)

#         pet = Pet.objects.create(**validated_data)

#         if 'pet_images' in validated_data:
#             for image_data in pet_images_data:
#                 PetImage.objects.create(pet=pet, **image_data)

#         return pet