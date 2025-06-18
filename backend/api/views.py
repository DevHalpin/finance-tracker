from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Account
from .serializers import AccountSerializer

@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello from Django!"})

@api_view(['GET', 'POST'])
def accounts(request):
    if request.method == 'GET':
        accounts = Account.objects.filter(user=request.user)
        serializer = AccountSerializer(accounts, many=True)

        return Response({ "accounts": serializer.data }, status=200)

    if request.method == 'POST':
        serializer = AccountSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

@api_view(['POST'])
def delete_accounts(request):
    account_ids = request.data.get('ids', [])
    if not account_ids:
        return Response({"error": "No account IDs provided"}, status=400)

    if not isinstance(account_ids, list) or not all(isinstance(i, str) for i in account_ids):
        return Response({"error": "Invalid format. 'ids' must be a list of integers."}, status=400)

    deleted_count, _ = Account.objects.filter(user=request.user, id__in=account_ids).delete()
    
    return Response({"deleted": deleted_count}, status=200)


