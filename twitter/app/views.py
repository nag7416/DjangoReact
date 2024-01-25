from django.shortcuts import render
from .models import Post, Comment
from django.http import JsonResponse, HttpResponse
from django.utils.timesince import timesince
from django.utils.timezone import localtime
from django.utils.timezone import now
from django.contrib.auth.models import User, auth
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from taggit.models import Tag
from django.db.models import Q
from django.db.models import Count

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import CommentSerializer













url = 'http://localhost:8000'


def format_date(value):
    if not value:
        return ""

    # Convert the date string to a datetime object
    date_object = datetime.strptime(value, '%Y-%m-%d')

    # Format the date as "Month DD"
    formatted_date = date_object.strftime('%B %d')

    return formatted_date


def time_ago(value):
    if not value:
        return ""

    now_utc = now()
    time_difference = now_utc - value

    if time_difference.days > 365:
        return f'{time_difference.days // 365} years ago'
    elif time_difference.days > 30:
        return f'{time_difference.days // 30} months ago'
    elif time_difference.days > 7:
        return f'{time_difference.days // 7} weeks ago'
    elif time_difference.days > 1:
        return f'{time_difference.days} days ago'
    elif time_difference.seconds > 3600:
        return f'{time_difference.seconds // 3600} hours ago'
    elif time_difference.seconds > 60:
        return f'{time_difference.seconds // 60} minutes ago'
    else:
        return f'{time_difference.seconds} seconds ago'
    

def format_views_as_K(value):
    if value >= 10 ** 9:  # 1 Billion and above
        return f'{value / 10 ** 9:.1f}B'
    elif value >= 10 ** 6:  # 1 Million and above
        return f'{value / 10 ** 6:.1f}M'
    elif value >= 10 ** 3:  # 1 Thousand and above
        return f'{value / 10 ** 3:.1f}K'
    else:
        return str(value)



def PostsAPI(request):
    posts = Post.objects.all().order_by('-id')
    user = request.user
    # posts = Post.objects.filter(user__in=user.profile.subscribers.all()).order_by('-id')
    user = request.user
    posts_list = []

    
    for post in posts:
        post_dict = {
            'id': post.post_id,
            'user': post.user.username,
            'user_img': url + post.user.profile.profile_img.url,
            'name': post.user.first_name,
            'published': time_ago(post.published),
            'description': post.description,
            'like': format_views_as_K(post.like.count()),
            'comment': post.comment,
            'liked': user in post.like.all(),
            'tags': list(post.hashtags.all().values()),
            'bookmarked': user in post.bookmark.all(),
            'comments_count': format_views_as_K(len(Comment.objects.filter(post=post).all())),
            'views': format_views_as_K(post.views),
        }
        if post.image and post.image.url:
            post_dict['image'] = url + post.image.url
        posts_list.append(post_dict)
    return JsonResponse(posts_list, safe=False)





def PostDetail(request, username, post_id):
    user = get_object_or_404(User, username=username)
    post = get_object_or_404(Post, post_id=post_id)
    post.views = post.views + 1
    post.save()
    print(post.views)

    user_posts = [{
        'id': post.post_id,
        'user': post.user.username,
        'user_img': url + post.user.profile.profile_img.url,
        'name': post.user.first_name,
        'image': url + post.image.url if post.image else None,
        'published': time_ago(post.published),
        'description': post.description,
        'like': format_views_as_K(post.like.count()),
        'liked': request.user in post.like.all(),
        'comments_count': format_views_as_K(len(Comment.objects.filter(post=post).all())),
        'tags': list(post.hashtags.all().values()),
        'bookmarked': request.user in post.bookmark.all(),
        'views': format_views_as_K(post.views),
    }]

    user_dict = [{
        'id': user.id, 
        'user': user.username,
        'name': user.first_name,
        'profile_img': url+user.profile.profile_img.url,
        'banner_img': url + user.profile.banner_img.url,
        'bio': user.profile.bio,
        'location': user.profile.location,
        'birthday': format_date(user.profile.birthday.strftime('%Y-%m-%d')),
        'joined': format_date(user.date_joined.strftime('%Y-%m-%y')),
        'post': user_posts,
    }]

    return JsonResponse(user_dict, safe=False)














