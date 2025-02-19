from django.urls import path
from . import views

urlpatterns = [
    path('testhtml/', views.testhtml),
    path('test/', views.test),
]

