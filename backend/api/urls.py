# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AccountViewSet, hello_world

router = DefaultRouter()
router.register(r'accounts', AccountViewSet, basename='accounts')

urlpatterns = [
    path('hello/', hello_world),
    path('', include(router.urls)),
]
