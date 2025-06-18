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

