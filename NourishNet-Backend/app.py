from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import os
from datetime import timedelta

# Import blueprints
from routes.auth import auth_bp
from routes.users import users_bp
from routes.subscriptions import subscriptions_bp
from routes.menu import menu_bp
from routes.orders import orders_bp
from routes.delivery import delivery_bp
from routes.payments import payments_bp
from routes.notifications import notifications_bp

# Import database
from database.mongodb import init_db

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', '6d!OWoxktd9nfX1HdQgzjL@p4xAAs0C2')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'ZOiYb%E0mCimO7cjmC*Z$^Rcv6BvCWei6diz@tM7R52O8KvRDOzSG5yWqu#sPHK8')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
    
    # MongoDB Configuration
    app.config['MONGODB_URI'] = os.getenv('MONGODB_URI', 'mongodb+srv://ManglamX:Manglam%40529@nourishnet.bjjeltx.mongodb.net/NourishNet')
    
    # Initialize extensions
    CORS(app, origins=['*'])  # Configure for React Native
    jwt = JWTManager(app)
    bcrypt = Bcrypt(app)
    
    # Initialize database
    init_db(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    app.register_blueprint(users_bp, url_prefix='/api/v1/users')
    app.register_blueprint(subscriptions_bp, url_prefix='/api/v1/subscriptions')
    app.register_blueprint(menu_bp, url_prefix='/api/v1/menu')
    app.register_blueprint(orders_bp, url_prefix='/api/v1/orders')
    app.register_blueprint(delivery_bp, url_prefix='/api/v1/delivery')
    app.register_blueprint(payments_bp, url_prefix='/api/v1/payments')
    app.register_blueprint(notifications_bp, url_prefix='/api/v1/notifications')
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'success': False, 'message': 'Endpoint not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'success': False, 'message': 'Internal server error'}), 500
    
    # Health check endpoint
    @app.route('/api/v1/health')
    def health_check():
        return jsonify({
            'success': True,
            'message': 'NourishNet API is running',
            'version': '1.0.0'
        })
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
