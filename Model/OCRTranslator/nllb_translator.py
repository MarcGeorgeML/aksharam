from transformers import pipeline
import os


def translate_malayalam_to_english(text):
    """
    Translate Malayalam text to English using NLLB model.
    
    Args:
        text (str): Malayalam text to translate, can contain literal '\n' 
                   escape characters or actual newlines
        
    Returns:
        dict: Dictionary containing translations:
            - 'full': Translation of the entire text
            - Each individual line as key with its translation as value
    """
    # Load the translation pipeline
    print("Loading translator...")
    translator = pipeline("translation", model="facebook/nllb-200-distilled-600M")
    
    translations = {}
    
    if '\\n' in text:
        processed_text = text.replace('\\n', '\n')
    else:
        processed_text = text
    
    full_text_for_translation = processed_text.replace('\n', ' ')
    full_result = translator(full_text_for_translation, src_lang="mal_Mlym", tgt_lang="eng_Latn")
    translations['full'] = full_result[0]['translation_text']
    
    lines = processed_text.split('\n')
    lines = [line for line in lines if line.strip()]
    
    for i, line in enumerate(lines):
        if line.strip():  # Skip empty lines
            line_result = translator(line, src_lang="mal_Mlym", tgt_lang="eng_Latn")
            translations[line] = line_result[0]['translation_text']
    
    return translations

def display_translations(translations):
    """
    Display translation results and save them to a text file.
    
    Args:
        translations (dict): Dictionary containing translations
    """
    print("\nFull translation:")
    print(translations['full'])
    print("\nLine by line translations:")
    for key, value in translations.items():
        if key != 'full':
            print(f"Malayalam: {key}")
            print(f"English: {value}")
            print("-" * 40)

    os.makedirs('output', exist_ok=True)

    with open('output/translated_text.txt', 'w', encoding='utf-8') as file:
        # Write full translation
        file.write("FULL TRANSLATION:\n")
        file.write(translations['full'])
        file.write("\n\n")
        
        # Write line by line translations
        file.write("LINE BY LINE TRANSLATIONS:\n")
        for key, value in translations.items():
            if key != 'full':
                file.write(f"Malayalam: {key}\n")
                file.write(f"English: {value}\n")
                file.write("-" * 40 + "\n")
        
    print(f"\nTranslations saved to output/translated_text.txt")


if __name__ == "__main__":
    malayalam_text = "എനിക്ക് മലയാളം സംസാരിക്കാൻ കഴിയും\\nഇന്ന് കാലാവസ്ഥ നല്ലതാണ്\\nമലയാളം എന്റെ മാതൃഭാഷയാണ്"

    translations = translate_malayalam_to_english(malayalam_text)
    
    display_translations(translations)


# from transformers import pipeline

# def translate_malayalam_to_english(text):
#     """
#     Translate Malayalam text to English using NLLB model.
    
#     Args:
#         text (str): Malayalam text to translate
        
#     Returns:
#         str: English translation
#     """
#     # Load the translation pipeline
#     print("Loading translator...")
#     translator = pipeline("translation", model="facebook/nllb-200-distilled-600M")
    
#     # Specify source and target languages
#     result = translator(text, src_lang="mal_Mlym", tgt_lang="eng_Latn")
    
#     # Extract the translation
#     translation = result[0]['translation_text']
    
#     return translation

# # Example usage
# if __name__ == "__main__":
#     malayalam_text = "എനിക്ക് മലയാളം സംസാരിക്കാൻ കഴിയും"
    
#     english_text = translate_malayalam_to_english(malayalam_text)
    
#     print(f"Malayalam: {malayalam_text}")
#     print(f"English: {english_text}")