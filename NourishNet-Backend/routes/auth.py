from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from models.user import User
import re
from datetime import datetime

auth_bp = Blueprint('auth', __name__)

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    """Validate phone number format"""
    pattern = r'^[6-9]\d{9}$'
    return re.match(pattern, phone) is not None

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'password', 'phone']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'{field} is required'
                }), 400
        
        # Validate email format
        if not validate_email(data['email']):
            return jsonify({
                'success': False,
                'message': 'Invalid email format'
            }), 400
        
        # Validate phone format
        if not validate_phone(data['phone']):
            return jsonify({
                'success': False,
                'message': 'Invalid phone number format'
            }), 400
        
        # Validate password length
        if len(data['password']) < 8:
            return jsonify({
                'success': False,
                'message': 'Password must be at least 8 characters long'
            }), 400
        
        # Check if user already exists
        if User.find_by_email(data['email']):
            return jsonify({
                'success': False,
                'message': 'User with this email already exists'
            }), 409
        
        if User.find_by_phone(data['phone']):
            return jsonify({
                'success': False,
                'message': 'User with this phone number already exists'
            }), 409
        
        # Create new user
        user = User(
            name=data['name'],
            email=data['email'],
            password=data['password'],
            phone=data['phone']
        )
        
        user_id = user.save()
        
        # Create tokens
        access_token = create_access_token(identity=user_id)
        refresh_token = create_refresh_token(identity=user_id)
        
        # Get user data
        user_data = User.find_by_id(user_id)
        
        return jsonify({
            'success': True,
            'message': 'User registered successfully',
            'data': {
                'user': {
                    'id': str(user_data['_id']),
                    'name': user_data['name'],
                    'email': user_data['email'],
                    'phone': user_data['phone'],
                    'addresses': user_data.get('addresses', []),
                    'preferences': user_data.get('preferences', {}),
                    'createdAt': user_data['createdAt'].isoformat(),
                    'isEmailVerified': user_data.get('isEmailVerified', False)
                },
                'token': access_token,
                'refreshToken': refresh_token
            }
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Registration failed',
            'error': str(e)
        }), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('email') or not data.get('password'):
            return jsonify({
                'success': False,
                'message': 'Email and password are required'
            }), 400
        
        # Find user by email
        user = User.find_by_email(data['email'])
        if not user:
            return jsonify({
                'success': False,
                'message': 'Invalid email or password'
            }), 401
        
        # Verify password
        if not User.verify_password(user['password'], data['password']):
            return jsonify({
                'success': False,
                'message': 'Invalid email or password'
            }), 401
        
        # Check if user is active
        if not user.get('isActive', True):
            return jsonify({
                'success': False,
                'message': 'Account is deactivated'
            }), 401
        
        # Create tokens
        user_id = str(user['_id'])
        access_token = create_access_token(identity=user_id)
        refresh_token = create_refresh_token(identity=user_id)
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'data': {
                'user': {
                    'id': user_id,
                    'name': user['name'],
                    'email': user['email'],
                    'phone': user['phone'],
                    'addresses': user.get('addresses', []),
                    'preferences': user.get('preferences', {}),
                    'createdAt': user['createdAt'].isoformat(),
                    'isEmailVerified': user.get('isEmailVerified', False)
                },
                'token': access_token,
                'refreshToken': refresh_token
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Login failed',
            'error': str(e)
        }), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    try:
        current_user_id = get_jwt_identity()
        
        # Verify user still exists and is active
        user = User.find_by_id(current_user_id)
        if not user or not user.get('isActive', True):
            return jsonify({
                'success': False,
                'message': 'User not found or inactive'
            }), 401
        
        # Create new access token
        new_access_token = create_access_token(identity=current_user_id)
        
        return jsonify({
            'success': True,
            'message': 'Token refreshed successfully',
            'data': {
                'token': new_access_token
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Token refresh failed',
            'error': str(e)
        }), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout user (client-side token removal)"""
    return jsonify({
        'success': True,
        'message': 'Logout successful'
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user information"""
    try:
        current_user_id = get_jwt_identity()
        user = User.find_by_id(current_user_id)
        
        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email'],
                'phone': user['phone'],
                'addresses': user.get('addresses', []),
                'preferences': user.get('preferences', {}),
                'createdAt': user['createdAt'].isoformat(),
                'updatedAt': user['updatedAt'].isoformat(),
                'isEmailVerified': user.get('isEmailVerified', False)
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to get user information',
            'error': str(e)
        }), 500
