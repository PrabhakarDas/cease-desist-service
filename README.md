# Cease & Desist Classification

This project is a web application that automates the classification of scanned documents into three categories:
- **Cease**: Requests to stop communication.
- **Uncertain**: Requests that require manual review.
- **Irrelevant**: Requests that are not related to "Cease."

The application uses a FastAPI backend for OCR (Optical Character Recognition) and text classification, and a React frontend for the user interface.

---

## Features

- Upload scanned PDFs or image files (e.g., `.jpg`, `.png`).
- Extract text from uploaded documents using OCR.
- Classify the extracted text into **Cease**, **Uncertain**, or **Irrelevant** categories.
- Display the extracted text and classification result on the UI.
- Handle OCR errors and variations in text for robust classification.

---

## Tech Stack

### Backend
- **FastAPI**: For handling file uploads and classification logic.
- **pytesseract**: For OCR (text extraction from images).
- **pdf2image**: For converting PDF pages to images.
- **Python**: Core programming language.

### Frontend
- **React**: For building the user interface.
- **Material-UI**: For styling and responsive design.
- **Axios**: For making HTTP requests to the backend.

---

## Getting Started

### Prerequisites

- **Node.js**: Install from [https://nodejs.org/](https://nodejs.org/).
- **Python 3.11**: Install from [https://www.python.org/](https://www.python.org/).
- **Tesseract-OCR**: Install using:
  - macOS: `brew install tesseract`
  - Ubuntu: `sudo apt-get install tesseract-ocr`
  - Windows: Download from [https://github.com/tesseract-ocr/tesseract](https://github.com/tesseract-ocr/tesseract).

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/cease-desist-classification.git
cd cease-desist-classification
