from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from .models import WordCategory, Word
import base64
import cv2
import numpy as np
import os
from PIL import Image
import torch
from torchvision import transforms
from .ml_model.architecture import ConvNet
import pandas as pd
from django.contrib.auth.models import User
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status

# Create your views here.


csv_path = os.path.join(os.path.dirname(__file__), "ml_model", "label_2_letter.csv")
class_labels_df = pd.read_csv(csv_path)
class_mapping = dict(zip(class_labels_df["Image Name"], class_labels_df["Class Label"]))

MODEL_PATH = os.path.join(os.path.dirname(__file__), "ml_model", "mal_model.pth")

def get_word_categories(request):
    words = Word.objects.select_related('word_category').values(
        'id', 'word', 'english_version', 'word_translation', 'category_id', 'category'
    )  
    return JsonResponse({"Words": list(words)})


@api_view(['GET'])
@permission_classes([AllowAny])
def test(request):
    return JsonResponse({"message": "Aksharam"})



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def test_canvas(request):
    try:
        image_data = request.data.get("image", "")

        if not image_data.startswith("data:image/png;base64,"):
            return JsonResponse({"message": "Invalid image format"}, status=status.HTTP_400_BAD_REQUEST)
        
        print('got image')

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
            predicted_class = predicted.item()

        predicted_label = class_mapping.get(predicted_class, "Unknown")


        return JsonResponse({"predicted_label": predicted_label}, status=status.HTTP_200_OK)
        # class_label = class_label[0] if len(class_label) > 0 else "Unknown"



        # # Always return a response
        # return JsonResponse({"Prediction": class_label}, status=status.HTTP_200_OK)

    except Exception as e:
        return JsonResponse({"message": f"Error processing image: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    



@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def note_list_create(request):
    if request.method == 'GET':
        notes = Note.objects.filter(author=request.user)
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Delete a Note
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def note_delete(request, pk):
    try:
        note = Note.objects.get(pk=pk, author=request.user)
    except Note.DoesNotExist:
        return Response({'error': 'Note not found'}, status=status.HTTP_404_NOT_FOUND)

    note.delete()
    return Response({'message': 'Note deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

# Create a User
@api_view(['POST'])
@permission_classes([AllowAny])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)