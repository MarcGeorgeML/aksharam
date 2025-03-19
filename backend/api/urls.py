from django.urls import path
from . import views

urlpatterns = [
    path('testcategories/', views.get_word_categories),
    path('test/', views.test),
    path('testcanvas/', views.test_canvas, name="testcanvas"),
    path("notes/", views.note_list_create, name="note-list"),  
    path("notes/delete/<int:pk>/", views.note_delete, name="delete-note"),
    path("letters/", views.get_all_letters, name="letters"),
    path("words/", views.get_all_words, name="words"),
    path("sentences/", views.get_all_sentences, name="sentences"),
    path('scan/', views.scan_image, name='scan_image'),
    path('user/', views.get_user_data, name='get_user_data'),
    path('get_user_progress/', views.get_user_progress, name='get_user_progress'),
    path('update_user_progress/', views.update_user_progress, name='update_user_progress'),
]

