from django.urls import path
from .views import hello_world, get_accounts

urlpatterns = [
    path('hello/', hello_world),
    path('accounts/', get_accounts),
]
