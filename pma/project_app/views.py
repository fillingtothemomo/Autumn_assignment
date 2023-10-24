
from django.shortcuts import redirect
from project_app.api.permissions import IsAdminOrReadOnly
from project_app.models import *
from rest_framework.decorators import api_view, authentication_classes, permission_classes
import requests
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from django.contrib.auth import login, authenticate, logout
from rest_framework import viewsets
from .serializers import *
from rest_framework.decorators import action
from rest_framework import status
from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from django_elasticsearch_dsl_drf.viewsets import DocumentViewSet
from django_elasticsearch_dsl_drf.filter_backends import(CompoundSearchFilterBackend,FilteringFilterBackend)
CLIENT_ID="96sBK49wdP0wMocpEHhp4GqOPD8vUdytDqWojUIZ"
CLIENT_SECRET="SczIB8HE425u07XIDciCK2PIyL8m6YlRAAJvk6ShLcbWrWGyG3Jlt90KqYDUHbzQMNRzOVi6nvNA3fj1cTdYqQROxAs8gITHo1T4R85a8GzrN8Hv8dU4T9d1uCk4QTia"
REDIRECT_URI="http://127.0.0.1:8000/project_app/get_oauth_token/"


def auth(name,email):
    try:
        user = User.objects.get(name=name)
        print("poopoo")
        return user

    except:
        print("tootot")
        User.objects.create(name=name,email=email)
        print("poopoo1")

        user = User.objects.get(name=name)
        return user


def get_user(name):
    try:
        return User.objects.get(name=name)
    except User.DoesNotExist:
        return None
    
@api_view(('GET',))
def login_redirect(request):
    SITE = f'https://channeli.in/oauth/authorise/?client_id={CLIENT_ID}'
    print("haha")
    return redirect(SITE)    
@api_view(('GET','POST'))
def new_token(request):
    print("hello")
    AUTHORISATION_CODE = request.GET.get('code',"")
    print(AUTHORISATION_CODE)
    post_data = {
        "client_id":CLIENT_ID,
         "client_secret":CLIENT_SECRET,
         "grant_type": "authorization_code",
         "redirect_uri":REDIRECT_URI,
       "code":AUTHORISATION_CODE   }
    response =requests.post('https://channeli.in/open_auth/token/', post_data)
    print(response)
    ACCESS_TOKEN = response.json().get('access_token', '')
    TOKEN_TYPE = response.json().get('token_type', '')
    REFRESh_TOKEN = response.json().get('refresh_token', '')
    print(TOKEN_TYPE)
    print(ACCESS_TOKEN)
    print("helo")
    authorization_data = {
        "Authorization": f"{TOKEN_TYPE} {ACCESS_TOKEN}"
    }

    response = requests.get(
        'https://channeli.in/open_auth/get_user_data/', headers=authorization_data)
    print(response.json())
    is_member = False
    name = response.json()['person']['fullName']
    email = response.json()['contactInformation']['emailAddress']

    for role in response.json()['person']['roles']:
        if (role['role'] == "Maintainer"):
            is_member = True

    if is_member:
        try:
            user = auth(name=name,email=email)
            print("hello")
            user.save()
        except:
            return Response("Unable to create user")

        try:
            login(request, user)            

           
        except Exception as e:
            return Response("Error making POST request: " + str(e))
    else:
        return Response("You are not a member of IMG")

    return redirect("/project_app/login")

