from django.db import models
from accounts.models.seekers import CustomUser


class PetShelter(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='shelter')
    shelter_name = models.CharField(
        max_length=100, blank=False, null=False)  # Required for sign-up
    mission_statement = models.TextField(max_length=500, blank=True, null=True)
    

    def __str__(self):
        return f"Pet Shelter: {self.shelter_name}"

    def delete(self, *args, **kwargs):
        self.user.delete()
        return super(self.__class__, self).delete(*args, **kwargs)


class ShelterImage(models.Model):
    shelter = models.ForeignKey(PetShelter, on_delete=models.CASCADE, related_name='shelter_images')
    image_file = models.ImageField(upload_to='shelter_images/')

    def __str__(self):
        return f"Image #{self.id} for {self.shelter.shelter_name}"






