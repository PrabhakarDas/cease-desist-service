import pytesseract
from PIL import Image
from pdf2image import convert_from_path

def extract_text_from_pdf(pdf_path):
    try:
        # Convert PDF to images
        images = convert_from_path(pdf_path)
        text = ""

        # Extract text from each image
        for image in images:
            text += pytesseract.image_to_string(image)

        # Return extracted text or a fallback message
        return text.strip() if text.strip() else "No text could be extracted from the PDF."

    except Exception as e:
        raise ValueError(f"Failed to process the PDF: {str(e)}")

def extract_text_from_image(image_path):
    try:
        # Open the image file
        image = Image.open(image_path)

        # Extract text from the image
        text = pytesseract.image_to_string(image)

        # Return extracted text or a fallback message
        return text.strip() if text.strip() else "No text could be extracted from the image."

    except Exception as e:
        raise ValueError(f"Failed to process the image: {str(e)}")