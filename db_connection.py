from pymongo import MongoClient
import os
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGODB_URI)
db = client["ml_project"]
train_collection = db["train_data"]
pred_collection = db["predictions"]
