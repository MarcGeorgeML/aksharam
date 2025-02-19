from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from rest_framework.decorators import api_view

# Create your views here.


def testhtml(request):
    html_content = """<div style='font-size:20px; color:blue;'>Hello, World!</div>"""
    return HttpResponse(html_content)


@api_view(['GET'])
def test(request):
    return JsonResponse({"message": "Aksharam"})
