from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.menu import Menu, Meal
from datetime import datetime, timedelta

menu_bp = Blueprint('menu', __name__)

@menu_bp.route('/daily', methods=['GET'])
@jwt_required()
def get_daily_menu():
    """Get today's menu"""
    try:
        # Get date from query parameter or use today
        date_str = request.args.get('date')
        if date_str:
            try:
                date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                return jsonify({
                    'success': False,
                    'message': 'Invalid date format. Use YYYY-MM-DD'
                }), 400
        else:
            date = datetime.now().date()
        
        # Find menu for the date
        menu = Menu.find_by_date(date.isoformat())
        
        if not menu:
            return jsonify({
                'success': True,
                'data': None,
                'message': 'No menu available for this date'
            }), 200
        
        return jsonify({
            'success': True,
            'data': {
                'id': str(menu['_id']),
                'date': menu['date'],
                'vendorId': menu['vendorId'],
                'vendorName': menu['vendorName'],
                'meals': menu['meals'],
                'createdAt': menu['createdAt'].isoformat(),
                'updatedAt': menu['updatedAt'].isoformat()
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to get daily menu',
            'error': str(e)
        }), 500

@menu_bp.route('/categories', methods=['GET'])
@jwt_required()
def get_meal_categories():
    """Get available meal categories"""
    try:
        categories = [
            {
                'id': 'breakfast',
                'name': 'Breakfast',
                'icon': 'sunny-outline',
                'description': 'Morning meals to start your day'
            },
            {
                'id': 'lunch',
                'name': 'Lunch',
                'icon': 'restaurant-outline',
                'description': 'Midday meals for energy'
            },
            {
                'id': 'dinner',
                'name': 'Dinner',
                'icon': 'moon-outline',
                'description': 'Evening meals to end your day'
            },
            {
                'id': 'snack',
                'name': 'Snacks',
                'icon': 'cafe-outline',
                'description': 'Light bites and refreshments'
            }
        ]
        
        return jsonify({
            'success': True,
            'data': categories
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to get meal categories',
            'error': str(e)
        }), 500
