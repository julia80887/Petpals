from django.shortcuts import render

# Create your views here.
# views.py

from rest_framework import views
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from ..models import PetSeeker, CustomUser
from ..serializers.seeker_serializer import PetSeekerRetrieveSerializer, PetSeekerSignUpSerializer,PetSeekerUpdateSerializer,PetSeekerSerializer
from rest_framework.generics import RetrieveAPIView,RetrieveUpdateDestroyAPIView
from django.shortcuts import get_object_or_404
from shelters.models.shelter import PetShelter
from django.core.exceptions import PermissionDenied
from django.contrib import messages
from django.contrib.auth.hashers import check_password
from rest_framework import status
from chats.models.messages import Message
from rest_framework_simplejwt.views import TokenObtainPairView

class PetSeekerSignUpView(generics.CreateAPIView):

    serializer_class = PetSeekerSignUpSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            firstname = serializer.validated_data.pop('firstname')
            lastname = serializer.validated_data.pop('lastname')
            username = serializer.validated_data.pop('username')
            password = serializer.validated_data.pop('password')
            email = serializer.validated_data.pop('email')

            new_user = CustomUser.objects.create_user(username=username, password=password, email=email)

            new_seeker = PetSeeker.objects.create(user=new_user, firstname=firstname, lastname=lastname)
            new_seeker.save()

            token_obtain_pair_view = TokenObtainPairView.as_view()
            token_response = token_obtain_pair_view(request=request._request)
            token_data = token_response.data
            refresh_token = token_data.get('refresh')
            access_token = token_data.get('access')

            response_data = {
                'seeker_id': new_seeker.id,
                'message': 'Seeker successfully created.',
                'access_token': access_token,
                'refresh_token': refresh_token,
            }

            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            response_data = {
                'message': 'Invalid Request.',
                'errors': serializer.errors
            }

            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

"""
must be logged in to see a seeker 
Single endpoint /seeker/<>/
-> GET : user can see own profile, shelter can see user profile if application active
-> DELETE profile
=> UPDATE profile information
"""
class SeekerRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    serializer_class = PetSeekerRetrieveSerializer
    queryset = PetSeeker.objects.all()

    def get_object(self):
        
        # this is CustomUser object, NOT a PetSeeker object 
        user = self.request.user
        # seeker = get_object_or_404(PetSeeker, user=user)
        seeker = PetSeeker.objects.filter(user=user).first()
        shelter = PetShelter.objects.filter(user=user).first()

        seeker_id = self.kwargs.get('seeker_pk') # pet seeker id from URL capture 

        if seeker:
            if seeker_id != seeker.id:
                raise PermissionDenied('You do not have permission to access this account.')
            else:
                return seeker
        elif shelter:
            url_seeker = PetSeeker.objects.filter(id=seeker_id).first()
            if url_seeker:
                if url_seeker.applications.filter(shelter=shelter, application_status__iexact='Pending').exists():
                    return url_seeker
                else:
                    raise PermissionDenied('This shelter does not have an active application with this pet seeker.')
            else:
                raise PermissionDenied('This seeker does not exist.')
        # if seeker_id != seeker.id:
        #     # checking if requesting user is a seeker -> shouldn't be allowe
        #     # to get it
        #     requesting_user = PetSeeker.objects.get(user=user)
        #     if requesting_user is not None:
        #         raise PermissionDenied(
        #             'You do not have permission to access this account.')
            
        #     shelter = get_object_or_404(PetShelter, user=user)
            
        #     # Check if the shelter has an active application with the pet seeker
        #     if seeker.applications.filter(shelter=shelter, application_status__iexact='Pending').exists():
        #         return seeker
        #     else:
        #         # TEST THIS CASE, see which HTTP code  
        #         raise PermissionDenied(
        #             'This shelter does not have an active application with this pet seeker.')
        
        # return seeker 
        
        

    def get_serializer_class(self):
        # Override to use different serializers for different HTTP methods
        if self.request.method == 'PUT': 
            return PetSeekerUpdateSerializer
        return PetSeekerRetrieveSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        # can only update youru own profile 
        if self.request.user != instance.user:
            return Response({"message": "You do not have permission to update this seeker."},
                            status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
        
            user_data = serializer.validated_data.pop('user', {})

            user = CustomUser.objects.get(id=self.request.user.id)
            for key, value in user_data.items():
                setattr(user, key, value)
            user.save()

            serializer.save()
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
         # can only edit your own profile
        if self.request.user != instance.user:
            return Response({"message": "You do not have permission to delete this seeker."},
                            status=status.HTTP_401_UNAUTHORIZED)

        user = CustomUser.objects.get(id=instance.user.id)
        user.delete()
        instance.delete()
        return Response({'message':'Successfully deleted.'},status=status.HTTP_204_NO_CONTENT)
 