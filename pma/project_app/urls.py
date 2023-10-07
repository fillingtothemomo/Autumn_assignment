from project_app.views import *
from django.urls import path
from django.urls import path, include
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'login',UserViewSet,basename="login")
router.register(r'projects',ProjectViewSet,basename="project")
router.register(r'lists',ListViewSet,basename="list")
router.register(r'cards',CardViewSet,basename="card")
router.register(r'comments',CommentViewSet,basename="comment")
urlpatterns = router.urls
urlpatterns = [
    path('', include(router.urls)),
    # path('get_oauth_token/', get_token),
    path('send_token_request/', login_redirect),
]