from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Account
from .schema import account_list_docs
from .serializer import AccountSerializer


class AccountViewSet(viewsets.ViewSet):
    queryset = Account.objects.all()
    permission_classes = [IsAuthenticated]

    @account_list_docs
    def list(self, request):
        # TODO: Handle error when "user_id" doesn't exists
        user_id = request.query_params.get("user_id")
        queryset = Account.objects.get(id=user_id)

        serializer = AccountSerializer(queryset)
        return Response(serializer.data)
