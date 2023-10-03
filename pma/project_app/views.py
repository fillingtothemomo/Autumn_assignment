
from django.shortcuts import redirect
from project_app.models import *
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from .credentials import CLIENT_ID,CLIENT_SECRET,REDIRECT_URI
import requests
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from django.contrib.auth import login, authenticate, logout
from rest_framework import viewsets
from .serializers import *
from rest_framework.decorators import action
from rest_framework import status

# def auth(name,email,year):
#     try:
#         user=User.objects.get(name=name)
#         return user
#     except User.DoesNotExist:
#         User.objects.create(name=name, email=email,
#                                year=year)
#         user = User.objects.get(name=name)

# def get_user(name):
#     try:
#         return User.objects.get(name=name)
#     except User.DoesNotExist:
#         return None        
    
# @api_view(('GET',))
# @authentication_classes([])
# @permission_classes([])
# def login_redirect(request):
#     SITE = f'https://channeli.in/oauth/authorise/?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}get_oauth_token/'
#     return redirect(SITE)    

# @api_view(('GET', 'POST'))
# @authentication_classes([])
# @permission_classes([])
# def get_token(request):
#     AUTHORISATION_CODE = request.GET.get('code', '')
#     post_data = {
#         "client_id": CLIENT_ID,
#         "client_secret": CLIENT_SECRET,
#         "grant_type": "authorization_code",
#         "redirect_uri": f"{REDIRECT_URI}get_oauth_token/",
#         "code": AUTHORISATION_CODE,
#     }
#     response = requests.post('https://channeli.in/open_auth/token/', post_data)

#     ACCESS_TOKEN = response.json().get('access_token', '')
#     TOKEN_TYPE = response.json().get('token_type', '')
#     REFRESh_TOKEN = response.json().get('refresh_token', '')
#     authorization_data = {
#         "Authorization": f"{TOKEN_TYPE} {ACCESS_TOKEN}"
#     }
     
#     response = requests.get(
#         'https://channeli.in/open_auth/get_user_data/', headers=authorization_data)
#     print(response.json())
#     is_member = False
#     name = response.json()['person']['fullName']
#     year = response.json()['student']['currentYear']
#     email = response.json()['contactInformation']['emailAddress']
    
#     for role in response.json()['person']['roles']:
#         if (role['role'] == "Maintainer"):
#             is_member = True
#     if is_member:
#         try:
#             user = auth( name=name, year=year,
#                         email=email)
#         except:
#             return Response("unable to create user")
#         try:
#             login(request, user)
#         except:
#             return Response("unable to log in successfully")
#     else:
#         return Response("You are not a member of IMG")

#     return redirect(f'{REDIRECT_URI}dashboard')
 
# @api_view(('GET'))
# def logout_user(request):
#       if request.user.is_authenticated:
#         logout(request)
#         return Response("user logged out Successfully")  
     

class UserViewSet(viewsets.ModelViewSet):
    queryset=User.objects.all()
    serializer_class=UserSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset=Project.objects.all()  
    serializer_class=ProjectSerializer

    @action(detail=True, methods=['POST'])
    def addMember(self,request,pk=None):
        project=self.get_object()
        name=request.data.get('name')

        try:
            user_to_add=User.objects.get(name=name)
        except: User.DoesNotExist
    
        if user_to_add not in project.members.all():
            project.members.add(user_to_add)
            return Response({'detail': f'{name} added to the project'}, status=status.HTTP_200_OK)

        else:
            return Response({'detail': f'{name} is already a member of the project'}, status=status.HTTP_400_BAD_REQUEST)
    
class ListViewSet(viewsets.ModelViewSet):
    queryset=List.objects.all()
    serializer_class=ListSerializer

    @action(detail=True,methods=['POST'])
    def addProject(self,request,pk=None):
        list=self.get_object()
        name=request.data.get('name')

        try:
            project_to_add=Project.objects.get(name=name)
        except: Project.DoesNotExist

        if project_to_add not in list.projects.all():
            list.projects.add(project_to_add)   
            return Response({'detail': f'{name} added to the list'}, status=status.HTTP_200_OK)
        
        else:
            return Response({'detail': f'{name} is already a project of the list'}, status=status.HTTP_400_BAD_REQUEST)
        
class CardViewSet(viewsets.ModelViewSet):
    queryset=Card.objects.all()
    serializer_class=CardSerializer
    
    @action(detail=True,methods=['POST'])
    def addList(self,request,pk=None):
        card=self.get_object()
        name=request.data.get('name')

        try:
            list_to_add=List.objects.get(name=name)
        except: List.DoesNotExist

        if list_to_add not in Card.list.all():
            card.projects.add(list_to_add)   
            return Response({'detail': f'{name} added to the card'}, status=status.HTTP_200_OK)
        
        else:
            return Response({'detail': f'{name} is already a list of the card'}, status=status.HTTP_400_BAD_REQUEST)

class CommentViewSet(viewsets.ModelViewSet):
    queryset=Comment.objects.all()
    serializer_class=CommentSerializer
    
    @action(detail=True,methods=['POST'])
    def addcard(self,request,pk=None):
        comment=self.get_object()
        title=request.data.get('title')

        try:
            card_to_add=List.objects.get(title=title)
        except: Card.DoesNotExist

        if card_to_add not in comment.card.all():
            comment.projects.add(card_to_add)   
            return Response({'detail': f'{title} added to the comment'}, status=status.HTTP_200_OK)
        
        else:
            return Response({'detail': f'{title} is already a card of the comment'}, status=status.HTTP_400_BAD_REQUEST)            

    @action(detail=True, methods=['POST'])
    def add_sender(self, request, pk=None):
        comment = self.get_object()
        sender_name = request.data.get('sender_name')  

        try:
            sender = User.objects.get(name=sender_name)
        except User.DoesNotExist:
            return Response({'detail': f'User with username "{sender_name}" not found'}, status=status.HTTP_404_NOT_FOUND)

        comment.senders.add(sender)
        return Response({'detail': f'{sender_name} assigned as a sender to the comment'}, status=status.HTTP_200_OK)                  