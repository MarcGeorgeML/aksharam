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
    
    base_filename = os.path.splitext(os.path.basename(image_path))[0]
    txt_output = os.path.join('output', f'{base_filename}_ocr.txt')
    img_output = os.path.join('output', f'{base_filename}_boxed.jpg')
    
    with open(txt_output, 'w', encoding='utf-8') as f:
        for line in text_lines:
            print(line.text)
            f.write(line.text + '\n')
    
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
    
    print(f"\nText has been saved to {txt_output}")
    print(f"Image with bounding boxes saved to {img_output}")

def main():
    IMAGE_PATH = 'input/testimg2.jpg'
    extract_malayalam_text(IMAGE_PATH)

if __name__ == "__main__":
    main()