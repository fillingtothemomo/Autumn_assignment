from project_app import views
from django.urls import path
from django.urls import path, include
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'login',views.UserViewSet,basename="login")
router.register(r'projects',views.ProjectViewSet,basename="project")
router.register(r'lists',views.ListViewSet,basename="list")
router.register(r'cards',views.CardViewSet,basename="card")
router.register(r'comments',views.CommentViewSet,basename="comment")
urlpatterns = router.urls