from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.subscription import Subscription
from models.user import User

subscriptions_bp = Blueprint('subscriptions', __name__)

@subscriptions_bp.route('/', methods=['GET'])
@jwt_required()
def get_user_subscriptions():
    """Get all subscriptions for current user"""
    try:
        current_user_id = get_jwt_identity()
        subscriptions = Subscription.find_all_by_user_id(current_user_id)
        
        # Convert to response format
        subscription_list = []
        for sub in subscriptions:
            subscription_list.append({
                'id': str(sub['_id']),
                'planType': sub['planType'],
                'status': sub['status'],
                'startDate': sub['startDate'].isoformat(),
                'endDate': sub['endDate'].isoformat(),
                'price': sub['price'],
                'currency': sub['currency'],
                'deliveryAddress': sub['deliveryAddress'],
                'mealPreferences': sub['mealPreferences'],
                'nextBillingDate': sub['nextBillingDate'].isoformat(),
                'autoRenew': sub['autoRenew'],
                'createdAt': sub['createdAt'].isoformat(),
                'updatedAt': sub['updatedAt'].isoformat()
            })
        
        return jsonify({
            'success': True,
            'data': subscription_list
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to get subscriptions',
            'error': str(e)
        }), 500

@subscriptions_bp.route('/active', methods=['GET'])
@jwt_required()
def get_active_subscription():
    """Get active subscription for current user"""
    try:
        current_user_id = get_jwt_identity()
        subscription = Subscription.find_by_user_id(current_user_id)
        
        if not subscription:
            return jsonify({
                'success': True,
                'data': None,
                'message': 'No active subscription found'
            }), 200
        
        return jsonify({
            'success': True,
            'data': {
                'id': str(subscription['_id']),
                'planType': subscription['planType'],
                'status': subscription['status'],
                'startDate': subscription['startDate'].isoformat(),
                'endDate': subscription['endDate'].isoformat(),
                'price': subscription['price'],
                'currency': subscription['currency'],
                'deliveryAddress': subscription['deliveryAddress'],
                'mealPreferences': subscription['mealPreferences'],
                'nextBillingDate': subscription['nextBillingDate'].isoformat(),
                'autoRenew': subscription['autoRenew'],
                'createdAt': subscription['createdAt'].isoformat(),
                'updatedAt': subscription['updatedAt'].isoformat()
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to get active subscription',
            'error': str(e)
        }), 500

@subscriptions_bp.route('/plans', methods=['GET'])
def get_subscription_plans():
    """Get available subscription plans"""
    try:
        plans = {
            'daily': {
                'id': 'daily',
                'name': 'Daily Plan',
                'description': 'Order meals day by day',
                'price': 150,
                'currency': 'INR',
                'features': ['Flexible ordering', 'Daily menu selection', 'Free delivery']
            },
            'weekly': {
                'id': 'weekly',
                'name': 'Weekly Plan',
                'description': '7-day meal subscription',
                'price': 900,
                'currency': 'INR',
                'features': ['7 days of meals', '10% discount', 'Priority delivery', 'Menu customization']
            },
            'monthly': {
                'id': 'monthly',
                'name': 'Monthly Plan',
                'description': '30-day meal subscription',
                'price': 3500,
                'currency': 'INR',
                'features': ['30 days of meals', '20% discount', 'Priority delivery', 'Full menu customization', 'Free pause/resume']
            }
        }
        
        return jsonify({
            'success': True,
            'data': list(plans.values())
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to get subscription plans',
            'error': str(e)
        }), 500
