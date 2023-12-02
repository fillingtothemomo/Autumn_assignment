from channels.routing import ProtocolTypeRouter,URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.urls import path
from project_app.consumers import ProjectConsumer





application=ProtocolTypeRouter({
    'websocket':AllowedHostsOriginValidator(
    URLRouter({
     path('',ProjectConsumer)   
    })
    )
})