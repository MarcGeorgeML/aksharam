from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from rest_framework.decorators import api_view
from .models import WordCategory, Word


# Create your views here.


def get_word_categories(request):
    categories = list(WordCategory.objects.values())
    return JsonResponse({"word_categories": categories})


@api_view(['GET'])
def test(request):
    return JsonResponse({"message": "Aksharam"})
