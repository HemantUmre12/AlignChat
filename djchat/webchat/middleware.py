import jwt
from channels.db import database_sync_to_async
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser


@database_sync_to_async
def get_user(scope):
    token = scope["token"]
    model = get_user_model()

    try:
        if token:
            user_id = jwt.decode(
                token, settings.SECRET_KEY, algorithms=["HS256"]
            )["user_id"]
            return model.objects.get(id=user_id)
        else:
            return AnonymousUser()
    except (jwt.exceptions.DecodeError, model.DoesNotExist):
        return AnonymousUser()


def get_access_tokens(scope):
    headers = scope["headers"]
    headers_dict = dict(headers)
    cookies_str = headers_dict.get(b"cookie", b"").decode()
    cookies = {}

    for cookie in cookies_str.split("; "):
        cookie_key_value = cookie.split("=")
        if len(cookie_key_value) == 2:
            key = cookie_key_value[0]
            value = cookie_key_value[1]
            cookies[key] = value

    access_token = cookies.get("access_token")

    return access_token


class JWTAuthMiddleWare:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        scope["token"] = get_access_tokens(scope)
        scope["user"] = await get_user(scope)

        return await self.app(scope, receive, send)
