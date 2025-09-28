from datetime import datetime
from bson import ObjectId
from database.mongodb import get_collection

class Delivery:
    def __init__(self, orderId, userId, deliveryPersonId, deliveryAddress, trackingInfo):
        self.orderId = orderId
        self.userId = userId
        self.deliveryPersonId = deliveryPersonId
        self.status = 'preparing'
        self.estimatedDeliveryTime = None
        self.actualDeliveryTime = None
        self.deliveryAddress = deliveryAddress
        self.trackingInfo = trackingInfo
        self.createdAt = datetime.utcnow()
        self.updatedAt = datetime.utcnow()

    def save(self):
        """Save delivery to database"""
        collection = get_collection('deliveries')
        delivery_data = {
            'orderId': self.orderId,
            'userId': self.userId,
            'deliveryPersonId': self.deliveryPersonId,
            'status': self.status,
            'estimatedDeliveryTime': self.estimatedDeliveryTime,
            'actualDeliveryTime': self.actualDeliveryTime,
            'deliveryAddress': self.deliveryAddress,
            'trackingInfo': self.trackingInfo,
            'createdAt': self.createdAt,
            'updatedAt': self.updatedAt
        }
        result = collection.insert_one(delivery_data)
        return str(result.inserted_id)

    @staticmethod
    def find_by_id(delivery_id):
        """Find delivery by ID"""
        collection = get_collection('deliveries')
        try:
            return collection.find_one({'_id': ObjectId(delivery_id)})
        except:
            return None

    @staticmethod
    def find_by_order_id(order_id):
        """Find delivery by order ID"""
        collection = get_collection('deliveries')
        return collection.find_one({'orderId': order_id})

    @staticmethod
    def find_by_user_id(user_id, limit=10):
        """Find deliveries by user ID"""
        collection = get_collection('deliveries')
        return list(collection.find({'userId': user_id}).sort('createdAt', -1).limit(limit))

    @staticmethod
    def find_active_delivery_by_user(user_id):
        """Find active delivery for user"""
        collection = get_collection('deliveries')
        return collection.find_one({
            'userId': user_id,
            'status': {'$in': ['preparing', 'out_for_delivery']}
        })

    @staticmethod
    def update_status(delivery_id, status):
        """Update delivery status"""
        collection = get_collection('deliveries')
        update_data = {
            'status': status,
            'updatedAt': datetime.utcnow()
        }
        
        if status == 'delivered':
            update_data['actualDeliveryTime'] = datetime.utcnow()
        
        result = collection.update_one(
            {'_id': ObjectId(delivery_id)},
            {'$set': update_data}
        )
        return result.modified_count > 0

    @staticmethod
    def update_tracking_info(delivery_id, tracking_info):
        """Update delivery tracking information"""
        collection = get_collection('deliveries')
        result = collection.update_one(
            {'_id': ObjectId(delivery_id)},
            {
                '$set': {
                    'trackingInfo': tracking_info,
                    'updatedAt': datetime.utcnow()
                }
            }
        )
        return result.modified_count > 0

    @staticmethod
    def update_location(delivery_id, current_location):
        """Update delivery person's current location"""
        collection = get_collection('deliveries')
        result = collection.update_one(
            {'_id': ObjectId(delivery_id)},
            {
                '$set': {
                    'trackingInfo.currentLocation': current_location,
                    'updatedAt': datetime.utcnow()
                }
            }
        )
        return result.modified_count > 0

    @staticmethod
    def update_route(delivery_id, route):
        """Update delivery route"""
        collection = get_collection('deliveries')
        result = collection.update_one(
            {'_id': ObjectId(delivery_id)},
            {
                '$set': {
                    'trackingInfo.route': route,
                    'updatedAt': datetime.utcnow()
                }
            }
        )
        return result.modified_count > 0

    @staticmethod
    def update_eta(delivery_id, eta_minutes, distance_km):
        """Update estimated time of arrival and distance"""
        collection = get_collection('deliveries')
        result = collection.update_one(
            {'_id': ObjectId(delivery_id)},
            {
                '$set': {
                    'trackingInfo.estimatedTimeRemaining': eta_minutes,
                    'trackingInfo.distanceRemaining': distance_km,
                    'updatedAt': datetime.utcnow()
                }
            }
        )
        return result.modified_count > 0

    def to_dict(self):
        """Convert delivery to dictionary"""
        return {
            'id': str(self._id) if hasattr(self, '_id') else None,
            'orderId': self.orderId,
            'userId': self.userId,
            'deliveryPersonId': self.deliveryPersonId,
            'status': self.status,
            'estimatedDeliveryTime': self.estimatedDeliveryTime.isoformat() if self.estimatedDeliveryTime else None,
            'actualDeliveryTime': self.actualDeliveryTime.isoformat() if self.actualDeliveryTime else None,
            'deliveryAddress': self.deliveryAddress,
            'trackingInfo': self.trackingInfo,
            'createdAt': self.createdAt.isoformat(),
            'updatedAt': self.updatedAt.isoformat()
        }
