from django.db import models

# Create your models here.
class Account(models.Model):
    name = models.CharField(max_length=100)
    user_id = models.CharField(max_length=100)
    plaid_id = models.CharField(max_length=100)

    def __str__(self):
        return self.name