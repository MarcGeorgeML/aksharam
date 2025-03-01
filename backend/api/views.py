from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import WordCategory, Word
import base64
import cv2
import numpy as np
import os


# Create your views here.

def get_word_categories(request):
    categories = list(WordCategory.objects.values())
    return JsonResponse({"word_categories": categories})


@api_view(['GET'])
def test(request):
    return JsonResponse({"message": "Aksharam"})

@api_view(["POST"])
def test_canvas(request):
    try:
        image_data = request.data.get("image", "")

        if not image_data.startswith("data:image/png;base64,"):
            return JsonResponse({"message": "Invalid image format"}, status=status.HTTP_400_BAD_REQUEST)

        # Decode base64 image
        image_data = image_data.split(",")[1]
        image_bytes = base64.b64decode(image_data)
        image_array = np.frombuffer(image_bytes, dtype=np.uint8)
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

        if image is None:
            return JsonResponse({"message": "Error decoding image"}, status=status.HTTP_400_BAD_REQUEST)

        cv2.imshow("Received Image", image)
        cv2.waitKey(0)  
        cv2.destroyAllWindows()

        # Always return a response
        return JsonResponse({"message": "Image received and displayed successfully"}, status=status.HTTP_200_OK)

    except Exception as e:
        return JsonResponse({"message": f"Error processing image: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)