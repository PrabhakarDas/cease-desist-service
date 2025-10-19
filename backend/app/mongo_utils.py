import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB configuration
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "cease_desist_db")

# Initialize MongoDB client
client = MongoClient(MONGO_URI)
db = client[MONGO_DB_NAME]

def log_to_mongo(collection_name, data):
    """
    Log data to a MongoDB collection.
    :param collection_name: Name of the MongoDB collection.
    :param data: Dictionary containing the data to log.
    """
    try:
        collection = db[collection_name]
        print(f"Inserting into collection: {collection_name}")  # Debugging
        print(f"Data: {data}")  # Debugging
        result = collection.insert_one(data)
        print(f"Inserted document ID: {result.inserted_id}")  # Debugging
        return str(result.inserted_id)
    except Exception as e:
        print(f"Failed to log to MongoDB: {str(e)}")  # Debugging
        raise Exception(f"Failed to log to MongoDB: {str(e)}")