@api_view(('GET',))
def logout_user(request):
    if request.user.is_authenticated:
        logout(request)
        return Response("user  logged out Successfully")
    else :return Response("User already logged out")
     

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset=User.objects.all()
    serializer_class=UserSerializer


    @action(methods=['POST'],detail=True)
    def disable_user(self,request):
        name=request.data.get('name')
        try:
            user_to_disable=User.objects.get(name=name)
        except: return Response({'detail': f'User with name {name} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        if user_to_disable.is_disabled==False:
             user_to_disable.is_disabled=True
             return Response({'detail': f'{name} is disabled successfully'}, status=status.HTTP_400_BAD_REQUEST)

        else :
         return Response({'detail': f'{name} is already disabled'}, status=status.HTTP_400_BAD_REQUEST)
 

class ProjectViewSet(viewsets.ModelViewSet):

    queryset=Project.objects.all()  
    serializer_class=ProjectSerializer


   

    def update(self, request, pk=None):
        pass

    def destroy(self, request, pk=None):
        pass
    
    # @action(methods=['POST'], detail=False)
    # def create_project(self, request):
    #     user = request.user
    #     serializer = ProjectSerializer(data=request.data)
    #     if serializer.is_valid():
    #         user.is_admin=True
    #         project = serializer.save()
    #         return Response({'detail': 'Project created successfully.', 'project_id': project.id}, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['POST'],detail=True)
    def addMember(self,request,pk=None):
        project=self.get_object()
        name=request.data.get('name')

        try:
            user_to_add=User.objects.get(name=name)
        except: return Response({'detail': f'User with name {name} does not exist.'}, status=status.HTTP_404_NOT_FOUND)

    
        if user_to_add not in project.members.all():
            project.members.add(user_to_add)
            return Response({'detail': f'{name} added to the project'}, status=status.HTTP_200_OK)

        else:
            return Response({'detail': f'{name} is already a member of the project'}, status=status.HTTP_400_BAD_REQUEST)
        
    @action(methods=['POST'],detail=True,permission_classes=[IsAdminOrReadOnly])
    def addAdmin(self,request,pk=None):
        project=self.get_object()
        name=request.data.get('name')

        try:
            make_admin=project.members.get(name=name)
        except: return Response({'detail': f'User with name {name} not a member of the project.'}, status=status.HTTP_404_NOT_FOUND)

    
        if make_admin.is_admin==False:
            make_admin.is_admin=True
            return Response({'detail': f'{name} made admin'}, status=status.HTTP_200_OK)

        else:
            return Response({'detail': f'{name} is already an admin of the project'}, status=status.HTTP_400_BAD_REQUEST)
        
        
    

class ListViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]

    queryset=List.objects.all()
    serializer_class=ListSerializer

    def get_queryset(self):
        project_id = self.request.query_params.get('project_id')

        if project_id:
            return List.objects.filter(projects=project_id)

        return super(ListViewSet, self).get_queryset()
    def update(self, request, pk=None):
        pass

    def destroy(self, request, pk=None):
        pass




    @action(detail=True,methods=['POST'])
    def addProject(self,request,pk=None,name=None):
        list1=self.get_object()
        name=request.data.get('name')

        try:
            project_to_add=Project.objects.get(name=name)
        except: return Response({'detail': f'Project with name {name} does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        if project_to_add not in list1.projects.all():
            list1.projects.add(project_to_add)   
            return Response({'detail': f'{name} added to the list'}, status=status.HTTP_200_OK)
        
        else:
            return Response({'detail': f'{name} is already a project of the list'}, status=status.HTTP_400_BAD_REQUEST)
        
class CardViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]

    queryset=Card.objects.all()
    serializer_class=CardSerializer
    
    def get_queryset(self):
        list_id = self.request.query_params.get('list_id')

        if list_id:
            return Card.objects.filter(lists=list_id)

    def update(self, request, pk=None):
        pass

    def destroy(self, request, pk=None):
        pass

    @action(detail=True,methods=['POST'])
    def addList(self,request,pk=None,name=None):
        card=self.get_object()
        name=request.data.get('name')

        try:
            list_to_add=List.objects.get(name=name)
        except: return Response({'detail': f'List with name {name} does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        if list_to_add not in card.lists.all():
            card.projects.add(list_to_add)   
            return Response({'detail': f'{name} added to the card'}, status=status.HTTP_200_OK)
        
        else:
            return Response({'detail': f'{name} is already a list of the card'}, status=status.HTTP_400_BAD_REQUEST)

class CommentViewSet(viewsets.ModelViewSet):
    # permission_classes = []

    queryset=Comment.objects.all()
    serializer_class=CommentSerializer

    def create(self, request):
        pass

    def update(self, request, pk=None):
        pass

    def destroy(self, request, pk=None):
        pass
    
    @action(detail=True,methods=['POST'])
    def addcard(self,request,pk=None,name=None):
        comment=self.get_object()
        title=request.data.get('title')

        try:
            card_to_add=List.objects.get(title=title)
        except: return Response({'detail': f'Card with name {title} does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        if card_to_add not in comment.card.all():
            comment.projects.add(card_to_add)   
            return Response({'detail': f'{title} added to the comment'}, status=status.HTTP_200_OK)
        
        else:
            return Response({'detail': f'{title} is already a card of the comment'}, status=status.HTTP_400_BAD_REQUEST)            

    @action(detail=True, methods=['POST'])
    def add_sender(self, request, pk=None,name=None):
        comment = self.get_object()
        sender_name = request.data.get('sender_name')  

        try:
            sender = User.objects.get(name=sender_name)
        except :return Response({'detail': f'User with username "{sender_name}" not found'}, status=status.HTTP_404_NOT_FOUND)

        comment.senders.add(sender)
        return Response({'detail': f'{sender_name} assigned as a sender to the comment'}, status=status.HTTP_200_OK)                  
    
class CardDocumentView(DocumentViewSet):
    document=CardDocument
    serializer_class=CardDocumentSerializer

    filter_backends=[
        FilteringFilterBackend,
        CompoundSearchFilterBackend
    ]
    search_fields=('title','desc')
    multi_match_search_fields=('title','desc')
    filter_fields={
        'title':'title',
        'desc':'desc'
    }