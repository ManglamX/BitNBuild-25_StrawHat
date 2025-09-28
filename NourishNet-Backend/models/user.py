from datetime import datetime
from bson import ObjectId
from database.mongodb import get_collection
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

class User:
    def __init__(self, name, email, password, phone, addresses=None, preferences=None):
        self.name = name
        self.email = email
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')
        self.phone = phone
        self.addresses = addresses or []
        self.preferences = preferences or {
            'dietaryRestrictions': [],
            'spiceLevel': 'medium',
            'allergies': [],
            'mealSize': 'medium'
        }
        self.createdAt = datetime.utcnow()
        self.updatedAt = datetime.utcnow()
        self.isActive = True
        self.isEmailVerified = False

    def save(self):
        """Save user to database"""
        collection = get_collection('users')
        user_data = {
            'name': self.name,
            'email': self.email,
            'password': self.password,
            'phone': self.phone,
            'addresses': self.addresses,
            'preferences': self.preferences,
            'createdAt': self.createdAt,
            'updatedAt': self.updatedAt,
            'isActive': self.isActive,
            'isEmailVerified': self.isEmailVerified
        }
        result = collection.insert_one(user_data)
        return str(result.inserted_id)

    @staticmethod
    def find_by_email(email):
        """Find user by email"""
        collection = get_collection('users')
        return collection.find_one({'email': email, 'isActive': True})

    @staticmethod
    def find_by_id(user_id):
        """Find user by ID"""
        collection = get_collection('users')
        try:
            return collection.find_one({'_id': ObjectId(user_id), 'isActive': True})
        except:
            return None

    @staticmethod
    def find_by_phone(phone):
        """Find user by phone"""
        collection = get_collection('users')
        return collection.find_one({'phone': phone, 'isActive': True})

    @staticmethod
    def update_user(user_id, update_data):
        """Update user information"""
        collection = get_collection('users')
        update_data['updatedAt'] = datetime.utcnow()
        result = collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': update_data}
        )
        return result.modified_count > 0

    @staticmethod
    def verify_password(stored_password, provided_password):
        """Verify password"""
        return bcrypt.check_password_hash(stored_password, provided_password)

    @staticmethod
    def add_address(user_id, address_data):
        """Add address to user"""
        collection = get_collection('users')
        address_data['id'] = str(ObjectId())
        result = collection.update_one(
            {'_id': ObjectId(user_id)},
            {
                '$push': {'addresses': address_data},
                '$set': {'updatedAt': datetime.utcnow()}
            }
        )
        return result.modified_count > 0

    @staticmethod
    def update_address(user_id, address_id, address_data):
        """Update user address"""
        collection = get_collection('users')
        result = collection.update_one(
            {
                '_id': ObjectId(user_id),
                'addresses.id': address_id
            },
            {
                '$set': {
                    'addresses.$': address_data,
                    'updatedAt': datetime.utcnow()
                }
            }
        )
        return result.modified_count > 0

    @staticmethod
    def delete_address(user_id, address_id):
        """Delete user address"""
        collection = get_collection('users')
        result = collection.update_one(
            {'_id': ObjectId(user_id)},
            {
                '$pull': {'addresses': {'id': address_id}},
                '$set': {'updatedAt': datetime.utcnow()}
            }
        )
        return result.modified_count > 0

    @staticmethod
    def update_preferences(user_id, preferences):
        """Update user preferences"""
        collection = get_collection('users')
        result = collection.update_one(
            {'_id': ObjectId(user_id)},
            {
                '$set': {
                    'preferences': preferences,
                    'updatedAt': datetime.utcnow()
                }
            }
        )
        return result.modified_count > 0

    @staticmethod
    def deactivate_user(user_id):
        """Deactivate user account"""
        collection = get_collection('users')
        result = collection.update_one(
            {'_id': ObjectId(user_id)},
            {
                '$set': {
                    'isActive': False,
                    'updatedAt': datetime.utcnow()
                }
            }
        )
        return result.modified_count > 0

    def to_dict(self):
        """Convert user to dictionary (without password)"""
        return {
            'id': str(self._id) if hasattr(self, '_id') else None,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'addresses': self.addresses,
            'preferences': self.preferences,
            'createdAt': self.createdAt.isoformat(),
            'updatedAt': self.updatedAt.isoformat(),
            'isActive': self.isActive,
            'isEmailVerified': self.isEmailVerified
        }

    @staticmethod
    def from_dict(user_data):
        """Create user from dictionary"""
        user = User(
            name=user_data['name'],
            email=user_data['email'],
            password='',  # Password will be set separately
            phone=user_data['phone'],
            addresses=user_data.get('addresses', []),
            preferences=user_data.get('preferences', {})
        )
        user._id = user_data.get('_id')
        user.password = user_data.get('password', '')
        user.createdAt = user_data.get('createdAt', datetime.utcnow())
        user.updatedAt = user_data.get('updatedAt', datetime.utcnow())
        user.isActive = user_data.get('isActive', True)
        user.isEmailVerified = user_data.get('isEmailVerified', False)
        return user
