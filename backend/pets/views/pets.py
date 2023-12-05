from django.shortcuts import render
from django.urls import reverse
from django.shortcuts import render
from rest_framework import status
from django.core.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveUpdateDestroyAPIView, CreateAPIView, ListCreateAPIView
from rest_framework import views
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from ..models import PetImage, Pet
from shelters.models import PetShelter, Review
from accounts.models import CustomUser, PetSeeker
from shelters.serializers.shelter_serializers import PetShelterSerializer, PetShelterSignUpSerializer, PetShelterRetrieveSerializer, PetShelterUpdateSerializer
from rest_framework.generics import RetrieveAPIView, ListAPIView
from django.shortcuts import get_object_or_404
from ..serializers.pet_serializers import PetSerializer, PetImageSerializer, PetUpdateSerializer, PetRetrieveSerializer
from rest_framework.pagination import PageNumberPagination
from django.contrib.contenttypes.models import ContentType
from chats.models.messages import Message
from notifications.views import CreateNotificationsView


class CustomPageNumberPagination(PageNumberPagination):
    page_size = 10  # Set the default page size
    page_size_query_param = 'page_size'
    # Allow clients to override the page size via query parameter
    max_page_size = 10  # Set the maximum allowed page size

    def get_paginated_response(self, data):
        return Response({
            'pagination_details': {
                'count': self.page.paginator.count,
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
                'page_size': self.page_size,
            },
            'results': data,
        })


class PetListCreateView(ListCreateAPIView):
    serializer_class = PetSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = CustomPageNumberPagination

    def get_permissions(self):
        # change permissions for POST, so user must be logged in
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return super().get_permissions()

    def get_queryset(self):
        queryset = Pet.objects.all()

        # # Filter by shelter and status
        shelter = self.request.query_params.get('shelter')
        if shelter:
            queryset = queryset.filter(shelter__shelter_name=shelter)

        status = self.request.query_params.get(
            'status')  # Default status is 'available'
        if status == "Adopted" or status == "Pending":
            queryset = queryset.filter(status=status)
        else:
            queryset = queryset.filter(status="Available")

        # # # Additional filters
        gender = self.request.query_params.get('gender')
        if gender:
            queryset = queryset.filter(gender=gender)

        color = self.request.query_params.get('color')
        if color == "other":
            queryset = queryset.exclude(color="black").exclude(color="white").exclude("brown").exclude(
                "grey").exclude("multicolor").exclude("orange").exclude("red").exclude("green")
        elif color:
            queryset = queryset.filter(color=color)

        lt_size = self.request.query_params.get('lt_size')
        gt_size = self.request.query_params.get('gt_size')
        if lt_size and gt_size:
            queryset = queryset.filter(weight__lte=lt_size).filter(weight__gte=gt_size)


        pet_type = self.request.query_params.get(
            'type')  # Look into case sensitivity

        if pet_type == "Dog":
            queryset = queryset.filter(pet_type="Dog")
        elif pet_type == "Cat":
            queryset = queryset.filter(pet_type="Cat")
        if pet_type == "Other":
            queryset = queryset.exclude(pet_type="Cat").exclude(pet_type="Dog")
        elif pet_type != "":
            queryset = queryset.filter(pet_type=pet_type)

        # # # Sorting options
        order_by = self.request.query_params.get('order_by')
        if order_by == 'name':
            queryset = queryset.order_by('name')
        if order_by == 'age':
            queryset = queryset.order_by('date_of_birth')
        if order_by == 'size':
            queryset = queryset.order_by('weight')
        if order_by == 'date':
            queryset = queryset.order_by('publication_date')

        return queryset

    def create(self, request, *args, **kwargs):
        user = self.request.user

        # Check if the user is a PetShelter user
        shelter = PetShelter.objects.filter(user=user).first()
        if not shelter:
            return Response({"detail": "Only shelter can create pets. You do not have permission to create a pet."},
                            status=status.HTTP_403_FORBIDDEN)

        shelter = get_object_or_404(PetShelter, user=user)
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            serializer.validated_data['shelter'] = shelter
            pet = serializer.save()
            response_data = {
                'pet_id': pet.id,
                'message': 'Pet successfully created.',
            }

            all_seekers = PetSeeker.objects.all()

            for seeker in all_seekers:
                print(seeker)
            # Create Notification for Seeker
                url = reverse(f'pet:pet_detail', kwargs={'pet_pk': pet.id})
                notification_class = CreateNotificationsView()
                notification_class.create_seeker_notification(
                    shelter.user.id, seeker.user.id, 'new_pet', pet.id, url)
            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            response_data = {
                'errors': serializer.errors,
                'message': 'Invalid Request.',
            }
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)


class PetDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = PetRetrieveSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        return get_object_or_404(Pet, id=self.kwargs['pet_pk'])

    def get_serializer_class(self):
        # Override to use different serializers for different HTTP methods
        if self.request.method == 'PUT':  # update
            return PetUpdateSerializer
        return PetRetrieveSerializer

    def get_permissions(self):
        # change permissions for DELETE and UPDATE, so user must be logged in
        if self.request.method == 'DELETE' or self.request.method == 'PUT':
            return [IsAuthenticated()]
        return super().get_permissions()

    def destroy(self, request, *args, **kwargs):
        pet = self.get_object()
        if self.request.user != pet.shelter.user:
            return Response({"detail": "Your shelter did not create this pet. You do not have permission to delete it."},
                            status=status.HTTP_403_FORBIDDEN)
        pet.delete()
        response_data = {
            'message': 'Pet successfully deleted.',
        }
        return Response(response_data, status=status.HTTP_204_NO_CONTENT)

    def update(self, request, *args, **kwargs):
        pet = self.get_object()
        serializer = self.get_serializer(pet, data=request.data, partial=True)
        if self.request.user != pet.shelter.user:
            return Response({"detail": "Your shelter did not create this pet. You do not have permission to update it."},
                            status=status.HTTP_403_FORBIDDEN)

        if serializer.is_valid():
            new_images = serializer.validated_data.pop('new_images', tuple())
            old_image_id = serializer.validated_data.pop('old_images', [])
            # shelter_data = serializer.validated_data.pop('shelter', tuple())

            shelter = get_object_or_404(PetShelter, user=self.request.user)
            serializer.instance.shelter = shelter
            serializer.save()
            pet = serializer.instance

            for image_file in new_images:
                PetImage.objects.create(**image_file, pet=pet)
            for image in pet.pet_images.all():
                if image.id not in old_image_id:
                    image.delete()

            response_data = {
                'message': 'Pet successfully updated.',
                'data': serializer.data
            }
            return Response(response_data, status=status.HTTP_200_OK)

        else:
            response_data = {
                'errors': serializer.errors,
                'message': 'Invalid Request.',
            }
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)


class PetImageCreateView(generics.CreateAPIView):
    queryset = PetImage.objects.all()
    serializer_class = PetImageSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        pet_pk = self.kwargs['pet_pk']
        pet = get_object_or_404(Pet, id=pet_pk)
        if self.request.user != pet.shelter.user:
            return Response({"message": "You do not have permission to update this pet."},
                            status=status.HTTP_403_FORBIDDEN)

        if serializer.is_valid():
            serializer.save(pet=pet)
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


class PetImageDeleteView(generics.DestroyAPIView):
    queryset = PetImage.objects.all()
    serializer_class = PetImageSerializer

    def delete(self, request, *args, **kwargs):
        pet_image = get_object_or_404(PetImage, id=self.kwargs['image_pk'])

        pet = get_object_or_404(Pet, id=self.kwargs['pet_pk'])

        if self.request.user != pet.shelter.user:
            return Response({"message": "You do not have permission to delete this shelter image."},
                            status=status.HTTP_403_FORBIDDEN)

        pet_image.delete()

        return Response({"message": "Successfully deleted."},
                        status=status.HTTP_204_NO_CONTENT)
