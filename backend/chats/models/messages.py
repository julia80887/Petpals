from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from accounts.models.seekers import PetSeeker as Seeker 
from shelters.models.shelter import PetShelter as Shelter
from accounts.models.seekers import CustomUser



class Message(models.Model):
    # message can be attached to either a chat or review 
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, related_name='messages')
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    message_type = models.CharField(max_length=30, blank=True, null=True)
    
    date_sent = models.DateTimeField(auto_now_add=True)
    content = models.TextField(max_length=500, blank=False, null=False)
    
    # Sender can be either a Seeker or a Shelter
   
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='user_messages')





