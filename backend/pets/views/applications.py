from django.shortcuts import render
from django.urls import reverse
from rest_framework import serializers
from django.shortcuts import render
from rest_framework import status
from django.core.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView, UpdateAPIView, RetrieveUpdateAPIView
from rest_framework import views
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from notifications.views import CreateNotificationsView
from shelters.models import PetShelter
from ..models import Pet
from ..models import Application
from accounts.models import CustomUser, PetSeeker
from ..serializers.application_serializers import CreateApplicationSerializer, ApplicationSerializer, ListApplicationSerializer, ChatSerializer
from rest_framework.generics import RetrieveAPIView, CreateAPIView, ListCreateAPIView
from django.shortcuts import get_object_or_404
from chats.serializers.message_serializers import MessageSerializer
from rest_framework.pagination import PageNumberPagination
from ..models.chat import Chat
from django.contrib.contenttypes.models import ContentType
from chats.models.messages import Message
from django.utils import timezone


class CustomPageNumberPagination(PageNumberPagination):
    page_size = 5  # Set the default page size
    page_size_query_param = 'page_size'
    max_page_size = 5  # Set the maximum allowed page size

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


class CreateApplicationView(ListCreateAPIView):
    serializer_class = CreateApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = CustomPageNumberPagination

    # if self.request.user != review_serializer.instance.shelter.user:
    #     return Response({"detail": "You do not have permission to create an application for this pet."},
    #                 status=status.HTTP_403_FORBIDDEN)

    def get_queryset(self):
        user = self.request.user
        shelter = get_object_or_404(PetShelter, user=user)
        pet = get_object_or_404(Pet, id=self.kwargs['pet_pk'])
        return Application.objects.filter(pet=pet, shelter=shelter)

    def create(self, request, *args, **kwargs):
        user = self.request.user
        seeker = PetSeeker.objects.filter(user=user).first()
        if not seeker:
            return Response({"detail": "You do not have permission to create an application. Only Seekers can create applications."},
                            status=status.HTTP_403_FORBIDDEN)

        pet = get_object_or_404(Pet, id=self.kwargs['pet_pk'])
        existing_application = Application.objects.filter(
            seeker=seeker, pet=pet)
        if existing_application:
            return Response({"detail": "You have already created an application for this pet."},
                            status=status.HTTP_403_FORBIDDEN)

        app_serializer = self.get_serializer(data=request.data)

        if app_serializer.is_valid():
            if pet.status == 'Available':
                app_serializer.validated_data['seeker'] = seeker
                app_serializer.validated_data['pet'] = pet
                app_serializer.validated_data['shelter'] = pet.shelter
                app_serializer.validated_data['application_status'] = 'Pending'
                application = app_serializer.save()
                response_data = {
                    'application_id': application.id,
                    'message': 'Application successfully created.',
                }
                # Notification sent to Shelter
                url = reverse(f'pet:update', kwargs={
                              'pet_pk': pet.id, 'application_pk': application.id})
                notification_class = CreateNotificationsView()
                notification_class.create_shelter_notification(
                    seeker.user.id, pet.shelter.user.id, 'new_application', application.id, url)

                return Response(response_data, status=status.HTTP_201_CREATED)
            response_data = {
                'message': 'The Pet is not currently available.',
            }
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        else:
            response_data = {
                'errors': app_serializer.errors,
                'message': 'Invalid Request.',
            }
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)


