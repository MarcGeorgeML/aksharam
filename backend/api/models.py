from django.db import models

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
