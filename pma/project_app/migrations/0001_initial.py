# Generated by Django 3.2.21 on 2023-09-25 18:37

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_name', models.CharField(max_length=50)),
                ('user_mail', models.EmailField(max_length=254)),
                ('user_pass', models.CharField(max_length=50)),
                ('is_admin', models.BooleanField()),
                ('prof_pic', models.ImageField(upload_to='')),
            ],
        ),
    ]
