# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AccountViewSet, CategoryViewSet, hello_world

router = DefaultRouter()
router.register(r'accounts', AccountViewSet, basename='accounts')
router.register(r'categories', CategoryViewSet, basename='categories')

urlpatterns = [
    path('hello/', hello_world),
    path('', include(router.urls)),
]
