from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.


def testhtml(request):
    html_content = """<div style='font-size:20px; color:blue;'>Hello, World!</div>"""
    return HttpResponse(html_content)