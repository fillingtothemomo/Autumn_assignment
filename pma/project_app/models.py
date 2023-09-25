from django.db import models

class User(models.Model):
    user_name=models.CharField(max_length=50)
    user_mail=models.EmailField(max_length=254)
    user_pass = models.CharField(max_length=50)
    is_admin=models.BooleanField()
    prof_pic=models.ImageField()

class Project(models.Model) :
    pro_name=models.CharField(max_length=50)
    pro_desc=models.TextField(max_length=254)
    proj_link=models.URLField(max_length=200)
    repo_link=models.URLField(max_length=200)
    proj_pic=models.ImageField()
    members=models.ManyToManyField(User)
    
class Lists(models.Model):
    list_name=models.CharField(max_length=50)
    projects=models.ForeignKey("Project",  on_delete=models.CASCADE)

class Cards(models.Model):
    title=models.CharField(max_length=50)
    card_desc=models.TextField(max_length=254)
    created_on=models.DateTimeField(auto_now_add=True)
    resolved_on=models.DateTimeField
    due_date=models.DateTimeField
    assignees=models.ManyToManyField(User)
    card_color=models.CharField(max_length=20)
    list=models.ForeignKey("Lists",on_delete=models.CASCADE)

class Attachments(models.Model):
    link=models.URLField( max_length=200)
    photo=models.ImageField
    card=models.ForeignKey("Cards", on_delete=models.CASCADE)

class Comments(models.Model):
    com_desc=models.TextField(max_length=200)
    time=models.TimeField(auto_now_add=True)
    card=models.ForeignKey("Cards", on_delete=models.CASCADE)
    sender=models.ForeignKey("User",on_delete=models.CASCADE)