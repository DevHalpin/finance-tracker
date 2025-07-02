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

class TransactionSerializer(serializers.ModelSerializer):
    account_name = serializers.CharField(source='account.name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Transaction
        fields = ['id', 'amount', 'payee', 'notes', 'date', 'account', 'category', 'account_name', 'category_name']
        extra_kwargs = {
            'account': {'required': True},
            'category': {'required': False, 'allow_null': True},
            'notes': {'required': False, 'allow_null': True},
        }

    def validate_account(self, value):
        """
        Check that the account is owned by the requesting user.
        """
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            if value.user != request.user:
                raise serializers.ValidationError("This account does not belong to the current user.")
        return value

    def update(self, instance, validated_data):
        if 'account' in validated_data and validated_data['account'] != instance.account:
            raise serializers.ValidationError({'account': 'You cannot change the account of a transaction. Please delete and create a new transaction instead.'})
        return super().update(instance, validated_data)