class ApplicationDetailView(RetrieveUpdateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        application_id = self.kwargs.get('application_pk')
        pet = get_object_or_404(Pet, id=self.kwargs['pet_pk'])
        app = get_object_or_404(Application, pet=pet, id=application_id)
        return app

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        user = self.request.user
        shelter = PetShelter.objects.filter(user=user).first()
        seeker = PetSeeker.objects.filter(user=user).first()
        application_id = self.kwargs.get('application_pk')
        serializer = self.get_serializer(instance)
        response_data = serializer.data

        if shelter:
            pet = get_object_or_404(Pet, id=self.kwargs['pet_pk'])
            # if the pet belongs to the current logged in shelter
            if pet.shelter == shelter:
                # app = get_object_or_404(Application, pet=pet, shelter=shelter, id=application_id)
                return Response(response_data, status=status.HTTP_200_OK)
            else:
                # else cannot edit
                return Response({"detail": "This Pet is not part of your shelter. You do not have permission to edit this application."},
                                status=status.HTTP_403_FORBIDDEN)
        elif seeker:
            pet = get_object_or_404(Pet, id=self.kwargs['pet_pk'])
            app = get_object_or_404(Application, pet=pet, id=application_id)
            if app.seeker != seeker:
                return Response({"detail": "You did not create this application. You do not have permission to edit it."},
                                status=status.HTTP_403_FORBIDDEN)
            else:
                return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "You are not authenticated. You do not have permission to edit this application."},
                            status=status.HTTP_403_FORBIDDEN)
        # return app

        # instance = self.get_object()

        # # Your custom logic goes here
        # # For example, you can add additional data to the response
        # # custom_data = {'additional_field': 'additional_value'}

        # serializer = self.get_serializer(instance)
        # response_data = serializer.data
        # # response_data.update(custom_data)

        # return Response(response_data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        application = self.get_object()
        user = self.request.user
        shelter = PetShelter.objects.filter(user=user).first()
        seeker = PetSeeker.objects.filter(user=user).first()
        app_serializer = self.get_serializer(
            instance=application, data=request.data)

        if app_serializer.is_valid():
            if shelter and application.application_status == 'Pending':
                # Shelter can update the status from pending to accepted or denied
                new_status = request.data.get('application_status')
                if new_status in ['Approved', 'Rejected']:
                    app_serializer.validated_data['application_status'] = new_status
                    application = app_serializer.save()
                    response_data = {
                        'application_id': application.id,
                        'message': 'Application status was successfully updated.',
                    }
                    # Create Notification for seeker
                    url = reverse(f'pet:update', kwargs={
                                  'pet_pk': application.pet.id, 'application_pk': application.id})
                    notification_class = CreateNotificationsView()
                    notification_class.create_seeker_notification(
                        shelter.user.id, application.seeker.user.id, 'application_status', application.id, url)

                    return Response(response_data, status=status.HTTP_200_OK)
                else:
                    response_data = {
                        'message': 'You can only change the application status to Accepted or Denied',
                    }
                    return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

            elif seeker and application.application_status in ['Pending', 'Approved']:
                # Seeker can update the status from pending or accepted to withdrawn
                new_status = request.data.get('application_status')
                if new_status == 'Withdrawn':
                    app_serializer.validated_data['application_status'] = new_status
                    application = app_serializer.save()
                    response_data = {
                        'application_id': application.id,
                        'message': 'Application status was successfully updated.',
                    }
                    return Response(response_data, status=status.HTTP_200_OK)
                else:
                    response_data = {
                        'message': 'You can only change the application status to Withdrawn',
                    }
                    return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

            else:
                return Response({"detail": "You do not have permission to edit the status of this application."},
                                status=status.HTTP_403_FORBIDDEN)
        else:
            response_data = {
                'errors': app_serializer.errors,
                'message': 'Invalid Request.',
            }
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)


class ListAllApplicationView(ListAPIView):
    serializer_class = ListApplicationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        user = self.request.user
        seeker = PetSeeker.objects.filter(user=user).first()
        shelter = PetShelter.objects.filter(user=user).first()

        queryset = Application.objects.all()

        application_status = self.request.query_params.get(
            'application_status', None)

        if application_status:
            queryset = queryset.filter(
                application_status=application_status)

    # Order by creation_time and last_update_time
        order_by = self.request.query_params.get('order_by', None)
        print(order_by == "Update")

        if order_by == "Creation":
            queryset = queryset.order_by('creation_time')
        elif order_by == "Update":
            queryset = queryset.order_by('-last_update_time')
            # Default ordering if no specific order is requested
        else:
            queryset = queryset.order_by('creation_time', 'last_update_time')

        if shelter:
            # Shelter can only view their own applications
            # pet = get_object_or_404(Pet, id=self.kwargs['pet_pk'], shelter=shelter)
            return queryset.filter(shelter=shelter)
        elif seeker:
            # Pet Seeker can only view their own applications
            return queryset.filter(seeker=seeker)
        else:
            return queryset.none()


class ListEveryApplicationForUserView(ListAPIView):
    serializer_class = ListApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        seeker = PetSeeker.objects.filter(user=user).first()
        shelter = PetShelter.objects.filter(user=user).first()

        if shelter:
            # Shelter can only view their own applications
            # pet = get_object_or_404(Pet, id=self.kwargs['pet_pk'], shelter=shelter)
            return Application.objects.filter(shelter=shelter)
        elif seeker:
            # Pet Seeker can only view their own applications
            return Application.objects.filter(seeker=seeker)
        else:
            # For any other user type, return an empty queryset
            return Application.objects.none()

    def filter_queryset(self, queryset):
        # Filter applications by status
        application_status = self.request.query_params.get(
            'application_status', None)
        if application_status:
            queryset = queryset.filter(application_status=application_status)

    # # Order by creation_time and last_update_time
    #     order_by = self.request.query_params.get('order_by', None)

    #     if order_by == "Creation":
    #         queryset = queryset.order_by('creation_time')
    #     elif order_by == "Update":
    #         queryset = queryset.order_by('last_update_time')
    #         # Default ordering if no specific order is requested
    #     queryset = queryset.order_by('creation_time', 'last_update_time')

        return queryset

        # Filter applications by status
        # application_status = self.request.query_params.get('application_status', None)
        # if application_status:
        #     queryset = queryset.filter(application_status=application_status)

        # return queryset


