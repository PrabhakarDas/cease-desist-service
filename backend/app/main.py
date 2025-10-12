from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.ocr import extract_text_from_pdf, extract_text_from_image
from app.classifier import classify_request
from app.utils import write_to_datastore, log_for_manual_review, archive_file
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
    return {"message": "Welcome to the Cease & Desist Classification API!"}

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
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

        # Perform actions based on classification
        if classification == "Cease":
            write_to_datastore(file.filename, extracted_text)
        elif classification == "Uncertain":
            log_for_manual_review(file.filename, extracted_text)
        elif classification == "Irrelevant":
            archive_file(file_location)

        # Return the classification and extracted text
        return {
            "filename": file.filename,
            "classification": classification,
            "extracted_text": extracted_text
        }

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")