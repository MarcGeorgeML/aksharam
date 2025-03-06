from django.db import models
from django.contrib.auth.models import User

# class UserData(models.Model):
#     username = models.CharField(max_length=100)
#     password = models.CharField(max_length=100)
#     email = models.CharField(max_length=100)
#     score = models.IntegerField()

class WordCategory(models.Model):
    category = models.CharField(max_length=255, unique=True)

    class Meta:
        db_table = "word_category"

    def __str__(self):
        return self.category


class Word(models.Model):
    word = models.CharField(max_length=255)
    english_version = models.CharField(max_length=255)
    word_translation = models.CharField(max_length=255)
    category = models.ForeignKey(WordCategory, on_delete=models.CASCADE, related_name='words')

    class Meta:
        db_table = "words"

    def __str__(self):
        return self.word
    

class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")

    def __str__(self):
        return self.title
