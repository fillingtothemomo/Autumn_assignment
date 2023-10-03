
from django.db import models

from .UserModel import User


class Project(models.Model) :
    name=models.CharField(max_length=50)
    desc=models.TextField(max_length=254)
    proj_link=models.URLField(max_length=200)
    repo_link=models.URLField(max_length=200)
    pic=models.ImageField()
    members=models.ManyToManyField(User)
    def __str__(self):
        return self.name