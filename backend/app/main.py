from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.ocr import extract_text_from_pdf, extract_text_from_image
from app.classifier import classify_request
import os

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Create the static directory if it doesn't exist
os.makedirs("static", exist_ok=True)

@app.get("/")
def read_root():
    """
    Root endpoint to verify the API is running.
    """
    return {"message": "Welcome to the Cease & Desist Classification API!"}

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    """
    Endpoint to handle file uploads, extract text, classify the text, and return results.
    """
    try:
        # Save the uploaded file
        file_location = f"static/{file.filename}"
        with open(file_location, "wb") as f:
            f.write(await file.read())

        # Determine file type and process accordingly
        if file.filename.lower().endswith(".pdf"):
            extracted_text = extract_text_from_pdf(file_location)
        elif file.filename.lower().endswith((".jpeg", ".jpg", ".png")):
            extracted_text = extract_text_from_image(file_location)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type. Only PDF, JPEG, JPG, and PNG files are supported.")

        # Classify the extracted text
        classification = classify_request(extracted_text)

        # Return the classification and extracted text
        return {
            "filename": file.filename,
            "classification": classification,
            "extracted_text": extracted_text,
        }

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")