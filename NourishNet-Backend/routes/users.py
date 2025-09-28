from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User

users_bp = Blueprint('users', __name__)

@users_bp.route('/addresses', methods=['GET'])
@jwt_required()
def get_user_addresses():
    """Get user addresses"""
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
            'data': user.get('addresses', [])
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to get addresses',
            'error': str(e)
        }), 500

@users_bp.route('/addresses', methods=['POST'])
@jwt_required()
def add_user_address():
    """Add new address"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['label', 'street', 'city', 'state', 'pincode', 'coordinates']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'{field} is required'
                }), 400
        
        # Add address
        success = User.add_address(current_user_id, data)
        
        if not success:
            return jsonify({
                'success': False,
                'message': 'Failed to add address'
            }), 500
        
        return jsonify({
            'success': True,
            'message': 'Address added successfully'
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to add address',
            'error': str(e)
        }), 500

@users_bp.route('/preferences', methods=['PUT'])
@jwt_required()
def update_user_preferences():
    """Update user preferences"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Update preferences
        success = User.update_preferences(current_user_id, data)
        
        if not success:
            return jsonify({
                'success': False,
                'message': 'Failed to update preferences'
            }), 500
        
        return jsonify({
            'success': True,
            'message': 'Preferences updated successfully'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to update preferences',
            'error': str(e)
        }), 500
