from django.db import models
from pets.models.pets import Pet
from accounts.models import PetSeeker as Seeker
from shelters.models.shelter import PetShelter as Shelter

from django.core.validators import RegexValidator

class Application(models.Model):
    phone_number_validator = RegexValidator(
        regex=r'^\d{10,15}$',
        message="Phone number must be between 10 and 15 digits."
    )
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='applications')
    seeker = models.ForeignKey(Seeker, on_delete=models.CASCADE, related_name='applications')
    shelter = models.ForeignKey(Shelter, on_delete=models.CASCADE, related_name='applications')  # This field is tentative, you can adjust it as needed
    APPLICATION_STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
        ('Withdrawn', 'Withdrawn'),
    ]
    application_status = models.CharField(max_length=10, choices=APPLICATION_STATUS_CHOICES, blank=False, null=False)
    creation_time = models.DateTimeField(auto_now_add=True)
    last_update_time = models.DateTimeField(auto_now=True)  # Automatically updated on each save
    name = models.CharField(max_length=200, blank=False, null=False)
    phone_number = models.CharField(validators=[phone_number_validator],max_length=15, blank=False, null=False)
    email = models.EmailField(max_length=200, blank=False, null=False)
    address1 = models.CharField(max_length=200, blank=False, null=False)
    address2 = models.CharField(max_length=200, blank=True, null=True)
    city = models.CharField(max_length=200, blank=False, null=False)
    province = models.CharField(max_length=2, blank=False, null=False)
    zip_code = models.CharField(max_length=7, blank=False, null=False)
    num_adults = models.IntegerField(blank=False, null=False)
    num_children= models.IntegerField(blank=False, null=False)
    RESIDENCE_CHOICES = [
        ('House', 'House'),
        ('Apartment', 'Apartment'),
        ('Condo', 'Condo'),
        ('Townhouse', 'Townhouse'),
        ('Mobile Home', 'Mobile Home'),
    ]
    residence = models.CharField(max_length=50, choices=RESIDENCE_CHOICES, blank=False, null=False)
    OWNERSHIP_CHOICES = [
        ('Own', 'Own'),
        ('Rent', 'Rent'),
    ]
    ownership = models.CharField(max_length=50, choices=OWNERSHIP_CHOICES, blank=False, null=False)
    pet_alone_time = models.TextField(max_length=1000, blank=False, null=False)
    current_pets = models.TextField(max_length=1000, blank=False, null=False)
    daily_routine = models.TextField(max_length=1000, blank=False, null=False)
    expenses = models.TextField(max_length=1000, blank=False, null=False)
    previous_pets = models.TextField(max_length=1000, blank=False, null=False)
    reason = models.TextField(max_length=1000, blank=False, null=False)
    reference_name = models.CharField(max_length=50, blank=False, null=False)
    reference_number = models.CharField(validators=[phone_number_validator],max_length=15, blank=False, null=False)
    reference_email = models.EmailField(blank=False, null=False)
    additional_comments = models.TextField(max_length=1000, blank=True, null=True)


    def __str__(self):
        return f"Application #{self.id} for {self.pet.name}"