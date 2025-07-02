# views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from django.utils.dateparse import parse_date
from datetime import date, timedelta
from .models import Account, Category, Transaction
from .serializers import AccountSerializer, CategorySerializer, TransactionSerializer
from .mixins import BulkDeleteMixin

class UserOwnedViewSet(viewsets.ModelViewSet):
    """
    A base ViewSet for models owned by a user.
    - Automatically filters querysets by the request user.
    - Automatically assigns the user on creation.
    - Standardizes the destroy response.
    """
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        # A 204 No Content response is standard for successful DELETE requests.
        return Response(status=status.HTTP_204_NO_CONTENT)

class AccountViewSet(UserOwnedViewSet, BulkDeleteMixin):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

class CategoryViewSet(UserOwnedViewSet, BulkDeleteMixin):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
class TransactionViewSet(viewsets.ModelViewSet, BulkDeleteMixin):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        account_id = self.request.query_params.get('account')
        from_param = self.request.query_params.get('from')
        to_param = self.request.query_params.get('to')

        if not account_id:
            raise ValidationError({"account": "This query parameter is required."})

        # Ensure the user can only access transactions from their own accounts
        queryset = Transaction.objects.filter(account__id=account_id, account__user=user)

        try:
            to_date = parse_date(to_param) if to_param else date.today()
            from_date = parse_date(from_param) if from_param else to_date - timedelta(days=30)
            if not from_date or not to_date:
                raise ValueError # Will be caught below
        except (ValueError, TypeError):
            raise ValidationError({"date": "Invalid date format. Use YYYY-MM-DD."})
        
        return queryset.filter(date__range=(from_date, to_date))

    def perform_create(self, serializer):
        # This logic is specific to transactions, so it remains here.
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
