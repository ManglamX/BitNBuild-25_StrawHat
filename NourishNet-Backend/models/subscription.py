from datetime import datetime, timedelta
from bson import ObjectId
from database.mongodb import get_collection

class Subscription:
    def __init__(self, userId, planType, price, deliveryAddress, mealPreferences, autoRenew=True):
        self.userId = userId
        self.planType = planType  # 'daily', 'weekly', 'monthly'
        self.status = 'active'
        self.startDate = datetime.utcnow()
        self.endDate = self._calculate_end_date(planType)
        self.price = price
        self.currency = 'INR'
        self.deliveryAddress = deliveryAddress
        self.mealPreferences = mealPreferences
        self.nextBillingDate = self._calculate_next_billing_date(planType)
        self.autoRenew = autoRenew
        self.createdAt = datetime.utcnow()
        self.updatedAt = datetime.utcnow()

    def _calculate_end_date(self, plan_type):
        """Calculate subscription end date based on plan type"""
        if plan_type == 'daily':
            return datetime.utcnow() + timedelta(days=1)
        elif plan_type == 'weekly':
            return datetime.utcnow() + timedelta(weeks=1)
        elif plan_type == 'monthly':
            return datetime.utcnow() + timedelta(days=30)
        return datetime.utcnow() + timedelta(days=1)

    def _calculate_next_billing_date(self, plan_type):
        """Calculate next billing date based on plan type"""
        if plan_type == 'daily':
            return datetime.utcnow() + timedelta(days=1)
        elif plan_type == 'weekly':
            return datetime.utcnow() + timedelta(weeks=1)
        elif plan_type == 'monthly':
            return datetime.utcnow() + timedelta(days=30)
        return datetime.utcnow() + timedelta(days=1)

    def save(self):
        """Save subscription to database"""
        collection = get_collection('subscriptions')
        subscription_data = {
            'userId': self.userId,
            'planType': self.planType,
            'status': self.status,
            'startDate': self.startDate,
            'endDate': self.endDate,
            'price': self.price,
            'currency': self.currency,
            'deliveryAddress': self.deliveryAddress,
            'mealPreferences': self.mealPreferences,
            'nextBillingDate': self.nextBillingDate,
            'autoRenew': self.autoRenew,
            'createdAt': self.createdAt,
            'updatedAt': self.updatedAt
        }
        result = collection.insert_one(subscription_data)
        return str(result.inserted_id)

    @staticmethod
    def find_by_user_id(user_id):
        """Find active subscription by user ID"""
        collection = get_collection('subscriptions')
        return collection.find_one({
            'userId': user_id,
            'status': 'active'
        })

    @staticmethod
    def find_by_id(subscription_id):
        """Find subscription by ID"""
        collection = get_collection('subscriptions')
        try:
            return collection.find_one({'_id': ObjectId(subscription_id)})
        except:
            return None

    @staticmethod
    def find_all_by_user_id(user_id):
        """Find all subscriptions by user ID"""
        collection = get_collection('subscriptions')
        return list(collection.find({'userId': user_id}).sort('createdAt', -1))

    @staticmethod
    def update_status(subscription_id, status):
        """Update subscription status"""
        collection = get_collection('subscriptions')
        result = collection.update_one(
            {'_id': ObjectId(subscription_id)},
            {
                '$set': {
                    'status': status,
                    'updatedAt': datetime.utcnow()
                }
            }
        )
        return result.modified_count > 0

    @staticmethod
    def pause_subscription(subscription_id):
        """Pause subscription"""
        return Subscription.update_status(subscription_id, 'paused')

    @staticmethod
    def resume_subscription(subscription_id):
        """Resume subscription"""
        return Subscription.update_status(subscription_id, 'active')

    @staticmethod
    def cancel_subscription(subscription_id):
        """Cancel subscription"""
        return Subscription.update_status(subscription_id, 'cancelled')

    @staticmethod
    def update_subscription(subscription_id, update_data):
        """Update subscription information"""
        collection = get_collection('subscriptions')
        update_data['updatedAt'] = datetime.utcnow()
        result = collection.update_one(
            {'_id': ObjectId(subscription_id)},
            {'$set': update_data}
        )
        return result.modified_count > 0

    def to_dict(self):
        """Convert subscription to dictionary"""
        return {
            'id': str(self._id) if hasattr(self, '_id') else None,
            'userId': self.userId,
            'planType': self.planType,
            'status': self.status,
            'startDate': self.startDate.isoformat(),
            'endDate': self.endDate.isoformat(),
            'price': self.price,
            'currency': self.currency,
            'deliveryAddress': self.deliveryAddress,
            'mealPreferences': self.mealPreferences,
            'nextBillingDate': self.nextBillingDate.isoformat(),
            'autoRenew': self.autoRenew,
            'createdAt': self.createdAt.isoformat(),
            'updatedAt': self.updatedAt.isoformat()
        }
