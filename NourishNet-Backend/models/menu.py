from datetime import datetime
from bson import ObjectId
from database.mongodb import get_collection

class Menu:
    def __init__(self, date, vendorId, vendorName, meals):
        self.date = date
        self.vendorId = vendorId
        self.vendorName = vendorName
        self.meals = meals
        self.createdAt = datetime.utcnow()
        self.updatedAt = datetime.utcnow()

    def save(self):
        """Save menu to database"""
        collection = get_collection('menu')
        menu_data = {
            'date': self.date,
            'vendorId': self.vendorId,
            'vendorName': self.vendorName,
            'meals': self.meals,
            'createdAt': self.createdAt,
            'updatedAt': self.updatedAt
        }
        result = collection.insert_one(menu_data)
        return str(result.inserted_id)

    @staticmethod
    def find_by_date(date):
        """Find menu by date"""
        collection = get_collection('menu')
        return collection.find_one({'date': date})

    @staticmethod
    def find_by_date_range(start_date, end_date):
        """Find menus by date range"""
        collection = get_collection('menu')
        return list(collection.find({
            'date': {
                '$gte': start_date,
                '$lte': end_date
            }
        }).sort('date', 1))

    @staticmethod
    def find_meal_by_id(meal_id):
        """Find specific meal by ID"""
        collection = get_collection('menu')
        return collection.find_one({'meals.id': meal_id})

    def to_dict(self):
        """Convert menu to dictionary"""
        return {
            'id': str(self._id) if hasattr(self, '_id') else None,
            'date': self.date,
            'vendorId': self.vendorId,
            'vendorName': self.vendorName,
            'meals': self.meals,
            'createdAt': self.createdAt.isoformat(),
            'updatedAt': self.updatedAt.isoformat()
        }

class Meal:
    def __init__(self, name, description, price, category, imageUrl, ingredients, 
                 nutritionalInfo, isVegetarian, isVegan, spiceLevel, allergens):
        self.name = name
        self.description = description
        self.price = price
        self.category = category  # 'breakfast', 'lunch', 'dinner', 'snack'
        self.imageUrl = imageUrl
        self.ingredients = ingredients
        self.nutritionalInfo = nutritionalInfo
        self.isVegetarian = isVegetarian
        self.isVegan = isVegan
        self.spiceLevel = spiceLevel  # 'mild', 'medium', 'hot'
        self.allergens = allergens
        self.createdAt = datetime.utcnow()
        self.updatedAt = datetime.utcnow()

    def save(self):
        """Save meal to database"""
        collection = get_collection('meals')
        meal_data = {
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'category': self.category,
            'imageUrl': self.imageUrl,
            'ingredients': self.ingredients,
            'nutritionalInfo': self.nutritionalInfo,
            'isVegetarian': self.isVegetarian,
            'isVegan': self.isVegan,
            'spiceLevel': self.spiceLevel,
            'allergens': self.allergens,
            'createdAt': self.createdAt,
            'updatedAt': self.updatedAt
        }
        result = collection.insert_one(meal_data)
        return str(result.inserted_id)

    @staticmethod
    def find_by_id(meal_id):
        """Find meal by ID"""
        collection = get_collection('meals')
        try:
            return collection.find_one({'_id': ObjectId(meal_id)})
        except:
            return None

    @staticmethod
    def find_by_category(category):
        """Find meals by category"""
        collection = get_collection('meals')
        return list(collection.find({'category': category}))

    @staticmethod
    def search_meals(query):
        """Search meals by name or description"""
        collection = get_collection('meals')
        return list(collection.find({
            '$or': [
                {'name': {'$regex': query, '$options': 'i'}},
                {'description': {'$regex': query, '$options': 'i'}}
            ]
        }))

    def to_dict(self):
        """Convert meal to dictionary"""
        return {
            'id': str(self._id) if hasattr(self, '_id') else None,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'category': self.category,
            'imageUrl': self.imageUrl,
            'ingredients': self.ingredients,
            'nutritionalInfo': self.nutritionalInfo,
            'isVegetarian': self.isVegetarian,
            'isVegan': self.isVegan,
            'spiceLevel': self.spiceLevel,
            'allergens': self.allergens,
            'createdAt': self.createdAt.isoformat(),
            'updatedAt': self.updatedAt.isoformat()
        }
