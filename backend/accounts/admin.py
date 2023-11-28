from django.contrib import admin

# Register your models here.
# myapp/admin.py


from .models.seekers import PetSeeker
from .models.seekers import CustomUser
admin.site.register(PetSeeker)

admin.site.register(CustomUser)
