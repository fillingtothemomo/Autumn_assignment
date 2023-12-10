import json

from channels.generic.websocket import AsyncWebsocketConsumer


class ProjectConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if self.scope["user"].is_anonymous:
            await self.close()
            return

        self.user = self.scope["user"]
        self.group_name = f"job-posting-{self.user.id}"

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def propagate_status(self, event):
        if not self.scope["user"].is_anonymous:
            message = event["message"]
            await self.send(text_data=json.dumps(message))