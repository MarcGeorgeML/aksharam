from transformers import pipeline

# Load IndicTrans 2.0 Model
print("Loading translator... (This may take a moment on the first run)")
translator = pipeline("translation", model="ai4bharat/indictrans2-indic-en-1B", trust_remote_code=True)

def translate_malayalam_to_english(text):
    """
    Translates Malayalam text to English using AI4Bharat's IndicTrans 2.0 model.

    Args:
        text (str): Malayalam text to translate.

    Returns:
        str: Translated English text.
    """
    try:
        # Perform translation
        result = translator(text)

        # Extract translated text
        translated_text = result[0]['translation_text']

        return translated_text
    except Exception as e:
        return f"Error: {str(e)}"

# Example Usage
if __name__ == "__main__":
    malayalam_text = "എനിക്ക് മലയാളം സംസാരിക്കാൻ കഴിയും"
    translated_text = translate_malayalam_to_english(malayalam_text)
    print("Translated Text:", translated_text)
