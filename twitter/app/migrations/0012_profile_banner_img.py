# Generated by Django 4.1.7 on 2024-01-12 16:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0011_profile_birthday'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='banner_img',
            field=models.ImageField(blank=True, null=True, upload_to='banners'),
        ),
    ]