# Chats

class ChatDetailView(generics.RetrieveAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer

    def get(self, request, *args, **kwargs):
        chat_pk = self.kwargs.get('chat_pk')
        application_pk = self.kwargs.get('application_pk')
        application = get_object_or_404(Application, id=application_pk)
        application_seeker = application.seeker
        application_shelter = application.shelter

        user_id = self.request.user.id
        user = get_object_or_404(CustomUser, id=user_id)

        if user == application_seeker.user or user == application_shelter.user:
            chat = get_object_or_404(Chat, id=chat_pk)
            serializer = self.get_serializer(chat)
            response_data = serializer.data
            # response_data = {
            #     'message': 'Successfully created.',
            #     'data': chat
            # }
            return Response(response_data, status=status.HTTP_200_OK)

        else:
            raise PermissionDenied(
                'You do not have permission to view a chat for this application.')


class CreateChatListView(generics.ListCreateAPIView):
    serializer_class = ChatSerializer
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        application_pk = self.kwargs.get('application_pk')
        application = get_object_or_404(Application, id=application_pk)

        user = self.request.user
        if user == application.seeker.user or user == application.shelter.user:
            queryset = Chat.objects.filter(
                application=application).order_by('-date_created')
            return queryset
        else:
            raise PermissionDenied(
                'You do not have permission to view a chat for this application.')

    def create(self, request, *args, **kwargs):
        application_pk = self.kwargs.get('application_pk')
        application = get_object_or_404(Application, id=application_pk)
        application_seeker = application.seeker
        application_shelter = application.shelter

        user_id = self.request.user.id
        user = get_object_or_404(CustomUser, id=user_id)

        if user == application_seeker.user or user == application_shelter.user:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                serializer.save(shelter=application_shelter,
                                seeker=application_seeker, application=application)
                application.last_update_time = timezone.now()
                application.save()

                response_data = {
                    'message': 'Successfully created.',
                    'data': serializer.data
                }
                return Response(response_data, status=status.HTTP_201_CREATED)
            else:
                response_data = {
                    'message': 'Invalid Request.',
                    'errors': serializer.errors
                }

                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        else:
            raise PermissionDenied(
                'You do not have permission to create a chat for this application.')


class CreateChatMessageView(generics.CreateAPIView):
    serializer_class = MessageSerializer

    def create(self, request, *args, **kwargs):
        user_id = self.request.user.id
        user = get_object_or_404(CustomUser, id=user_id)

        chat_id = self.kwargs['chat_pk']
        chat = get_object_or_404(Chat, id=chat_id)

        if user == chat.seeker.user or user == chat.shelter.user:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                if hasattr(user, 'seeker'):
                    user_type = 'seeker'
                else:
                    user_type = 'shelter'

                content_type = ContentType.objects.get_for_model(chat)
                model_name = content_type.model_class().__name__
                serializer.save(sender=user, sender_type=user_type, content_type=content_type,
                                object_id=chat.id, message_type=model_name)
                chat.application.last_update_time = timezone.now()
                chat.application.save()

                response_data = {
                    'message': 'Successfully created.',
                    'data': serializer.data
                }
                # Create Notification
                # Seeker
                if user == chat.shelter.user:
                    url = reverse(f'pet:chat_detail',
                                  kwargs={'chat_pk': chat.id, 'application_pk': chat.application.id})
                    notification_class = CreateNotificationsView()
                    notification_class.create_seeker_notification(
                        user.id, chat.seeker.user.id, 'new_message', chat_id, url)

                # # Shelter
                if user == chat.seeker.user:
                    url = reverse(f'pet:chat_detail', kwargs={
                                  'chat_pk': chat.id, 'application_pk': chat.application.id})
                    notification_class = CreateNotificationsView()
                    notification_class.create_shelter_notification(
                        user.id, chat.shelter.user.id, 'new_message', chat_id, url)

                return Response(response_data, status=status.HTTP_201_CREATED)

            else:
                response_data = {
                    'message': 'Invalid Request.',
                    'errors': serializer.errors
                }

                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        else:
            raise PermissionDenied(
                'You do not have permission to create a message for this chat.')


class MessageListAPIView(ListAPIView):
    serializer_class = MessageSerializer
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        chat_pk = self.kwargs.get('chat_pk')
        chat = get_object_or_404(Chat, id=chat_pk)

        user = self.request.user
        if user == chat.seeker.user or user == chat.shelter.user:

            return Message.objects.filter(
                content_type=ContentType.objects.get_for_model(Chat),
                object_id=chat_pk
            ).order_by('-date_sent')
        else:
            raise PermissionDenied(
                'You do not have permission to view a chat for this application.')
