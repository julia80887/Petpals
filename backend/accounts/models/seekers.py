from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.hashers import make_password

class CustomUser(AbstractUser):
    phone_number_validator = RegexValidator(
        regex=r'^\d{10,15}$',
        message="Phone number must be between 10 and 15 digits."
    )
    phone_number = models.CharField(validators=[phone_number_validator], max_length=15, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    profile_photo = models.ImageField(upload_to='profile_photos/', default='default.jpg')
    email = models.EmailField(blank=False, null=False)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_query_name='user',
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_query_name='user',
    )

    #def save(self, *args, **kwargs):
    #    self.password = make_password(self.password)
    #    super().save(*args, **kwargs)

    def __str__(self):
        return self.username

class PetSeeker(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='seeker')
    
    #firstname = models.CharField(max_length=30, blank=False, null=False)  # Required for sign-up
    #lastname = models.CharField(max_length=30, blank=False, null=False)  # Required for sign-up
    firstname = models.CharField(max_length=30, blank=False, null=False)
    lastname = models.CharField(max_length=30, blank=False, null=False)

    dog_notification = models.BooleanField(default=True) 
    cat_notification = models.BooleanField(default=True)
    other_notification = models.BooleanField(default=True)

    def __str__(self):
        return f"Pet Seeker: {self.user.username}"
    
    def delete(self, *args, **kwargs):
        self.user.delete()
        return super(self.__class__, self).delete(*args, **kwargs)
