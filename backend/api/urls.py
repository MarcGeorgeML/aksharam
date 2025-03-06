from django.urls import path
from . import views

urlpatterns = [
    path('testcategories/', views.get_word_categories),
    path('test/', views.test),
    path('testcanvas/', views.test_canvas, name="testcanvas"),
    path("notes/", views.note_list_create, name="note-list"),  
    path("notes/delete/<int:pk>/", views.note_delete, name="delete-note"),
]

