from pymongo import MongoClient
from flask import current_app
import os

# Global MongoDB client
mongo_client = None
db = None

def init_db(app):
    """Initialize MongoDB connection"""
    global mongo_client, db
    
    try:
        # Get MongoDB URI from app config
        mongodb_uri = app.config.get('MONGODB_URI')
        
        if not mongodb_uri:
            raise ValueError("MONGODB_URI not found in configuration")
        
        # Create MongoDB client
        mongo_client = MongoClient(mongodb_uri)
        
        # Test connection
        mongo_client.admin.command('ping')
        
        # Get database
        db = mongo_client.NourishNet
        
        print("✅ Successfully connected to MongoDB!")
        
        # Create indexes for better performance
        create_indexes()
        
    except Exception as e:
        print(f"❌ Error connecting to MongoDB: {e}")
        raise e

def create_indexes():
    """Create database indexes for better performance"""
    try:
        # Users collection indexes
        db.users.create_index("email", unique=True)
        db.users.create_index("phone", unique=True)
        
        # Subscriptions collection indexes
        db.subscriptions.create_index("userId")
        db.subscriptions.create_index("status")
        
        # Orders collection indexes
        db.orders.create_index("userId")
        db.orders.create_index("status")
        db.orders.create_index("orderDate")
        
        # Deliveries collection indexes
        db.deliveries.create_index("orderId")
        db.deliveries.create_index("userId")
        db.deliveries.create_index("status")
        
        # Menu collection indexes
        db.menu.create_index("date")
        db.menu.create_index("vendorId")
        
        # Payments collection indexes
        db.payments.create_index("orderId")
        db.payments.create_index("userId")
        db.payments.create_index("status")
        
        print("✅ Database indexes created successfully!")
        
    except Exception as e:
        print(f"⚠️ Warning: Could not create indexes: {e}")

def get_db():
    """Get database instance"""
    if db is None:
        raise RuntimeError("Database not initialized. Call init_db() first.")
    return db

def get_collection(collection_name):
    """Get a specific collection"""
    database = get_db()
    return database[collection_name]

def close_db():
    """Close MongoDB connection"""
    global mongo_client
    if mongo_client:
        mongo_client.close()
        print("✅ MongoDB connection closed")
