from django.db import models



class Attachment(models.Model):
    link=models.URLField( max_length=200)
    photo=models.ImageField
    card=models.ForeignKey("Card", on_delete=models.CASCADE)