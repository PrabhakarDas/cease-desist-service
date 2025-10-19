import pytesseract
from pdf2image import convert_from_path
import os

def extract_text_from_pdf(pdf_path):
    """
    Extract text from a PDF file using Tesseract OCR.
    - Converts each page of the PDF to an image
    - Extracts text from the images
    """
    try:
        # Convert PDF to images
        images = convert_from_path(pdf_path)
        text = ""

        # Create a temporary directory to store images
        temp_dir = "static/temp_images"
        os.makedirs(temp_dir, exist_ok=True)

        # Extract text from each page
        for i, image in enumerate(images):
            # Save each page as an image file
            image_path = os.path.join(temp_dir, f"page_{i + 1}.png")
            image.save(image_path)

            # Extract text using Tesseract
            page_text = pytesseract.image_to_string(image_path)
            text += page_text + "\n"

        # Clean up temporary images
        for file in os.listdir(temp_dir):
            file_path = os.path.join(temp_dir, file)
            # Skip hidden files (e.g., ._page_1.png)
            if not file.startswith(".") and os.path.isfile(file_path):
                os.remove(file_path)
        os.rmdir(temp_dir)

        # Return extracted text or a fallback message
        return text.strip() if text.strip() else "No text could be extracted from the PDF."

    except Exception as e:
        raise ValueError(f"Failed to process the PDF: {str(e)}")