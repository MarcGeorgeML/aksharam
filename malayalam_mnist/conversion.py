import os
from PIL import Image

def convert_rgba_to_rgb(image_path, save_path):
    """Converts an RGBA image to RGB by replacing transparency with a white background."""
    png = Image.open(image_path)
    png.load()

    if png.mode == "RGBA":
        background = Image.new("RGB", png.size, (255, 255, 255))
        background.paste(png, mask=png.split()[3])  # Use alpha channel as mask
        background.save(save_path)
    else:
        png.save(save_path)  # If already RGB, save directly

def process_images(input_dir, output_dir):
    """Processes all images in input_dir and converts them to RGB in output_dir."""
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for root, dirs, files in os.walk(input_dir):
        relative_path = os.path.relpath(root, input_dir)
        target_path = os.path.join(output_dir, relative_path)
        os.makedirs(target_path, exist_ok=True)

        for file_name in files:
            input_path = os.path.join(root, file_name)
            output_path = os.path.join(target_path, file_name)

            try:
                convert_rgba_to_rgb(input_path, output_path)
                print(f"Converted: {input_path} -> {output_path}")
            except Exception as e:
                print(f"Error processing {input_path}: {e}")
