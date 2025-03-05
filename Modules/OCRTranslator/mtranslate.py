from transformers import pipeline

def translate_malayalam_to_english(text):
    """
    Translate Malayalam text to English using Google's MTranslate model.
    
    Args:
        text (str): Malayalam text to translate, can contain literal '\n' 
                   escape characters or actual newlines
        
    Returns:
        dict: Dictionary containing translations:
            - 'full': Translation of the entire text
            - Each individual line as key with its translation as value
    """
    # Load the translation pipeline with MTranslate model
    print("Loading translator... (this may take a moment on first run)")
    translator = pipeline("translation", model="VahidAlimohamadi/m-translate")
    
    # Create result dictionary
    translations = {}
    
    # Replace literal '\n' with actual newlines if present
    if '\\n' in text:
        processed_text = text.replace('\\n', '\n')
    else:
        processed_text = text
    
    # Translate the full text (with newlines replaced for translation)
    full_text_for_translation = processed_text.replace('\n', ' ')
    full_result = translator(full_text_for_translation, src_lang="ml", tgt_lang="en")
    translations['full'] = full_result[0]['translation_text']
    
    # Split the text by newlines and translate each part
    lines = processed_text.split('\n')
    # Filter out empty lines
    lines = [line for line in lines if line.strip()]
    
    # Translate each line individually
    for i, line in enumerate(lines):
        if line.strip():  # Skip empty lines
            line_result = translator(line, src_lang="ml", tgt_lang="en")
            translations[line] = line_result[0]['translation_text']
    
    return translations

def display_translations(translations):
    """
    Display translation results and save them to a text file.
    
    Args:
        translations (dict): Dictionary containing translations
    """
    # Display translations in console
    print("\nFull translation:")
    print(translations['full'])
    print("\nLine by line translations:")
    for key, value in translations.items():
        if key != 'full':
            print(f"Malayalam: {key}")
            print(f"English: {value}")
            print("-" * 40)
    
    # Save translations to a file
    import os
    
    # Create output directory if it doesn't exist
    os.makedirs('output', exist_ok=True)
    
    # Open file for writing
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

# Example usage
if __name__ == "__main__":
    malayalam_text = "എനിക്ക് മലയാളം സംസാരിക്കാൻ കഴിയും\\nഇന്ന് കാലാവസ്ഥ നല്ലതാണ്\\nമലയാളം എന്റെ മാതൃഭാഷയാണ്"
    
    translations = translate_malayalam_to_english(malayalam_text)
    
    # Display and save translations
    display_translations(translations)