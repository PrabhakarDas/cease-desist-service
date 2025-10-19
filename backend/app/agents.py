from pymongo import MongoClient
from datetime import datetime

# MongoDB connection
try:
    client = MongoClient("mongodb://localhost:27017/")
    db = client["cease_desist_db"]
    print("Connected to MongoDB successfully.")
except Exception as e:
    print(f"Failed to connect to MongoDB: {str(e)}")
    db = None

class AuditAgent:
    """
    Agent responsible for logging requests for audit purposes.
    """
    def log_request(self, data):
        try:
            if db is None:  # Check if the database connection is available
                raise Exception("Database connection not available.")
            db["audit_logs"].insert_one(data)
            print(f"Audit log created: {data}")
            return {"status": "Audit log created successfully"}
        except Exception as e:
            print(f"Failed to log audit data: {str(e)}")
            return {"status": f"Failed to log audit data: {str(e)}"}

class DatastoreAgent:
    """
    Agent responsible for writing details to a datastore for 'Cease' requests.
    """
    def __init__(self, db):
        self.db = db

    def write_to_datastore(self, data):
        try:
            if self.db is None:  # Check if the database connection is available
                raise Exception("Database connection not available.")
            self.db["datastore"].insert_one(data)
            print(f"Datastore entry created: {data}")
            return {"status": "Datastore entry created successfully"}
        except Exception as e:
            print(f"Failed to write to datastore: {str(e)}")
            return {"status": f"Failed to write to datastore: {str(e)}"}

class ArchivingAgent:
    """
    Agent responsible for archiving details to a flat file for 'Irrelevant' requests.
    """
    def archive_to_file(self, data):
        try:
            with open("archive.txt", "a") as f:
                f.write(f"{data['timestamp']} - {data['filename']}\n")
            print(f"Archived to file: {data}")
            return {"status": "Archived to file successfully"}
        except Exception as e:
            print(f"Failed to archive to file: {str(e)}")
            return {"status": f"Failed to archive to file: {str(e)}"}

class ManualReviewAgent:
    """
    Agent responsible for presenting 'Uncertain' requests to a human agent.
    """
    def __init__(self, db):
        self.db = db

    def present_for_review(self, data):
        try:
            if self.db is None:  # Check if the database connection is available
                raise Exception("Database connection not available.")
            self.db["manual_review"].insert_one(data)
            print(f"Document presented for manual review: {data}")
            return {"status": "Document presented for manual review successfully"}
        except Exception as e:
            print(f"Failed to present for manual review: {str(e)}")
            return {"status": f"Failed to present for manual review: {str(e)}"}

# Instantiate agents with the shared database connection
audit_agent = AuditAgent()
datastore_agent = DatastoreAgent(db)
archiving_agent = ArchivingAgent()
manual_review_agent = ManualReviewAgent(db)