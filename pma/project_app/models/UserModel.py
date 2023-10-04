from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _




class User(AbstractUser):
      name = models.CharField(max_length = 50, blank = True, null = True)
      email = models.EmailField(_('email address'), unique = True, default='DEFAULT')
      is_admin=models.BooleanField()
      prof_pic=models.ImageField(null=True)
      USERNAME_FIELD = 'email'
      REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

      def __str__(self):
        return self.name