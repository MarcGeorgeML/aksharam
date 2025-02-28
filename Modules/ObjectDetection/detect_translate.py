import cv2
import numpy as np
import argparse
import os
from ultralytics import YOLO
from transformers import pipeline
from PIL import Image, ImageDraw, ImageFont

def detect_and_translate(image_path="sample_image.jpg"):
    # Check if file exists
    if not os.path.isfile(image_path):
        print(f"Error: Image file not found at {image_path}")
        return
    
    # Create output directories if they don't exist
    output_img_dir = "output"
    output_text_dir = os.path.join("output", "text")
    
    os.makedirs(output_img_dir, exist_ok=True)
    os.makedirs(output_text_dir, exist_ok=True)
    
    # Load the translation model
    try:
        print("Loading translation model...")
        translator = pipeline("translation", model="facebook/nllb-200-distilled-1.3B")
        print("Translation model loaded successfully")
    except Exception as e:
        print(f"Error loading translation model: {e}")
        print("Make sure to install transformers package: pip install transformers sentencepiece")
        return
    
    # Load the YOLOv8 model
    try:
        print("Loading YOLOv8 model...")
        model = YOLO("yolov8n.pt")
        print("YOLOv8 model loaded successfully")
    except Exception as e:
        print(f"Error loading YOLOv8 model: {e}")
        print("Make sure to install ultralytics package: pip install ultralytics")
        return
    
    # Load the image with OpenCV for detection
    image_cv = cv2.imread(image_path)
    if image_cv is None:
        print(f"Error: Could not load image from {image_path}")
        return
    
    # Load the same image with PIL for text rendering
    image_pil = Image.open(image_path)
    draw = ImageDraw.Draw(image_pil)
    
    # Try to load a font that supports Malayalam
    try:
        # Try to find a system font that supports Malayalam
        malayalam_font = ImageFont.truetype("arial.ttf", 20)  # Default fallback
        
        # On Linux, try some common Malayalam fonts
        linux_fonts = [
            "/usr/share/fonts/truetype/noto/NotoSansMalayalam-Regular.ttf",
            "/usr/share/fonts/truetype/malayalam/Karumbi.ttf",
            "/usr/share/fonts/truetype/freefont/FreeSans.ttf"
        ]
        
        # On Windows, try these fonts
        windows_fonts = [
            "C:/Windows/Fonts/nirmala.ttf",  # Contains Malayalam in Windows 10+
            "C:/Windows/Fonts/arial.ttf"
        ]
        
        # Try fonts in order
        for font_path in linux_fonts + windows_fonts:
            if os.path.exists(font_path):
                malayalam_font = ImageFont.truetype(font_path, 20)
                print(f"Using font: {font_path}")
                break
    except Exception as e:
        print(f"Warning: Could not load Malayalam font: {e}")
        print("Will use default font, which may not display Malayalam correctly")
    
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
            
            # Translate class name to Malayalam
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
            
            # Create labels in both English and Malayalam
            english_label = f"{english_name} ({confidence:.2f})"
            
            # Draw bounding box on PIL image
            draw.rectangle([(x1, y1), (x2, y2)], outline="white", width=2)
            
            # Draw English caption at the top with background
            eng_font = ImageFont.truetype("arial.ttf", 16) if os.path.exists("arial.ttf") else ImageFont.load_default()
            eng_bbox = draw.textbbox((0, 0), english_label, font=eng_font)
            eng_width = eng_bbox[2] - eng_bbox[0]
            eng_height = eng_bbox[3] - eng_bbox[1]
            
            draw.rectangle([(x1, y1 - eng_height - 10), (x1 + eng_width, y1)], fill="white")
            draw.text((x1, y1 - eng_height - 5), english_label, fill="black", font=eng_font)
            
            # Draw Malayalam caption at the bottom with background
            mal_bbox = draw.textbbox((0, 0), malayalam_name, font=malayalam_font)
            mal_width = mal_bbox[2] - mal_bbox[0]
            mal_height = mal_bbox[3] - mal_bbox[1]
            
            draw.rectangle([(x1, y2), (x1 + mal_width, y2 + mal_height + 10)], fill="white")
            draw.text((x1, y2 + 5), malayalam_name, fill="black", font=malayalam_font)
    
    # Create output filenames
    base_name = os.path.basename(image_path)
    filename, ext = os.path.splitext(base_name)
    
    # Save output image
    output_image_path = os.path.join(output_img_dir, f"detected_malayalam_{filename}{ext}")
    image_pil.save(output_image_path)
    print(f"Image with Malayalam translations saved as {output_image_path}")
    
    # Save translations to text file
    text_file_path = os.path.join(output_text_dir, f"{filename}_translations.txt")
    with open(text_file_path, 'w', encoding='utf-8') as f:
        for item in translations_list:
            f.write(f"{item}\n")
    print(f"Translations saved to {text_file_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Detect objects and translate labels to Malayalam")
    parser.add_argument("--image_path", default="sample_image.jpg", help="Path to the input image (default: sample_image.jpg)")
    args = parser.parse_args()
    
    detect_and_translate(args.image_path)