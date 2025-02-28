import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
from ai4bharat.transliteration import XlitEngine  # Transliteration Engine

# Set device (Use GPU if available)
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# Define languages
src_lang, tgt_lang = "mal_Mlym", "eng_Latn"  # Malayalam to English

# Load transliteration engine
xlit = XlitEngine("ml")  # Malayalam transliteration

# Load model and tokenizer
model_name = "ai4bharat/indictrans2-indic-en-1B"
tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)

model = AutoModelForSeq2SeqLM.from_pretrained(
    model_name,
    trust_remote_code=True,
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
).to(DEVICE)

def translate_malayalam_to_english(sentences):
    """
    Transliterates Malayalam text (optional) and translates it into English.
    
    Args:
        sentences (list): List of Malayalam sentences.
    
    Returns:
        list: Translated English sentences.
    """
    # Transliterating Malayalam to Latin Script (optional but helps in some cases)
    transliterated_sentences = [xlit.translit(sentence, "ml", "en")[0] for sentence in sentences]

    # Add language tags
    formatted_sentences = [f"{src_lang} | {sentence} | {tgt_lang}" for sentence in transliterated_sentences]

    # Tokenize inputs
    inputs = tokenizer(
        formatted_sentences,
        truncation=True,
        padding="longest",
        return_tensors="pt",
        return_attention_mask=True,
    ).to(DEVICE)

    # Generate translations
    with torch.no_grad():
        generated_tokens = model.generate(
            **inputs,
            use_cache=True,
            min_length=0,
            max_length=256,
            num_beams=5,
            num_return_sequences=1,
        )

    # Decode output
    translated_texts = tokenizer.batch_decode(
        generated_tokens.detach().cpu().tolist(),
        skip_special_tokens=True,
        clean_up_tokenization_spaces=True,
    )

    return translated_texts

# Example Malayalam Sentences
malayalam_sentences = [
    "എനിക്ക് മലയാളം സംസാരിക്കാൻ കഴിയും.",
    "ഇന്ന് കാലാവസ്ഥ നല്ലതാണ്.",
    "നിങ്ങൾ എവിടെയാണ് താമസിക്കുന്നത്?",
]

# Translate
english_translations = translate_malayalam_to_english(malayalam_sentences)

# Print results
for mal, eng in zip(malayalam_sentences, english_translations):
    print(f"Malayalam: {mal}")
    print(f"English: {eng}")
    print("-" * 40)
