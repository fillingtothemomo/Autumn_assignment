from django.db import models
from .UserModel import User


class Comment(models.Model):
    desc=models.TextField(max_length=200)
    time=models.TimeField()
    card=models.ForeignKey("Card", on_delete=models.CASCADE)
    sender=models.ManyToManyField(User)
    def __str__(self):
        return self.desc