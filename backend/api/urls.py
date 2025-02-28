from django.urls import path
from . import views

urlpatterns = [
    path('testcategories/', views.get_word_categories),
    path('test/', views.test),
]

