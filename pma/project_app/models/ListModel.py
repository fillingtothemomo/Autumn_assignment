
from django.db import models
from .ProjectModel import Project

class List(models.Model):
    name=models.CharField(max_length=50)
    projects=models.ForeignKey("Project",  on_delete=models.CASCADE)
    def __str__(self):
        return self.name