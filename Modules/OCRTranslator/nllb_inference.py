import json
import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

# Load API Key from .env file
load_dotenv()  # Load environment variables from .env
API_KEY = os.getenv("HUGGINGFACE_API_KEY")  # Ensure your .env contains HUGGINGFACE_API_KEY

# Initialize Hugging Face Inference Client
client = InferenceClient(api_key=API_KEY)

def translate_malayalam_to_english(text):
    """
    Translates Malayalam text to English using Hugging Face's NLLB-200 model.

    Args:
        text (str): Malayalam text to translate.

    Returns:
        str: Translated English text.
    """
    try:
        # Send translation request with correct language codes
        response = client.post(
            model="facebook/nllb-200-distilled-1.3B",
            json={"inputs": text, "parameters": {"src_lang": "mal", "tgt_lang": "eng"}}
        )

        # Ensure response is in string format
        if isinstance(response, bytes):
            response = response.decode("utf-8")  # Convert bytes to string
        
        # Parse JSON response
        translation_data = json.loads(response)

        # Extract the translated text (Handling API response structure)
        if isinstance(translation_data, list) and translation_data:
            translated_text = translation_data[0].get("translation_text", "Translation not available")
        else:
            translated_text = "Translation not available"

        return translated_text
    except Exception as e:
        return f"Error: {str(e)}"

# Example Usage
if __name__ == "__main__":
    malayalam_text = "എനിക്ക് മലയാളം സംസാരിക്കാൻ കഴിയും"
    translated_text = translate_malayalam_to_english(malayalam_text)
    print("Translated Text:", translated_text)
