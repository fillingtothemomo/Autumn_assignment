
from django.db import models

from .UserModel import User


class Project(models.Model) :
    name = models.CharField(max_length=50,blank=True
                            )
    desc=models.TextField(max_length=254)
    proj_link=models.URLField(max_length=200,null=True,default='DEFAULT')
    repo_link=models.URLField(max_length=200,null=True,default='DEFAULT')
    pic=models.ImageField(null=True)
    members=models.ManyToManyField(User)
    def __str__(self):
        return self.name