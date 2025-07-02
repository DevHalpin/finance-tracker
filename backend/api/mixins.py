from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

class BulkDeleteMixin:
    """
    A mixin that adds a 'bulk-delete' action to a ViewSet.
    It expects a list of integer IDs in the request data's 'ids' key.
    """
    @action(detail=False, methods=['post'], url_path='bulk-delete')
    def bulk_delete(self, request, *args, **kwargs):
        ids = request.data.get('ids', [])
        
        if not isinstance(ids, list) or not all(isinstance(i, int) for i in ids):
            return Response(
                {"error": "'ids' must be a list of integers."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not ids:
            return Response(
                {"error": "'ids' list cannot be empty."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        queryset = self.get_queryset()
        deleted_count, _ = queryset.filter(id__in=ids).delete()
        
        return Response({"deleted": deleted_count}, status=status.HTTP_200_OK)