from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Account(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    plaid_id = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.name