# Aksharam – AI Malayalam Learning Application


## Overview

**Aksharam** is an AI-powered Malayalam learning platform developed to enhance language acquisition through immersive and interactive experiences. The system combines deep learning, OCR, translation models, and a modern web interface to make learning Malayalam intuitive and engaging.

Our platform integrates a LeNet-based handwritten character recognition model that provides real-time feedback on how well users draw Malayalam characters. It also includes pronunciation assistance, contextual vocabulary building, conversation practice, and OCR-based translation of Malayalam text from images.

## Features

### ✍️ Handwritten Characters (LeNet-based Model)
- Demonstrates how to write each Malayalam letter.
- Provides pronunciation guidance.
- Canvas for users to practice writing.
- Real-time verification using a CNN model trained on Malayalam handwritten characters.

### 📚 Learn Malayalam Vocabulary & Sentences
- Explore Malayalam words with meanings and pronunciation.
- Learn useful conversation sentences with English translations.
- Practice speaking and understanding real-life phrases.
- Content served from a local SQLite database for quick access.

### 🖼️ Smart Scan – OCR and Translation from Images
- Upload images with Malayalam text.
- Extract text using SuryaOCR.
- Translate line-by-line and full paragraphs using a custom translator model.
- Helps users understand real-world written Malayalam.

## Tech Stack

- **PyTorch** – For the LeNet-based handwritten character recognition and translator model.
- **SuryaOCR** – For Optical Character Recognition of Malayalam text.
- **OpenCV** – For preprocessing images before OCR and prediction.
- **Django** – Backend framework for model handling and database communication.
- **ReactJS** – Frontend for user interaction, learning modules, and drawing canvas.
- **SQLite** – Database for storing user data, vocabulary, and sentence modules.

---

Aksharam is a collaborative effort to make Malayalam learning accessible, intelligent, and interactive through modern AI and web technologies. Feel free to explore, learn, and contribute!
