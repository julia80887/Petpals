from django.shortcuts import render

# Create your views here.
# views.py

from rest_framework import views
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from ..models import PetSeeker, CustomUser
from ..serializers.seeker_serializer import PetSeekerRetrieveSerializer, CustomUserSerializer, PetSeekerSignUpSerializer,PetSeekerUpdateSerializer,PetSeekerSerializer
from rest_framework.generics import RetrieveAPIView,RetrieveUpdateDestroyAPIView
from django.shortcuts import get_object_or_404
from shelters.models.shelter import PetShelter
from django.core.exceptions import PermissionDenied
from django.contrib import messages
from django.contrib.auth.hashers import check_password
from rest_framework import status
from chats.models.messages import Message
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer



@api_view(['POST'])
@permission_classes([AllowAny])
def seeker_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'detail': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    # You may need to adjust the fields based on your model
    try:
        user = CustomUser.objects.get(username=username)
        seeker = PetSeeker.objects.get(user=user)
    except CustomUser.DoesNotExist:
        return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
    except PetSeeker.DoesNotExist:
        return Response({'detail': 'Seeker not found.'}, status=status.HTTP_404_NOT_FOUND)

    if not user.check_password(password):
        return Response({'detail': 'Invalid password.'}, status=status.HTTP_401_UNAUTHORIZED)

    # token_obtain_pair_view = TokenObtainPairView.as_view()
    # token_response = token_obtain_pair_view(request=request._request)
    # token_data = token_response.data
    # refresh_token = token_data.get('refresh')
    # access_token = token_data.get('access')
    # seeker_serializer = PetSeekerRetrieveSerializer(seeker)

    # response_data = {
    #     'seeker': seeker_serializer.data,
    #     'message': 'Seeker successfully logged in.',
    #     'access': access_token,
    #     'refresh': refresh_token,
    # }

    # return Response(response_data, status=status.HTTP_200_OK)
    serializer = TokenObtainPairSerializer(data={'username': username, 'password': password})
    serializer.is_valid(raise_exception=True)
    tokens = serializer.validated_data

    seeker_serializer = PetSeekerRetrieveSerializer(seeker)

    response_data = {
        'seeker': seeker_serializer.data,
        'message': 'Seeker successfully logged in.',
        'access': tokens['access'],
        'refresh': tokens['refresh'],
    }

    return Response(response_data, status=status.HTTP_200_OK)

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
            password1 = serializer.validated_data.pop('password1')

            if password1 != password:
                response_data = {
                    'message': 'Invalid Request.',
                    'errors': {'password1': 'Passwords do not match.'}
                }

                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

            email = serializer.validated_data.pop('email')

            new_user = CustomUser.objects.create_user(username=username, password=password, email=email)

            new_seeker = PetSeeker.objects.create(user=new_user, firstname=firstname, lastname=lastname)
            new_seeker.save()

            serializer = TokenObtainPairSerializer(data={'username': username, 'password': password})
            serializer.is_valid(raise_exception=True)
            tokens = serializer.validated_data

            # token_obtain_pair_view = TokenObtainPairView.as_view()
            # token_response = token_obtain_pair_view(request=request._request)
            # token_data = token_response.data
            # refresh_token = token_data.get('refresh')
            # access_token = token_data.get('access')
            seeker_serializer = PetSeekerRetrieveSerializer(new_seeker)


            response_data = {
                'seeker': seeker_serializer.data,
                'message': 'Seeker successfully created.',
                'access_token':  tokens['access'],
                'refresh_token': tokens['refresh'],
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
 

class CustomUserRetrieveView(generics.RetrieveAPIView):
    serializer_class = CustomUserSerializer
    queryset = CustomUser.objects.all()
    permission_classes = [IsAuthenticated]  # Adjust the permission as needed

    def get_object(self):
        user_id = self.kwargs.get('user_pk')
        user = CustomUser.objects.get(id=user_id)
        return user 