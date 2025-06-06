from django.urls import path
from .views import hello_world, accounts

urlpatterns = [
    path('hello/', hello_world),
    path('accounts/', accounts),
]
