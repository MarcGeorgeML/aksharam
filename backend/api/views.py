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
from PIL import Image
import torch
from torchvision import transforms
from .ml_model.architecture import ConvNet

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

        # convert BGR to RGB (if needed)
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image_pil = Image.fromarray(image_rgb)


        if image_pil is None:
            return JsonResponse({"message": "Error decoding image"}, status=status.HTTP_400_BAD_REQUEST)

        raw_transform = transforms.Compose([
            transforms.Resize((32, 32)),                    
            transforms.ToTensor(),                          
        ])

        MODEL_PATH = os.path.join(os.path.dirname(__file__), "ml_model", "mal_model.pth")

        # Load the model
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        model = ConvNet().to(device)
        model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
        model.eval()

        transformed_image = raw_transform(image_pil)
        transformed_image = transformed_image.unsqueeze(0)

        # Move input to the same device as the model
        transformed_image = transformed_image.to(device)


        with torch.no_grad():
            output = model(transformed_image)
            _, predicted = torch.max(output, 1)
            print(f"Predicted class: {predicted.item()}")

        # Always return a response
        return JsonResponse({"message": "Image received and displayed successfully"}, status=status.HTTP_200_OK)

    except Exception as e:
        return JsonResponse({"message": f"Error processing image: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)