from django.db import models
from shelters.models import PetShelter 
from accounts.models.seekers import PetSeeker as Seeker 

class Pet(models.Model):
    shelter = models.ForeignKey(PetShelter, on_delete=models.CASCADE, related_name='pets')
    profile_photo = models.ImageField(upload_to='profile_photos/pets/', default='default.jpg') # ??? Double Check this is correct
    name = models.CharField(max_length=100, blank=False, null=False)
    PET_TYPE = [
        ('Dog', 'Dog'),
        ('Cat', 'Cat'),
        ('Fish', 'Fish'),
        ('Bird', 'Bird'),
        ('Small Rodents', 'Small Rodents'),
        ('Reptiles', 'Reptiles'),
        ('Rabbits', 'Rabbits'),
        ('Horses', 'Horses'),
        ('Other', 'Other'),
    ]
    
    pet_type = models.CharField(max_length=100, choices=PET_TYPE,blank=False, null=False) ### FRONTEND: SHOULD THIS BE A DROPDOWN
    
    # MAYBE CHANGE TO NOT TYPE IN
    breed = models.CharField(max_length=100, blank=False, null=False)
    
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=False, null=False)
    color = models.CharField(max_length=50, blank=False, null=False)
    date_of_birth = models.DateField(blank=False, null=False)  # Date of Birth
    weight = models.DecimalField(max_digits=5, decimal_places=1, blank=False, null=False)  # Weight in kilograms
    
    medical_history = models.TextField(max_length=1000, blank=False, null=False)
    behavior = models.TextField(max_length=1000, blank=False, null=False)
    requirements = models.TextField(max_length=1000, blank=False, null=False)
    about = models.TextField(max_length=1000, blank=False, null=False)
    STATUS_CHOICES = [
        ('Available', 'Available'),
        ('Adopted', 'Adopted'),
        ('Pending', 'Pending'),
        ('Withdrawn', 'Withdrawn'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, blank=False, null=False)
    application_deadline = models.DateField(blank=False, null=False)

    # BASED ON SHELTER INFO, NOT PROVIDED IN FORM 
    city = models.CharField(max_length=50, blank=False, null=False)
    province = models.CharField(max_length=2, blank=False, null=False)

    # BASED ON DATE CREATED, NOT PROVIDED IN FORM
    publication_date = models.DateField(auto_now_add=True, blank=False, null=False)
    
  
    def __str__(self):
        return self.name

  
class PetImage(models.Model):
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='pet_images')
    image_file = models.ImageField(upload_to='pet_images/')

    def __str__(self):
        return f"Image #{self.id} for {self.pet.name}"
