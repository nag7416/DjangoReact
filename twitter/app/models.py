from django.db import models
from django.contrib.auth.models import User
import uuid
from ckeditor.fields import RichTextField
# Create your models here.
import re
from taggit.managers import TaggableManager

def generate_random_number():
    return str(uuid.uuid4().int & (1<<64)-1)

def generate_unique_number():
    return str(uuid.uuid4().int & (1<<64)-1)


class Post(models.Model):
    post_id = models.CharField(max_length=20, default=generate_random_number, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    image = models.FileField(upload_to='post_img', null=True, blank=True)
    published = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    description = RichTextField()
    hashtags = TaggableManager()
    like = models.ManyToManyField(User, related_name='like', null=True, blank=True)
    bookmark = models.ManyToManyField(User, related_name='bookmark', null=True, blank=True)
    comment = models.IntegerField(default=0)
    views = models.IntegerField(default=0)

    def __str__(self):
        return str(self.post_id) + ' | ' + str(self.description)
    
    def save(self, *args, **kwargs):
        if not self.image:
            self.image = None

        super().save(*args, **kwargs)

    

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    profile_img = models.ImageField(upload_to='profile_pics', null=True, blank=True)
    bio = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    birthday = models.DateField(blank=True, null=True)
    banner_img = models.ImageField(upload_to='banners', null=True, blank=True)
    subscribers = models.ManyToManyField(User, related_name='subscriber', null=True, blank=True)
    following = models.ManyToManyField(User, related_name='following', null=True, blank=True)

    def __str__(self):
        return str(self.user)
    


class Comment(models.Model):
    comment_id = models.CharField(max_length=255, default=generate_unique_number, unique=True)
    post = models.ForeignKey('Post', related_name='post', on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    body = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.comment_id)