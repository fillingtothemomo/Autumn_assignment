from channels.consumer import AsyncConsumer

class ProjectConsumer(AsyncConsumer):
    async def websocket_connect(self, event):
        project_room = "projectroom"
        self.project_room = project_room
        await self.channel_layer.group_add(
            project_room, self.channel_name
        )
        await self.send({
            "type": "websocket.accept"
        })

    async def websocket_receive(self, event):
        initial_data = event.get("text", None)
        source_card_id = event.get("source_card_id", None)

        await self.channel_layer.group_send(
        self.project_room, {
            "type": "project_message",
            "text": initial_data,
            "source_card_id": source_card_id,
        }
    )
    async def project_message(self, event):
        source_card_id = event.get("source_card_id", None)
        text = event.get("text", None)

        await self.send({
        "type": "websocket.send",
        "text": text,
        "source_card_id": source_card_id,
    })

    async def websocket_disconnect(self, event):
        print('Disconnect', event)
