import json
from huggingface_hub import InferenceClient

API_KEY = "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"

# Initialize the Hugging Face Inference Client
client = InferenceClient(api_key=API_KEY)  # Replace with your actual API key

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
            json={"inputs": text, "parameters": {"src_lang": "mlt", "tgt_lang": "eng"}}
        )

        # Decode response if it's in byte format
        if isinstance(response, bytes):
            response = response.decode("utf-8")  # Convert bytes to string
        
        # Parse JSON response
        translation_data = json.loads(response)

        # Extract the translated text
        translated_text = translation_data[0].get("translation_text", "Translation not available")

        return translated_text
    except Exception as e:
        return f"Error: {str(e)}"

# Example Usage
if __name__ == "__main__":
    malayalam_text = "എനിക്ക് മലയാളം സംസാരിക്കാൻ കഴിയും"
    translated_text = translate_malayalam_to_english(malayalam_text)
    print("Translated Text:", translated_text)