def userAPI(request):
    user = request.user

    posts_count = Post.objects.filter(user=user).all()
    user_lists = Post.objects.filter(user=user).all()
    user_posts = [] or None
    for post in user_lists:
        user_posts = [{
            'id': post.id,
            'user': post.user.username,
            'user_img': url + post.user.profile.profile_img.url,
            'name': post.user.first_name,
            'image': url + post.image.url if post.image else None,
            'published': time_ago(post.published),
            'description': post.description,
            'like': format_views_as_K(post.like.count()),
            'liked': user in post.like.all(),
            'comment': post.comment,
        }]


    user_data = [{
        'id': user.id, 
        'user': user.username,
        'name': user.first_name,
        'profile_img': url+user.profile.profile_img.url,
        'bio': user.profile.bio,
        'posts_count': format_views_as_K(len(posts_count)),
        'user_posts': user_posts,
    }]

    response = JsonResponse(user_data, safe=False)
    response['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    return response





def userDetail(request, username):
    current_user = get_object_or_404(User, username=username)
    posts_count = Post.objects.filter(user=current_user).all()

    user_lists = Post.objects.filter(user=current_user).all().order_by('-post_id')

    user_posts = [{
        'id': post.post_id,
        'user': post.user.username,
        'user_img': url + post.user.profile.profile_img.url,
        'name': post.user.first_name,
        'image': url + post.image.url if post.image else None,
        'published': time_ago(post.published),
        'description': post.description,
        'like': format_views_as_K(post.like.count()),
        'liked': request.user in post.like.all(),
        'bookmarked': request.user in post.bookmark.all(),
        'comment': post.comment,
        'location': post.user.profile.location,
    } for post in user_lists ]

   
    user_dict = [{
        'id': current_user.id, 
        'user': current_user.username,
        'name': current_user.first_name,
        'profile_img': url+current_user.profile.profile_img.url,
        'banner_img': url + current_user.profile.banner_img.url,
        'bio': current_user.profile.bio,
        'posts_count': format_views_as_K(len(posts_count)),
        'location': current_user.profile.location,
        'birthday': format_date(current_user.profile.birthday.strftime('%Y-%m-%d')),
        'user_posts': user_posts,
        'joined': format_date(current_user.date_joined.strftime('%Y-%m-%y')),
        'subscribed': request.user in current_user.profile.subscribers.all(),
        'subscribers': current_user.profile.subscribers.all().count(),
    }]

    response = JsonResponse(user_dict, safe=False)
    response['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    return response




def userMedia(request, username):
    user = get_object_or_404(User, username=username)

    images = Post.objects.filter(user=user).all()

    user_images = [{
        'id': post.post_id,
        'user': post.user.username,
        'user_img': url + post.user.profile.profile_img.url,
        'image': url + post.image.url if post.image else None,
    } for post in images ]

    return JsonResponse(user_images, safe=False)








@api_view(['GET'])
def comments(request, username, post_id):
    user = get_object_or_404(User, username=username)
    post = get_object_or_404(Post, post_id=post_id)

    comments = Comment.objects.filter(post=post).all().order_by('-created_at')
    comment_dict = [{
        'comment_id': p.comment_id,
        'post_id': p.post.post_id,
        'post_user': p.post.user.username,
        'comment_user_name': p.user.first_name,
        'comment_user': p.user.username,
        'commentuser_img': url + p.user.profile.profile_img.url,
        'published': time_ago(p.created_at),
        'body': p.body,
        'comments_count': format_views_as_K(len(comments.all())),
    } for p in comments]

    return JsonResponse(comment_dict, safe=False)










def user_liked_posts(request, username):
    user = get_object_or_404(User, username=username)
    posts = Post.objects.filter(like=user).all()
    posts_list = []
    if user.is_authenticated:
        for post in posts:
            post_dict = {
                'id': post.post_id,
                'user': post.user.username,
                'user_img': url + post.user.profile.profile_img.url,
                'name': post.user.first_name,
                'published': time_ago(post.published),
                'description': post.description,
                'like': format_views_as_K(post.like.count()),
                'comment': post.comment,
                'liked': user in post.like.all(),
            }
            if post.image and post.image.url:
                post_dict['image'] = url + post.image.url

            if post:
                post_dict['count'] = posts.count()
            posts_list.append(post_dict)
        return JsonResponse(posts_list, safe=False)
    else:
        return JsonResponse({'user is not authenticated'}, safe=False)





def hashtags(request):
    user = request.user
    top_n_trending = 10
    trending_hashtags = Tag.objects.annotate(post_count=Count('taggit_taggeditem_items')).order_by('-post_count')[:top_n_trending]
    trending_list = [{'id': hashtag.id, 'name': hashtag.name, 'slug': hashtag.slug, 'post_count': hashtag.post_count} for hashtag in trending_hashtags]

    return JsonResponse(trending_list, safe=False)

    



def posts_by_hashtag(request, name):
    tags = Tag.objects.filter(name__iexact=name)
    if not tags.exists():
        return JsonResponse([], safe=False)
    tag_filter = Q()
    for tag in tags:
        tag_filter |= Q(hashtags=tag)
    posts = Post.objects.filter(tag_filter)
    posts_list = []
    for post in posts:
        post_dict = {
            'id': str(post.post_id),
            'user': post.user.username,
            'user_img': f"http://localhost:8000{post.user.profile.profile_img.url}",
            'name': post.user.first_name,
            'published': post.published.strftime("%d %B %Y"),
            'description': post.description,
            'like': format_views_as_K(post.like.count()),
            'comment': post.comment,
            'liked': request.user in post.like.all(),
            'bookmarked': request.user in post.bookmark.all(),
            'tags': [{'id': tag.id, 'name': tag.name, 'slug': tag.slug} for tag in post.hashtags.all()],
            'image': f"http://localhost:8000{post.image.url}" if post.image else None
        }
        posts_list.append(post_dict)

    return JsonResponse(posts_list, safe=False)








def bookmark_posts(request):
    user = request.user
    posts = Post.objects.filter(bookmark=user).all()
    posts_list = []

    for post in posts:
        post_dict = {
            'id': post.post_id,
            'user': post.user.username,
            'user_img': url + post.user.profile.profile_img.url,
            'name': post.user.first_name,
            'published': time_ago(post.published),
            'description': post.description,
            'like': format_views_as_K(post.like.count()),
            'comment': post.comment,
            'liked': user in post.like.all(),
            'tags': list(post.hashtags.all().values()),
            'bookmarked': user in post.bookmark.all(),
        }
        if post.image and post.image.url:
            post_dict['image'] = url + post.image.url
        posts_list.append(post_dict)
    return JsonResponse(posts_list, safe=False)

    











@csrf_exempt
def likeToggle(request, post_id):
    user = request.user
    liked = False

    post = get_object_or_404(Post, post_id=post_id)
    if user.is_authenticated:
        if request.method == 'PUT':
            if user in post.like.all():
                post.like.remove(user)
                liked = False
                return JsonResponse({'liked': False}, safe=False)
            else:
                post.like.add(user)
                liked = True
                return JsonResponse({'liked': True}, safe=False)
        else:
            return JsonResponse("Requested method is not put", safe=False)
    else:
        return JsonResponse("the user is not authenticated", safe=False)

@csrf_exempt
def subscribeToggle(request, username):
    user = request.user
    subscribed = False

    profile = get_object_or_404(User, username=username)
    
    if user.is_authenticated:
        if request.method == 'PUT':
            if request.user == profile.profile.user:
                print(profile)
                return JsonResponse({'status': "Can't follow same user"})
            else:
                if user in profile.profile.subscribers.all():
                    profile.profile.subscribers.remove(user)
                    subscribed = False
                    return JsonResponse({'subscribed': False}, safe=False)
                else:
                    profile.profile.subscribers.add(user)
                    subscribed = True
                    return JsonResponse({'subscribed': True}, safe=False)
        else:
            return JsonResponse({'status': 'method is not put'})
    else:
        return JsonResponse({'status': 'user is not authenticated'})






@csrf_exempt
def bookmarkToggle(request, post_id):
    user = request.user
    bookmarked = False

    post = get_object_or_404(Post, post_id=post_id)
    if user.is_authenticated:
        if request.method == 'PUT':
            if user in post.bookmark.all():
                post.bookmark.remove(user)
                bookmarked = False
                return JsonResponse({'bookmarked': False}, safe=False)
            else:
                post.bookmark.add(user)
                bookmarked = True
                return JsonResponse({'bookmarked': True}, safe=False)
        else:
            return JsonResponse('requested method is not put', safe=False)
    else:
        return JsonResponse('the user is not authenticated', safe=False)
    






from .forms import CommentForm, PostForm
from django.shortcuts import redirect
import json

@csrf_exempt
def post_comment_view(request, username, post_id):
    user = get_object_or_404(User, username=username)
    post = get_object_or_404(Post, post_id=post_id, user=user.id)
    
    comments = Comment.objects.filter(post=post)

    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error in posting the comment - invalid JSON'})

        form = CommentForm(data)

        if form.is_valid():
            comment = form.save(commit=False)
            comment.post = post
            comment.user_id = data.get('user_id')
            comment.body = data.get('body')
            comment.user = request.user if request.user.is_authenticated else None
            comment.save()
            return JsonResponse({'status': 'comment posted successfully'})
        else:
            return JsonResponse({'status': 'error in posting the comment'})
    else:
        form = CommentForm()

    return JsonResponse(list(comments.values()), safe=False)





@csrf_exempt
def post_upload_view(request):
    if request.method == 'POST':
        form = PostForm(request.POST, request.FILES)
        if form.is_valid():
            description = form.cleaned_data['description']
            image = form.cleaned_data['image']
            instance = form.save(commit=False)
            instance.user = request.user
            instance.save()

            return JsonResponse({'status': 'Post uploaded successfully'})
        else:
            return JsonResponse({'status': 'error in post upload'})
        
    else:
        return JsonResponse({'status': 'invalid request method'})
    

@csrf_exempt
def logout(request):
    auth.logout(request)
    return JsonResponse({'status': 'logged out successfully'})


# def following(request, id):
#     profile = get_object_or_404(User, user=request.user)

#     user = get_object_or_404(User, id=id)

#     if request.user not in 

