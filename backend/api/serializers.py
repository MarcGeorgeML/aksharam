from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note, Letters, Example, Word, WordCategory

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user

class ExampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Example
        fields = ['id', 'example', 'translation']

class LetterSerializer(serializers.ModelSerializer):
    examples = ExampleSerializer(many=True, read_only=True)

    class Meta:
        model = Letters
        fields = ['id', 'letter', 'examples']

class WordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = ['id', 'word', 'english_version', 'word_translation']

class WordCategorySerializer(serializers.ModelSerializer):
    words = WordSerializer(many=True)  # Use the related_name='words' from the ForeignKey

    class Meta:
        model = WordCategory
        fields = ['id', 'category', 'words']


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}