
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from django.shortcuts import render, get_object_or_404
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework import permissions, status
from rest_framework.response import Response

from accounts.models import CustomUser, PetSeeker
from shelters.models import PetShelter
from pets.models.pets import Pet

from .models import Notifications
from .serializers import NotificationsSerializer
from django.contrib.contenttypes.models import ContentType
from rest_framework.pagination import PageNumberPagination


class CustomPageNumberPagination(PageNumberPagination):
    page_size = 5  # Set the default page size
    page_size_query_param = 'page_size'
    # Allow clients to override the page size via query parameter
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


class CreateNotificationsView(CreateAPIView):
    serializer_class = NotificationsSerializer
    # permission_classes = [permissions.IsAuthenticated]
    permission_classes = [permissions.AllowAny]

    def create(self, request):
        # This will be custom user pk
        sender_pk = request.data.get('sender_pk')
        # This will be custom user pk
        receiver_pk = request.data.get('receiver_pk')
        notification_contents = request.data.get('notification_contents')
        item_pk = request.data.get('item_pk')

        if sender_pk and receiver_pk and notification_contents and item_pk:
            sender = CustomUser.objects.filter(id=sender_pk)
            if sender is not None:
                if hasattr(sender, 'seeker'):
                    return self.create_shelter_notification(sender_pk, receiver_pk, notification_contents, item_pk)
                else:
                    return self.create_seeker_notification(sender_pk, receiver_pk, notification_contents, item_pk)
            else:
                return Response({'error': 'Invalid sender ID.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Invalid data provided.'}, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def create_shelter_notification(sender_pk, receiver_pk, notification_contents, item_pk, link):
        print("Notifying Shelter...")
        sender = CustomUser.objects.filter(id=sender_pk).first()
        receiver = CustomUser.objects.filter(id=receiver_pk).first()

        if sender is None:
            return Response("Sender doesn't exists", status=status.HTTP_400_BAD_REQUEST)
        if receiver is None:
            return Response("Receiver doesn't exists", status=status.HTTP_400_BAD_REQUEST)

        data = {
            'sender': sender,
            'receiver': receiver,
            'notification_type': notification_contents,
            'notification_object': item_pk,
            'link': link
        }

        print(data)

        notification = Notifications.objects.create(
            sender=sender,
            receiver=receiver,
            notification_type=notification_contents,
            notification_object=item_pk,
            link=link
        )

        notification.save()

        serialized_notification = NotificationsSerializer(notification).data
        return Response(serialized_notification, status=status.HTTP_201_CREATED)

    @staticmethod
    def create_seeker_notification(sender_pk, receiver_pk, notification_contents, item_pk, link):
        print("Notifying Seeker...")
        sender = CustomUser.objects.filter(id=sender_pk).first()
        receiver = CustomUser.objects.filter(id=receiver_pk).first()

        if sender is None or receiver is None:
            return Response("Sender or Receiver doesn't exists", status=status.HTTP_400_BAD_REQUEST)

        if notification_contents == "new_pet":
            listing = Pet.objects.filter(id=item_pk).first()

            data = {
                'sender': sender,
                'receiver': receiver,
                'notification_type': notification_contents,
                'notification_object': item_pk,
                'link': link
            }

            if listing is not None:
                # Check the pet type and receiver preferences
                if (
                    listing.pet_type == 'cat' and receiver.seeker.cat_notification or
                    listing.pet_type == 'dog' and receiver.seeker.dog_notification or
                    listing.pet_type not in [
                        'cat', 'dog'] and receiver.seeker.other_notification
                ):
                    notification = Notifications.objects.create(
                        sender=sender,
                        receiver=receiver,
                        notification_type=notification_contents,
                        notification_object=item_pk,
                        link=link
                    )

                    print(notification)

                    notification.save()
                    serialized_notification = NotificationsSerializer(
                        notification).data
                    return Response(serialized_notification, status=status.HTTP_201_CREATED)
            else:
                return Response("Pet Listing doesn't exists", status=status.HTTP_400_BAD_REQUEST)
        else:
            notification = Notifications.objects.create(
                sender=sender,
                receiver=receiver,
                notification_type=notification_contents,
                notification_object=item_pk,
                link=link
            )

            notification.save()
            serialized_notification = NotificationsSerializer(
                notification).data
            return Response(serialized_notification, status=status.HTTP_201_CREATED)


class NotificationRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Notifications.objects.all()
    serializer_class = NotificationsSerializer
    permission_classes = [IsAuthenticated]
    # permission_classes = [permissions.AllowAny]

    # def get_object(self):
    #     print("reached")
    #     return get_object_or_404(Notifications, id=self.kwargs['notification_id'])

    # def destroy(self, instance):  # Not working
    #     instance.delete()
    #     return Response(status=status.HTTP_204_NO_CONTENT)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if self.request.user != instance.receiver:
            return Response({"message": "You do not have permission to delete this seeker."},
                            status=status.HTTP_401_UNAUTHORIZED)
        instance.delete()
        return Response({'message': 'Successfully deleted.'}, status=status.HTTP_204_NO_CONTENT)

    def perform_update(self, serializer):
        serializer.save(read=True)
        return Response(serializer.data)

    def perform_retrieve(self, request):
        instance = self.get_object()
        if self.request.user != instance.receiver:
            return Response({"message": "You do not have permission to delete this seeker."},
                            status=status.HTTP_401_UNAUTHORIZED)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class NotificationListView(ListAPIView):
    queryset = Notifications.objects.all()
    serializer_class = NotificationsSerializer
    permission_classes = [IsAuthenticated]
    # permission_classes = [permissions.AllowAny]
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        # Users (shelter and seeker) can only view their own notifications
        user = self.request.user.id
        return Notifications.objects.filter(receiver=user).order_by('-date_created')

    def filter_queryset(self, queryset):
        # Filter notifications by read/unread
        read_param = self.request.query_params.get('read', None)
        if read_param is not None:
            queryset = queryset.filter(read=(read_param.lower() == 'true'))

        return queryset
