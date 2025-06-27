# views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Account, Category
from .serializers import AccountSerializer, CategorySerializer

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

# hello_world can remain a simple @api_view
@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello from Django!"})
