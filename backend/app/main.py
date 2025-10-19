from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.ocr import extract_text_from_pdf
from app.classifier import classify_request
from app.agents import audit_agent, datastore_agent, archiving_agent, manual_review_agent, db  # Import db
from app.llm_utils import get_llm_response
from langdetect import detect, DetectorFactory
from datetime import datetime
import os
import uuid
from typing import List

# Ensure consistent language detection results
DetectorFactory.seed = 0

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Ensure the static directory exists
os.makedirs("static", exist_ok=True)

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    """
    Endpoint to handle file uploads, classify the document, and trigger agents based on the classification.
    """
    file_location = None
    try:
        # Validate file type
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Invalid file type. Only PDF files are supported.")

        # Generate a unique filename to avoid overwriting
        unique_filename = f"{uuid.uuid4()}_{file.filename}"
        file_location = f"static/{unique_filename}"

        # Save the uploaded file
        with open(file_location, "wb") as f:
            f.write(await file.read())
        print(f"File saved: {file_location}")

        # Extract text from the PDF
        extracted_text = extract_text_from_pdf(file_location)
        if not extracted_text.strip():
            raise HTTPException(status_code=400, detail="No text could be extracted from the uploaded PDF.")
        print(f"Extracted text: {extracted_text[:100]}")  # Log first 100 characters

        # Detect the language of the extracted text
        try:
            language = detect(extracted_text)
            print(f"Detected language: {language}")
        except Exception as e:
            print(f"Language detection failed: {str(e)}")
            language = "unknown"

        # Classify the extracted text
        classification = classify_request(extracted_text, language=language)
        print(f"Classification: {classification}")

        # Log the request to the audit agent
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        audit_status = audit_agent.log_request({
            "filename": file.filename,
            "classification": classification,
            "timestamp": timestamp,
            "extracted_text": extracted_text,
            "language": language,  # Include detected language in the audit log
        })

        # Trigger the appropriate agent based on the classification
        agent_status = None
        if classification == "Cease":
            agent_status = datastore_agent.write_to_datastore({
                "filename": file.filename,
                "timestamp": timestamp,
                "language": language,  # Include language in the datastore
            })
        elif classification == "Irrelevant":
            agent_status = archiving_agent.archive_to_file({
                "filename": file.filename,
                "timestamp": timestamp,
            })
        elif classification == "Uncertain":
            agent_status = manual_review_agent.present_for_review({
                "filename": file.filename,
                "timestamp": timestamp,
                "extracted_text": extracted_text,
                "language": language,  # Include language for manual review
            })
        else:
            agent_status = {"status": "No agent action required"}

        # Return the classification result and progress updates
        response = {
            "filename": file.filename,
            "classification": classification,
            "language": language,  # Include detected language in the response
            "audit_status": audit_status,
            "agent_status": agent_status,
        }
        print(f"Response sent to frontend: {response}")  # Debugging
        return response

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        print(f"Error in /upload/: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    finally:
        # Ensure the uploaded file is removed
        if file_location and os.path.exists(file_location):
            os.remove(file_location)
            print(f"File removed: {file_location}")


@app.post("/review_and_approve/")
async def review_and_approve(data: dict):
    """
    Endpoint to handle the "Review and Approve" action for uncertain classifications.
    """
    try:
        # Save the document as "approved" in the database
        if db is None:
            raise Exception("Database connection not available.")
        db["approved_documents"].insert_one(data)
        print(f"Document approved: {data}")
        return {"status": "Document approved successfully."}
    except Exception as e:
        print(f"Failed to approve document: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to approve document: {str(e)}")


@app.post("/send_for_further_evaluation/")
async def send_for_further_evaluation(data: dict):
    """
    Endpoint to handle the "Send for Further Evaluation" action for uncertain classifications.
    """
    try:
        # Log the document for further evaluation
        if db is None:
            raise Exception("Database connection not available.")
        db["further_evaluation"].insert_one(data)
        print(f"Document sent for further evaluation: {data}")
        return {"status": "Document sent for further evaluation successfully."}
    except Exception as e:
        print(f"Failed to send document for further evaluation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to send document for further evaluation: {str(e)}")


class ChatRequest(BaseModel):
    messages: list  # List of messages in the format [{"role": "user", "content": "message"}]
    language: str  # Detected language of the document (optional)

@app.post("/chat/")
async def chat_with_openai(request: ChatRequest):
    """
    Endpoint to handle chat messages and get responses from OpenAI.
    """
    try:
        print(f"Chat request received: {request.messages}, Language: {request.language}")  # Debugging

        # Include language context in the prompt
        language_context = f"The detected language of the document is '{request.language}'.\n" if request.language else ""
        prompt = f"{language_context}{request.messages[-1]['content']}"

        response = get_llm_response(
            prompt=prompt,  # Use the last user message with language context
            temperature=0.7,
            max_tokens=1000
        )
        print(f"OpenAI response: {response}")  # Debugging
        return {"response": response}
    except Exception as e:
        print(f"Error in /chat/: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get chat response: {str(e)}")
    
@app.get("/dashboard/metrics/")
async def get_dashboard_metrics():
    """
    Endpoint to fetch metrics and data for the dashboard.
    """
    try:
        # Fetch metrics from MongoDB
        if db is None:
            raise Exception("Database connection not available.")
        total_audit_logs = db["audit_logs"].count_documents({})
        total_approved_documents = db["approved_documents"].count_documents({})
        total_further_evaluation = db["further_evaluation"].count_documents({})
        total_classification_logs = db["classification_logs"].count_documents({})  # Add classification logs

        # Fetch recent documents (limit to 10 for simplicity)
        recent_audit_logs = list(db["audit_logs"].find({}, {"_id": 0}).sort("timestamp", -1).limit(10))
        recent_approved_documents = list(db["approved_documents"].find({}, {"_id": 0}).sort("timestamp", -1).limit(10))
        recent_further_evaluation = list(db["further_evaluation"].find({}, {"_id": 0}).sort("timestamp", -1).limit(10))
        recent_classification_logs = list(db["classification_logs"].find({}, {"_id": 0}).sort("timestamp", -1).limit(10))  # Add classification logs

        # Return metrics and recent data
        return {
            "metrics": {
                "total_audit_logs": total_audit_logs,
                "total_approved_documents": total_approved_documents,
                "total_further_evaluation": total_further_evaluation,
                "total_classification_logs": total_classification_logs,  # Add classification logs
            },
            "recent_data": {
                "audit_logs": recent_audit_logs,
                "approved_documents": recent_approved_documents,
                "further_evaluation": recent_further_evaluation,
                "classification_logs": recent_classification_logs,  # Add classification logs
            },
        }
    except Exception as e:
        print(f"Error fetching dashboard metrics: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch dashboard metrics: {str(e)}")
    
@app.post("/bulk_upload/")
async def bulk_upload(files: List[UploadFile] = File(...)):
    """
    Endpoint to handle bulk file uploads, classify the documents, and trigger agents based on the classification.
    """
    results = []  # Store results for all files
    for file in files:
        file_location = None
        try:
            # Validate file type
            if not file.filename.lower().endswith(".pdf"):
                results.append({
                    "filename": file.filename,
                    "error": "Invalid file type. Only PDF files are supported."
                })
                continue

            # Generate a unique filename to avoid overwriting
            unique_filename = f"{uuid.uuid4()}_{file.filename}"
            file_location = f"static/{unique_filename}"

            # Save the uploaded file
            with open(file_location, "wb") as f:
                f.write(await file.read())
            print(f"File saved: {file_location}")

            # Extract text from the PDF
            extracted_text = extract_text_from_pdf(file_location)
            if not extracted_text.strip():
                results.append({
                    "filename": file.filename,
                    "error": "No text could be extracted from the file."
                })
                continue
            print(f"Extracted text: {extracted_text[:100]}")  # Log first 100 characters

            # Detect the language of the extracted text
            try:
                language = detect(extracted_text)
                print(f"Detected language: {language}")
            except Exception as e:
                print(f"Language detection failed for {file.filename}: {str(e)}")
                language = "unknown"

            # Classify the extracted text
            classification = classify_request(extracted_text, language=language)
            print(f"Classification for {file.filename}: {classification}")

            # Log the request to the audit agent
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            audit_status = audit_agent.log_request({
                "filename": file.filename,
                "classification": classification,
                "timestamp": timestamp,
                "extracted_text": extracted_text,
                "language": language,  # Include detected language in the audit log
            })

            # Trigger the appropriate agent based on the classification
            agent_status = None
            if classification == "Cease":
                agent_status = datastore_agent.write_to_datastore({
                    "filename": file.filename,
                    "timestamp": timestamp,
                    "language": language,  # Include language in the datastore
                })
            elif classification == "Irrelevant":
                agent_status = archiving_agent.archive_to_file({
                    "filename": file.filename,
                    "timestamp": timestamp,
                })
            elif classification == "Uncertain":
                agent_status = manual_review_agent.present_for_review({
                    "filename": file.filename,
                    "timestamp": timestamp,
                    "extracted_text": extracted_text,
                    "language": language,  # Include language for manual review
                })
            else:
                agent_status = {"status": "No agent action required"}

            # Append the result for this file
            results.append({
                "filename": file.filename,
                "classification": classification,
                "language": language,
                "audit_status": audit_status,
                "agent_status": agent_status,
            })

        except Exception as e:
            print(f"Error processing {file.filename}: {str(e)}")
            results.append({
                "filename": file.filename,
                "error": str(e),
            })
        finally:
            # Ensure the uploaded file is removed
            if file_location and os.path.exists(file_location):
                os.remove(file_location)
                print(f"File removed: {file_location}")

    return {"results": results}