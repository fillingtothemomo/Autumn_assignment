from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _


class User(AbstractUser):
      username = models.CharField(max_length = 50, blank = True, null = True, unique = True)
      email = models.EmailField(_('email address'), unique = True, default='DEFAULT')
      password = models.CharField(max_length=50)
      is_admin=models.BooleanField()
      prof_pic=models.ImageField()
      USERNAME_FIELD = 'email'
      REQUIRED_FIELDS = ['username', 'first_name', 'last_name']



class Project(models.Model) :
    name=models.CharField(max_length=50)
    desc=models.TextField(max_length=254)
    proj_link=models.URLField(max_length=200)
    repo_link=models.URLField(max_length=200)
    pic=models.ImageField()
    members=models.ManyToManyField(User)
    
class List(models.Model):
    name=models.CharField(max_length=50)
    projects=models.ForeignKey("Project",  on_delete=models.CASCADE)

class Card(models.Model):
    title=models.CharField(max_length=50)
    desc=models.TextField(max_length=254)
    created_on=models.DateTimeField(auto_now_add=True)
    resolved_on=models.DateTimeField
    due_date=models.DateTimeField
    assignees=models.ManyToManyField(User)
    color=models.CharField(max_length=20)
    list=models.ForeignKey("List",on_delete=models.CASCADE)

class Attachment(models.Model):
    link=models.URLField( max_length=200)
    photo=models.ImageField
    card=models.ForeignKey("Card", on_delete=models.CASCADE)

class Comment(models.Model):
    desc=models.TextField(max_length=200)
    time=models.TimeField(auto_now_add=True)
    card=models.ForeignKey("Card", on_delete=models.CASCADE)
    sender=models.ForeignKey("User",on_delete=models.CASCADE)