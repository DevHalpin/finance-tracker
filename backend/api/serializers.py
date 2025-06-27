from rest_framework import serializers
from .models import *

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'name', 'plaid_id', 'user']
        extra_kwargs = {
            'plaid_id': {'required': False, 'allow_null': True},
            'user': {'read_only': True},
        }

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'plaid_id', 'user']
        extra_kwargs = {
            'plaid_id': {'required': False, 'allow_null': True},
            'user': {'read_only': True},
        }