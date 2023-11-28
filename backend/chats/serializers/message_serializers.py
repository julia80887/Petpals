
from rest_framework import serializers
from accounts.models.seekers import CustomUser, PetSeeker
from ..models.messages import Message


class MessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Message
        fields = ['content', 'sender', 'date_sent', 'content_type', 'object_id', 'message_type']
        read_only_fields = ['date_sent', 'sender', 'content_type', 'object_id', 'message_type']



