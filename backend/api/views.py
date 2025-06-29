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

class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Account.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"id": instance.id, "message": "Deleted"}, status=200)


    @action(detail=False, methods=['post'], url_path='bulk-delete')
    def bulk_delete(self, request):
        account_ids = request.data.get('ids', [])
        if not isinstance(account_ids, list) or not all(isinstance(i, int) for i in account_ids):
            return Response({"error": "'ids' must be a list of integers."}, status=400)

        deleted_count, _ = Account.objects.filter(user=request.user, id__in=account_ids).delete()
        return Response({"deleted": deleted_count}, status=200)
    
class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"id": instance.id, "message": "Deleted"}, status=200)


    @action(detail=False, methods=['post'], url_path='bulk-delete')
    def bulk_delete(self, request):
        category_ids = request.data.get('ids', [])
        if not isinstance(category_ids, list) or not all(isinstance(i, int) for i in category_ids):
            return Response({"error": "'ids' must be a list of integers."}, status=400)

        deleted_count, _ = Category.objects.filter(user=request.user, id__in=category_ids).delete()
        return Response({"deleted": deleted_count}, status=200)
    
class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        account_id = self.request.query_params.get('account')
        from_param = self.request.query_params.get('from')
        to_param = self.request.query_params.get('to')

        if not account_id:
            raise ValidationError({"account": "This query parameter is required."})

        queryset = Transaction.objects.filter(account__id=account_id, account__user=user)

        to_date = parse_date(to_param) if to_param else date.today()
        from_date = parse_date(from_param) if from_param else to_date - timedelta(days=30)

        if not isinstance(from_date, date) or not isinstance(to_date, date):
            raise ValidationError({"date": "Invalid date format. Use YYYY-MM-DD."})
        
        return queryset.filter(date__range=(from_date, to_date))

    def perform_create(self, serializer):
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"id": instance.id, "message": "Deleted"}, status=200)


    @action(detail=False, methods=['post'], url_path='bulk-delete')
    def bulk_delete(self, request):
        transaction_ids = request.data.get('ids', [])
        if not transaction_ids:
            return Response({"error": "'ids' list cannot be empty."}, status=400)
        if not isinstance(transaction_ids, list) or not all(isinstance(i, int) for i in transaction_ids):
            return Response({"error": "'ids' must be a list of integers."}, status=400)

        deleted_count, _ = Transaction.objects.filter(account__user=request.user, id__in=transaction_ids).delete()
        return Response({"deleted": deleted_count}, status=200)

