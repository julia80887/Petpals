from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models.pets import Pet
from .models.applications import Application
from .models.chat import Chat

admin.site.register(Chat)
admin.site.register(Application)
admin.site.register(Pet)