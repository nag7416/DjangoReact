from django.contrib import admin
from django.urls import path
from .views import PostsAPI, userAPI, userDetail, likeToggle, user_liked_posts, hashtags, posts_by_hashtag, bookmark_posts, bookmarkToggle, PostDetail, userMedia, comments, post_comment_view, post_upload_view, subscribeToggle, logout

urlpatterns = [
    path('api/posts', PostsAPI, name='postsapi'),
    path('api/user', userAPI, name='userapi'),

    path('api/<str:username>/status/<str:post_id>', PostDetail, name='PostDetail'),

    path('api/<str:username>/status/<str:post_id>/comments', comments, name='comments'),

    path('api/<str:username>', userDetail, name='userDetail'),
    
    path('api/<str:username>/user_liked_posts', user_liked_posts, name='user_liked_posts'),
    path('api/<str:username>/user_media', userMedia, name='user_media'),
    path('api/separate_hashtags/', hashtags, name='separate_hashtags'),
    path('api/posts_by_hashtag/<str:name>/', posts_by_hashtag, name='posts_by_hashtag'),

    path('<str:post_id>/like', likeToggle, name='likeToggle'),
    path('<str:post_id>/bookmark', bookmarkToggle, name='bookmarkToggle'),

    path('api/<str:username>/subscribe', subscribeToggle, name='subscribeToggle'),


    path('api/bookmark_posts/', bookmark_posts, name='bookmark_posts'),


    path('api/<str:username>/status/<str:post_id>/post_comment', post_comment_view, name='post_comment_view'),
    path('api/post_upload/', post_upload_view, name='post_upload_view'),


    path('logout', logout, name='logout'),
]