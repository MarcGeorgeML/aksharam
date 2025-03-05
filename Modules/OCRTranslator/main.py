from nllb_translator import translate_malayalam_to_english, display_translations
from PIL import Image, ImageDraw, ImageFont
from surya.recognition import RecognitionPredictor
from surya.detection import DetectionPredictor
import os

def extract_malayalam_text(image_path):
    os.makedirs('output', exist_ok=True)

    original_image = Image.open(image_path)
    
    langs = ["ml"]
    
    recognition_predictor = RecognitionPredictor()
    detection_predictor = DetectionPredictor()
    
    predictions = recognition_predictor([original_image], [langs], detection_predictor)
    
    text_lines = predictions[0].text_lines
    
    extracted_text = "\n".join([line.text for line in text_lines])
    
    base_filename = os.path.splitext(os.path.basename(image_path))[0]
    txt_output = os.path.join('output', f'{base_filename}_ocr.txt')
    img_output = os.path.join('output', f'{base_filename}_boxed.jpg')
    
    with open(txt_output, 'w', encoding='utf-8') as f:
        f.write(extracted_text)
    
    # Draw bounding boxes on image
    draw_image = original_image.copy()
    draw = ImageDraw.Draw(draw_image)
    
    try:
        font = ImageFont.load_default()
    except Exception as e:
        print(f"Could not load default font: {e}")
        font = None
    
    # Draw boxes and text
    for line in text_lines:
        # Draw bounding box
        polygon = line.polygon
        draw.polygon([(p[0], p[1]) for p in polygon], outline='red', width=3)
        
        # Draw text near the box if font is available
        if font:
            text = line.text
            text_position = (int(polygon[0][0]), int(polygon[0][1] - 25))
            draw.text(text_position, text, fill='blue')
    
    draw_image.save(img_output)
    
    print("\nExtracted Text:\n")
    print(extracted_text)  # Print the extracted text
    print(f"\nText has been saved to {txt_output}")
    print(f"Image with bounding boxes saved to {img_output}")

    return extracted_text

def main():
    IMAGE_PATH = 'input/testimg12.jpg'
    malayalam_text = extract_malayalam_text(IMAGE_PATH)

    translated_texts = translate_malayalam_to_english(malayalam_text)

    display_translations(translated_texts)

if __name__ == "__main__":
    main()
