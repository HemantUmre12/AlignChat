from account.views import AccountViewSet, JWTCookieTokenObtainPairView
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from server.views import CategoryListViewSet, ServerListViewSet
from webchat.consumers import WebChatConsumer
from webchat.views import MessageViewSet

rounter = DefaultRouter()
rounter.register("api/server/select", ServerListViewSet)
rounter.register("api/server/category", CategoryListViewSet)
rounter.register("api/messages", MessageViewSet, basename="message")
rounter.register("api/account", AccountViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/docs/schema", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/docs/schema/ui", SpectacularSwaggerView.as_view(url_name="schema")
    ),
    path(
        "api/token/",
        JWTCookieTokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path(
        "api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"
    ),
] + rounter.urls

websocket_url_patterns = [
    path("<str:serverId>/<str:channelId>", WebChatConsumer.as_asgi())
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL, document_root=settings.MEDIA_ROOT
    )
