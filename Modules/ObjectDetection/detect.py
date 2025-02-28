import cv2
import numpy as np
import argparse
import os
from ultralytics import YOLO

def detect_objects(image_path="sample_image.jpg"):
    # Check if file exists
    if not os.path.isfile(image_path):
        print(f"Error: Image file not found at {image_path}")
        return
    
    # Load the YOLOv8 model
    try:
        model = YOLO("yolov8n.pt")  # Load the smallest YOLOv8 model
    except Exception as e:
        print(f"Error loading YOLOv8 model: {e}")
        print("Make sure to install ultralytics package: pip install ultralytics")
        return
    
    # Load the image
    image = cv2.imread(image_path)
    if image is None:
        print(f"Error: Could not load image from {image_path}")
        return
    
    # Run YOLOv8 inference
    results = model(image)
    
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
            class_name = model.names[class_id]
            
            # Create label with class name and confidence
            label = f"{class_name} ({confidence:.2f})"
            
            # Draw white bounding box
            cv2.rectangle(image, (x1, y1), (x2, y2), (255, 255, 255), 2)
            
            # Draw caption background
            font = cv2.FONT_HERSHEY_SIMPLEX
            text_size = cv2.getTextSize(label, font, 0.5, 2)[0]
            cv2.rectangle(image, (x1, y1 - text_size[1] - 10), (x1 + text_size[0], y1), (255, 255, 255), -1)
            
            # Draw caption text (black on white background)
            cv2.putText(image, label, (x1, y1 - 5), font, 0.5, (0, 0, 0), 2)
    
    # Create output filename
    base_name = os.path.basename(image_path)
    filename, ext = os.path.splitext(base_name)
    output_path = f"output/detected_{filename}{ext}"
    
    # Save output image
    cv2.imwrite(output_path, image)
    print(f"Detected image saved as {output_path}")
    
    # Display the image
    cv2.imshow("Object Detection", image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Detect objects in an image using YOLOv8")
    parser.add_argument("--image_path", default="sample_image.jpg", help="Path to the input image (default: sample_image.jpg)")
    args = parser.parse_args()
    
    detect_objects(args.image_path)