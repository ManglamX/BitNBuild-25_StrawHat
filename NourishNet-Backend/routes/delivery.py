from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.delivery import Delivery
from models.user import User
from datetime import datetime

delivery_bp = Blueprint('delivery', __name__)

@delivery_bp.route('/track/<delivery_id>', methods=['GET'])
@jwt_required()
def track_delivery(delivery_id):
    """Track delivery by ID"""
    try:
        current_user_id = get_jwt_identity()
        delivery = Delivery.find_by_id(delivery_id)
        
        if not delivery:
            return jsonify({
                'success': False,
                'message': 'Delivery not found'
            }), 404
        
        # Check if delivery belongs to current user
        if delivery['userId'] != current_user_id:
            return jsonify({
                'success': False,
                'message': 'Access denied'
            }), 403
        
        return jsonify({
            'success': True,
            'data': {
                'id': str(delivery['_id']),
                'orderId': delivery['orderId'],
                'userId': delivery['userId'],
                'deliveryPersonId': delivery['deliveryPersonId'],
                'status': delivery['status'],
                'estimatedDeliveryTime': delivery['estimatedDeliveryTime'].isoformat() if delivery['estimatedDeliveryTime'] else None,
                'actualDeliveryTime': delivery['actualDeliveryTime'].isoformat() if delivery['actualDeliveryTime'] else None,
                'deliveryAddress': delivery['deliveryAddress'],
                'trackingInfo': delivery['trackingInfo'],
                'createdAt': delivery['createdAt'].isoformat(),
                'updatedAt': delivery['updatedAt'].isoformat()
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to track delivery',
            'error': str(e)
        }), 500

@delivery_bp.route('/active', methods=['GET'])
@jwt_required()
def get_active_delivery():
    """Get active delivery for current user"""
    try:
        current_user_id = get_jwt_identity()
        delivery = Delivery.find_active_delivery_by_user(current_user_id)
        
        if not delivery:
            return jsonify({
                'success': True,
                'data': None,
                'message': 'No active delivery found'
            }), 200
        
        return jsonify({
            'success': True,
            'data': {
                'id': str(delivery['_id']),
                'orderId': delivery['orderId'],
                'userId': delivery['userId'],
                'deliveryPersonId': delivery['deliveryPersonId'],
                'status': delivery['status'],
                'estimatedDeliveryTime': delivery['estimatedDeliveryTime'].isoformat() if delivery['estimatedDeliveryTime'] else None,
                'actualDeliveryTime': delivery['actualDeliveryTime'].isoformat() if delivery['actualDeliveryTime'] else None,
                'deliveryAddress': delivery['deliveryAddress'],
                'trackingInfo': delivery['trackingInfo'],
                'createdAt': delivery['createdAt'].isoformat(),
                'updatedAt': delivery['updatedAt'].isoformat()
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to get active delivery',
            'error': str(e)
        }), 500
