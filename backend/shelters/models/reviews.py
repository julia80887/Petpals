from .shelter import PetShelter

from django.db import models
from django.contrib.auth.models import User  # Assuming you're using Django's built-in User model
from accounts.models.seekers import PetSeeker as Seeker 
from accounts.models.seekers import CustomUser
from .shelter import PetShelter as Shelter
from django.core.validators import MinValueValidator, MaxValueValidator

class Review(models.Model):
    rating = models.DecimalField(max_digits=2, decimal_places=1, validators=[MinValueValidator(0.0), MaxValueValidator(5.0)], blank=False, null=False)
    content = models.TextField(max_length=500, blank=False, null=False)
    creation_time = models.DateTimeField(auto_now_add=True)
    shelter = models.ForeignKey(Shelter, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, related_name='reviews', on_delete=models.CASCADE)

    def __str__(self):
        return f"Review {self.id} - Shelter: {self.shelter}"
