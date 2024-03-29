from django.conf import settings
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .models import Account
from .schema import account_list_docs
from .serializer import (
    AccountSerializer,
    CustomTokenObtainPairSerializer,
    CustomTokenRefreshSerializer,
    RegisterSerializer,
)


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data["username"]

            forbidden_usernames = ["admin", "root", "superuser"]
            if username in forbidden_usernames:
                return Response(
                    {"error": "Username not allowed"},
                    status=status.HTTP_409_CONFLICT,
                )

            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        errors = serializer.errors
        if "username" in errors and "non_field_errors" not in errors:
            return Response(
                {"error": "Username already exists"},
                status=status.HTTP_409_CONFLICT,
            )

        return Response(errors, status=status.HTTP_400_BAD_REQUEST)


class LogOutAPIView(APIView):
    def post(self, request, format=None):
        response = Response("Logged out succesfully!")

        response.set_cookie(
            "refresh_token",
            "",
            expires=0,
            samesite=settings.SIMPLE_JWT["JWT_COOKIE_SAMESITE"],
            secure=settings.SIMPLE_JWT["IS_SECURE"],
        )
        response.set_cookie(
            "access_token",
            "",
            expires=0,
            samesite=settings.SIMPLE_JWT["JWT_COOKIE_SAMESITE"],
            secure=settings.SIMPLE_JWT["IS_SECURE"],
        )

        return response


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


class JWTSetCookieMixin:
    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get("refresh"):
            response.set_cookie(
                settings.SIMPLE_JWT["REFRESH_TOKEN_NAME"],
                response.data["refresh"],
                max_age=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
                httponly=True,
                samesite=settings.SIMPLE_JWT["JWT_COOKIE_SAMESITE"],
                secure=settings.SIMPLE_JWT["IS_SECURE"],
            )

            del response.data["refresh"]

        if response.data.get("access"):
            response.set_cookie(
                settings.SIMPLE_JWT["ACCESS_TOKEN_NAME"],
                response.data["access"],
                max_age=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
                httponly=True,
                samesite=settings.SIMPLE_JWT["JWT_COOKIE_SAMESITE"],
                secure=settings.SIMPLE_JWT["IS_SECURE"],
            )

            del response.data["access"]

        return super().finalize_response(request, response, *args, **kwargs)


class JWTCookieTokenObtainPairView(JWTSetCookieMixin, TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class JWTCookieTokenRefreshView(JWTSetCookieMixin, TokenRefreshView):
    serializer_class = CustomTokenRefreshSerializer
