from django.db import models
from django.contrib.auth.models import AbstractUser
# Change this line
# from django.utils.translation import ugettext_lazy as _

# to
from django.utils.translation import gettext_lazy as _




class User(AbstractUser):
      name = models.CharField(max_length = 50, blank = True, null = True)
      email = models.EmailField(_('email address'), unique = True, default='DEFAULT')
      year=models.IntegerField(null=True)
      enrollment_no=models.IntegerField(null=True)
      is_admin=models.BooleanField(default=False)
      prof_pic=models.ImageField(null=True)
      is_disabled=models.BooleanField(default=False)

    
      USERNAME_FIELD = 'email'
      REQUIRED_FIELDS = ['name']

      def __str__(self):
        return self.name