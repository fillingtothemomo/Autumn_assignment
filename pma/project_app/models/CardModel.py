
from django.db import models
from .UserModel import User


class Card(models.Model):
    title=models.CharField(max_length=50)
    desc=models.TextField(max_length=254)
    created_on=models.DateTimeField(auto_now_add=True)
    resolved_on=models.DateTimeField
    due_date=models.DateTimeField
    assignees=models.ManyToManyField(User)
    color=models.CharField(max_length=20,null=True,blank=True)
    lists=models.ForeignKey("List",on_delete=models.CASCADE)
    def __str__(self):
        return self.title