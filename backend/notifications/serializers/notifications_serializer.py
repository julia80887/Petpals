from rest_framework import serializers
from ..models import Notifications


class NotificationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notifications
        fields = '__all__'
        read_only_fields = ['sender', 'receiver', 'date_created']
