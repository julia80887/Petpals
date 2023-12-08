
from rest_framework import serializers
from accounts.models.seekers import CustomUser, PetSeeker
from ..models.messages import Message


class MessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Message
        fields = ['id', 'content', 'sender', 'sender_type', 'date_sent',
                  'content_type', 'object_id', 'message_type']
        read_only_fields = ['id', 'date_sent', 'sender',
                            'sender_type', 'content_type', 'object_id', 'message_type']
