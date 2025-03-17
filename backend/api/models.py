from django.db import models
from django.contrib.auth.models import User

# class UserData(models.Model):
#     username = models.CharField(max_length=100)
#     password = models.CharField(max_length=100)
#     email = models.CharField(max_length=100)
#     score = models.IntegerField()

class Letters(models.Model):
    id = models.AutoField(primary_key=True)
    letter = models.CharField(max_length=5, unique=True)

    class Meta:
        db_table = "letters"

    def __str__(self):
        return self.letter

class Example(models.Model):
    letter = models.ForeignKey(Letters, on_delete=models.CASCADE, related_name="examples")
    example = models.CharField(max_length=255)
    translation = models.CharField(max_length=255)

    class Meta:
        db_table = "letters_example"

    def __str__(self):
        return f"{self.example_text} - {self.translation}"


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
    
class Sentence(models.Model):
    sentence = models.CharField(max_length=255)
    english_version = models.CharField(max_length=255)
    sentence_translation = models.CharField(max_length=255)

    class Meta:
        db_table = "sentences"

    def __str__(self):
        return self.sentence
    
class UserProgress(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    completed_letters = models.ManyToManyField(Letters, blank=True)
    completed_words = models.ManyToManyField(Word, blank=True)
    completed_sentences = models.ManyToManyField(Sentence, blank=True)

    class Meta:
        db_table = "user_progress"

    def __str__(self):
        return f"{self.user.username}'s Progress"
    

class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")

    def __str__(self):
        return self.title
