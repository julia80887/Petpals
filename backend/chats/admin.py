from django.contrib import admin

# Register your models here.
from .models.messages import Message

admin.site.register(Message)
