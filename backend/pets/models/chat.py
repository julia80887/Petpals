from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from accounts.models.seekers import PetSeeker as Seeker 
from shelters.models.shelter import PetShelter as Shelter
from accounts.models.seekers import CustomUser
from .applications import Application
from chats.models.messages import Message
from django.contrib.contenttypes.fields import GenericRelation

class Chat(models.Model):
    date_created = models.DateTimeField(auto_now_add=True)
    seeker = models.ForeignKey(Seeker, on_delete=models.CASCADE, related_name='application_chats')  # Foreign Key to Seeker
    shelter = models.ForeignKey(Shelter, on_delete=models.CASCADE, related_name='application_chats')
    application  = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='application_chats')
    message = GenericRelation(Message)

    def __str__(self):
        return f"Chat {self.id} between {self.seeker.user.username} and {self.shelter.user.username}"





