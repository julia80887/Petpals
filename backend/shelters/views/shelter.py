from django.shortcuts import render

from django.shortcuts import render
from rest_framework import status
from django.core.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView,UpdateAPIView
from rest_framework import views
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from ..models.shelter import PetShelter, ShelterImage
from accounts.models.seekers import CustomUser, PetSeeker
from ..serializers.shelter_serializers import PetShelterSerializer, ShelterImageSerializer, \
CustomUserUpdateSerializer, PetShelterSignUpSerializer,PetShelterRetrieveSerializer, PetShelterUpdateSerializer
from rest_framework.generics import RetrieveAPIView
from django.shortcuts import get_object_or_404
from django.contrib import messages
from django.contrib.auth.hashers import check_password

class PetShelterSignUpView(generics.CreateAPIView):
    serializer_class = PetShelterSignUpSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            shelter_name = serializer.validated_data.pop('shelter_name')
            username = serializer.validated_data.pop('username')
            password = serializer.validated_data.pop('password')
            email = serializer.validated_data.pop('email')
            new_user = CustomUser.objects.create_user(username=username, password=password, email=email)
            new_shelter = PetShelter.objects.create(user=new_user, shelter_name=shelter_name)
            new_shelter.save()
            response_data = {
                'shelter_id': new_shelter.id,
                'message': 'Shelter successfully created.',
            }

            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            response_data = {
                'message': 'Invalid Request.',
                'errors': serializer.errors
            }

            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)


"""
Single endpoint /shelter/<>/
-> GET 
-> DELETE 
=> UPDATE shelter information
"""
class ShelterRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    serializer_class = PetShelterRetrieveSerializer
    permission_classes = [permissions.AllowAny]
    queryset = PetShelter.objects.all()

    def get_object(self):
        return get_object_or_404(PetShelter, id=self.kwargs['shelter_pk'])

    def get_serializer_class(self):
        # Override to use different serializers for different HTTP methods
        if self.request.method == 'PUT': # update
            return PetShelterUpdateSerializer
        return PetShelterRetrieveSerializer

    def get_permissions(self):
        # change permissions for DELETE and UPDATE, so user must be logged in 
        if self.request.method == 'DELETE' or self.request.method=='PUT':
            return [IsAuthenticated()]
        return super().get_permissions()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        # user must be the shelter to update its profile
        if self.request.user != instance.user:
            return Response({"message": "You do not have permission to update this shelter."},
                            status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():

            #new_images = serializer.validated_data.pop('new_images', [])
            #old_image_id = serializer.validated_data.pop('old_images', [])
            #print(new_images)


            if 'user' in serializer.validated_data and serializer.validated_data['user']:
                user_data = serializer.validated_data.pop('user')
                

                user_serializer = CustomUserUpdateSerializer(instance.user, data=user_data, partial=True)
                if user_serializer.is_valid():
                    user_serializer.save()
            else:
                serializer.instance.user = self.request.user
                serializer.save()

            shelter = serializer.instance

            # for each new image file, create a new image object
            #for image_file in new_images:
            #    ShelterImage.objects.create(**image_file, shelter=shelter)
            #for image in shelter.shelter_images.all():
            #    if image.id not in old_image_id:
            #        image.delete()
            #serializer.shelter_images = shelter.shelter_images
            data = {
                'status': 'success',
                'message': 'Successfully updated.',
                'data': serializer.data,  
            }
            return Response(data, status=status.HTTP_200_OK)
        else: 

            response_data = {
                'message': 'Invalid Request.',
                'errors': serializer.errors
            }

            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
    

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        if self.request.user != instance.user:
            return Response({"message": "You do not have permission to delete this seeker."},
                            status=status.HTTP_401_UNAUTHORIZED)
        # user = CustomUser.objects.get(id=instance.user.id)
        # user.delete()
        instance.user.delete()


        return Response({'message':'Successfully deleted.'},status=status.HTTP_204_NO_CONTENT)


"""
List View for all Shelters 
Anybody can see all shelters
"""
class PetShelterListView(ListAPIView):
    queryset = PetShelter.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = PetShelterRetrieveSerializer

class ShelterImageCreateView(generics.CreateAPIView):
    queryset = ShelterImage.objects.all()
    serializer_class = ShelterImageSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        shelter_pk = self.kwargs['shelter_pk']
        shelter = get_object_or_404(PetShelter, id=shelter_pk)
        if self.request.user != shelter.user:
            return Response({"message": "You do not have permission to update this shelter."},
                            status=status.HTTP_403_FORBIDDEN)

        if serializer.is_valid():
            serializer.save(shelter=shelter)
            data = {
                'status': 'success',
                'message': 'Successfully created.',
                'data': serializer.data,  
            }
            return Response(data, status=status.HTTP_201_CREATED)

        response_data = {
                'message': 'Invalid Request.',
                'errors': serializer.errors
            }

        return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

class ShelterImageDeleteView(generics.DestroyAPIView):
    queryset = ShelterImage.objects.all()
    serializer_class = ShelterImageSerializer

    def delete(self, request, *args, **kwargs):
        shelter_image = get_object_or_404(ShelterImage, id=self.kwargs['image_pk'])
        
        shelter = get_object_or_404(PetShelter, id=self.kwargs['shelter_pk'])

        if self.request.user != shelter.user:
            return Response({"message": "You do not have permission to delete this shelter image."},
                            status=status.HTTP_403_FORBIDDEN)

        shelter_image.delete()

        return Response({"message": "Successfully deleted."},
                        status=status.HTTP_204_NO_CONTENT)