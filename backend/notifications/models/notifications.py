from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from accounts.models import CustomUser, PetSeeker as Seeker
from shelters.models.shelter import PetShelter as Shelter


class Notifications(models.Model):
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE,
                               null=True, blank=True, related_name='sender_notifications')
    receiver = models.ForeignKey(CustomUser, on_delete=models.CASCADE,
                                 null=True, blank=True, related_name='receiver_notifications')
    notification_type = models.CharField(max_length=50, choices=[
        ('new_message', 'new_message'),
        ('application_status', 'application_status'),
        ('new_pet', 'new_pet'),
        ('review', 'review'),
        ('new_application', 'new_application'),
    ], blank=False, null=False)
    notification_object = models.PositiveIntegerField(
        blank=False, null=False)  # Store the primary key of the related object
    link = models.URLField()
    read = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification - {self.notification_type} {self.id}"
