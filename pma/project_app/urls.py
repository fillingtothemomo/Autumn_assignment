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
    path('get_oauth_token/', new_token),
    path('send_token_request/', login_redirect),
    path('logout_user/', logout_user),
    path('projects/create/',create_project),
    path('create_list/',create_list),
    path('create_card/',create_card),
    path('create_comment/',create_comment),
    path('create_project/',create_project),
    path('add_members/<int:project_id>/', addMember, name='add_members'),
    path('get_project_by_name/', get_project_by_name, name='get_project_by_name'),
    path('users/disable/', UserViewSet.as_view({'post': 'disable_user'}), name='disable-user'),
    path('users/change_user_role/', UserViewSet.as_view({'post': 'change_user_role'}), name='change_user_role'),



]