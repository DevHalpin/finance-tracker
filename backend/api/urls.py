from django.urls import path
from .views import hello_world, accounts, delete_accounts

urlpatterns = [
    path('hello/', hello_world),
    path('accounts/', accounts),
    path('accounts/bulk-delete/', delete_accounts),
]
