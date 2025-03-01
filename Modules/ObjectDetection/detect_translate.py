import cv2
import numpy as np
import argparse
import os
from ultralytics import YOLO
from transformers import pipeline
from PIL import Image, ImageDraw, ImageFont

def detect_and_translate(image_path="sample_image.jpg"):
    if not os.path.isfile(image_path):
        print(f"Error: Image file not found at {image_path}")
        return
    
    output_img_dir = "output"
    output_text_dir = os.path.join("output", "text")
    
    os.makedirs(output_img_dir, exist_ok=True)
    os.makedirs(output_text_dir, exist_ok=True)
    
    try:
        print("Loading translation model...")
        translator = pipeline("translation", model="facebook/nllb-200-distilled-1.3B")
        print("Translation model loaded successfully")
    except Exception as e:
        print(f"Error loading translation model: {e}")
        print("Make sure to install transformers package: pip install transformers sentencepiece")
        return
    
    try:
        print("Loading YOLOv8 model...")
        model = YOLO("yolov8n.pt")
        print("YOLOv8 model loaded successfully")
    except Exception as e:
        print(f"Error loading YOLOv8 model: {e}")
        print("Make sure to install ultralytics package: pip install ultralytics")
        return
    
    image_cv = cv2.imread(image_path)
    if image_cv is None:
        print(f"Error: Could not load image from {image_path}")
        return
    
    image_pil = Image.open(image_path)
    draw = ImageDraw.Draw(image_pil)
    
    # Load a font for English text - use a larger size
    try:
        # Try to find a system font
        english_font = ImageFont.truetype("arial.ttf", 64)  # Larger size
    except Exception as e:
        print(f"Warning: Could not load specified font: {e}")
        english_font = ImageFont.load_default()
        print("Using default font")
    
    # Run YOLOv8 inference
    results = model(image_cv)
    
    # List to store all translations
    translations_list = []
    
    # Process the results
    for result in results:
        boxes = result.boxes  # Boxes object for bbox outputs
        
        for box in boxes:   
            # Get bounding box coordinates (convert to int)
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            
            # Get confidence score
            confidence = float(box.conf[0])
            
            # Get class ID and name
            class_id = int(box.cls[0])
            english_name = model.names[class_id]
            
            # Translate class name to Malayalam (only for the text file)
            try:
                translation = translator(english_name, src_lang="eng_Latn", tgt_lang="mal_Mlym")
                malayalam_name = translation[0]['translation_text']
                print(f"Translated '{english_name}' to '{malayalam_name}'")
                
                # Add to translations list
                translations_list.append(f"{english_name} : {malayalam_name}")
            except Exception as e:
                print(f"Translation error for '{english_name}': {e}")
                malayalam_name = english_name  # Fallback to English if translation fails
                translations_list.append(f"{english_name} : [Translation failed]")
            
            # Create label with English name and confidence
            english_label = f"{english_name} ({confidence:.2f})"
            
            # Draw bounding box on PIL image - white with thicker line
            draw.rectangle([(x1, y1), (x2, y2)], outline="white", width=3)
            
            # Draw English caption with background
            eng_bbox = draw.textbbox((0, 0), english_label, font=english_font)
            eng_width = eng_bbox[2] - eng_bbox[0]
            eng_height = eng_bbox[3] - eng_bbox[1]
            
            # Position text at the top of the box with padding
            draw.rectangle([(x1, y1 - eng_height - 10), (x1 + eng_width, y1)], fill="white")
            draw.text((x1, y1 - eng_height - 5), english_label, fill="black", font=english_font)
    
    # Create output filenames
    base_name = os.path.basename(image_path)
    filename, ext = os.path.splitext(base_name)
    
    # Save output image
    output_image_path = os.path.join(output_img_dir, f"detected_{filename}{ext}")
    image_pil.save(output_image_path)
    print(f"Image with detections saved as {output_image_path}")
    
    # Save translations to text file
    text_file_path = os.path.join(output_text_dir, f"{filename}_translations.txt")
    with open(text_file_path, 'w', encoding='utf-8') as f:
        for item in translations_list:
            f.write(f"{item}\n")
    print(f"Translations saved to {text_file_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Detect objects and save translations to text file")
    parser.add_argument("--image_path", default="sample_image.jpg", help="Path to the input image (default: sample_image.jpg)")
    args = parser.parse_args()
    
    detect_and_translate(args.image_path)