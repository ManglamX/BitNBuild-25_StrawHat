import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration class"""
    SECRET_KEY = os.getenv('SECRET_KEY', '6d!OWoxktd9nfX1HdQgzjL@p4xAAs0C2')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'ZOiYb%E0mCimO7cjmC*Z$^Rcv6BvCWei6diz@tM7R52O8KvRDOzSG5yWqu#sPHK8')
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb+srv://ManglamX:Manglam%40529@nourishnet.bjjeltx.mongodb.net/NourishNet')
    
    # Payment Gateway Configuration
    STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY', '')
    RAZORPAY_KEY_ID = os.getenv('RAZORPAY_KEY_ID', '')
    RAZORPAY_KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET', '')
    
    # Email Configuration
    SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    SMTP_PORT = int(os.getenv('SMTP_PORT', 587))
    SMTP_USERNAME = os.getenv('SMTP_USERNAME', '')
    SMTP_PASSWORD = os.getenv('SMTP_PASSWORD', '')

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    FLASK_ENV = 'development'

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    FLASK_ENV = 'production'

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
