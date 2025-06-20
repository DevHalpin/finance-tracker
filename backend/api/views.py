# views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Account
from .serializers import AccountSerializer

class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Account.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'], url_path='bulk-delete')
    def bulk_delete(self, request):
        account_ids = request.data.get('ids', [])
        if not isinstance(account_ids, list) or not all(isinstance(i, int) for i in account_ids):
            return Response({"error": "'ids' must be a list of integers."}, status=400)

        deleted_count, _ = Account.objects.filter(user=request.user, id__in=account_ids).delete()
        return Response({"deleted": deleted_count}, status=200)

# hello_world can remain a simple @api_view
@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello from Django!"})
