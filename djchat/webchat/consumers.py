from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer
from django.contrib.auth import get_user_model

from .models import Conversation, Message

User = get_user_model()


class WebChatConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.channel_id = None
        self.user = None

    def connect(self):
        self.user = self.scope["user"]
        self.accept()
        if not self.user.is_authenticated:
            self.close(code=4001)
            return

        self.channel_id = self.scope["url_route"]["kwargs"]["channelId"]

        async_to_sync(self.channel_layer.group_add)(
            self.channel_id, self.channel_name
        )

    def receive_json(self, content):
        [conversation, isCreated] = Conversation.objects.get_or_create(
            channel_id=self.channel_id
        )

        sender = self.user
        content = content["message"]
        msg = Message.objects.create(
            conversation=conversation, sender=sender, content=content
        )

        async_to_sync(self.channel_layer.group_send)(
            self.channel_id,
            {
                "type": "chat.message",
                "new_message": {
                    "id": msg.id,
                    "sender": msg.sender.username,
                    "content": msg.content,
                    "timestamp": msg.timestamp.isoformat(),
                },
            },
        )

    def chat_message(self, event):
        self.send_json(event)

    def disconnect(self, close_code):
        # TODO: Refactor
        # This is for if there is an authentication error and use doesn't
        # created a group
        if self.channel_id:
            async_to_sync(self.channel_layer.group_discard)(
                self.channel_id, self.channel_name
            )

        super().disconnect(close_code)
