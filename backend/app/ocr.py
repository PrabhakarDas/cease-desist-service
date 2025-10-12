import pytesseract
from PIL import Image
from pdf2image import convert_from_path

def extract_text_from_pdf(pdf_path):
    """
    Extract text from a PDF file using Tesseract OCR.
    - Converts each page of the PDF to an image
    - Extracts text from the image
    """
    try:
        # Convert PDF to images
        images = convert_from_path(pdf_path)
        text = ""

        # Extract text from each image
        for i, image in enumerate(images):
            # Save each page as an image file
            image_path = f"static/page_{i + 1}.png"
            image.save(image_path)

            # Extract text using Tesseract
            text += pytesseract.image_to_string(image_path)

        # Return extracted text or a fallback message
        return text.strip() if text.strip() else "No text could be extracted from the PDF."

    except Exception as e:
        raise ValueError(f"Failed to process the PDF: {str(e)}")

def extract_text_from_image(image_path):
    """
    Extract text from an image file using Tesseract OCR.
    """
    try:
        # Extract text using Tesseract
        text = pytesseract.image_to_string(image_path)

        # Return extracted text or a fallback message
        return text.strip() if text.strip() else "No text could be extracted from the image."

    except Exception as e:
        raise ValueError(f"Failed to process the image: {str(e)}")