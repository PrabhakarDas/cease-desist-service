from pymongo import MongoClient

# MongoDB connection string
MONGO_URI = "mongodb://localhost:27017/"

# Connect to MongoDB
client = MongoClient(MONGO_URI)

# List databases
print("Databases:", client.list_database_names())

# Switch to a specific database (e.g., cease_desist_db)
db = client["cease_desist_db"]

# List collections in the database
print("Collections:", db.list_collection_names())