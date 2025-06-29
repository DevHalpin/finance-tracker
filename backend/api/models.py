from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Account(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    plaid_id = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.name
    
class Category(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    plaid_id = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name
    
class Transaction(models.Model):
    amount = models.IntegerField()
    payee = models.CharField(max_length=100)
    notes = models.TextField(null=True, blank=True)
    date = models.DateField()
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)

