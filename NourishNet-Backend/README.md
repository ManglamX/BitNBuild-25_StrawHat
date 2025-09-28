# NourishNet Backend API

A Flask-based REST API for the NourishNet tiffin service platform, built with MongoDB for data storage.

## 🚀 Features

### Authentication & User Management
- JWT-based authentication
- User registration and login
- Password hashing with bcrypt
- Profile management
- Address management
- User preferences

### Subscription Management
- Multiple subscription plans (Daily, Weekly, Monthly)
- Subscription lifecycle management
- Pause/Resume functionality
- Auto-renewal support
- Billing cycle management

### Menu & Meal Management
- Dynamic menu creation
- Meal categorization
- Nutritional information
- Dietary restrictions and allergens
- Search functionality

### Delivery Tracking
- Real-time delivery tracking
- Location updates
- Route optimization
- ETA calculations
- Delivery status management

### Payment Integration
- Payment gateway integration ready
- Razorpay and Stripe support
- Payment verification
- Transaction history

## 🛠 Technology Stack

- **Framework**: Flask 2.3.3
- **Database**: MongoDB with PyMongo
- **Authentication**: JWT with Flask-JWT-Extended
- **Password Hashing**: Flask-Bcrypt
- **CORS**: Flask-CORS
- **Validation**: Marshmallow
- **Environment**: python-dotenv

## 📁 Project Structure

```
NourishNet-Backend/
├── app.py                 # Main Flask application
├── config.py             # Configuration settings
├── requirements.txt      # Python dependencies
├── database/
│   ├── __init__.py
│   └── mongodb.py        # MongoDB connection and setup
├── models/
│   ├── __init__.py
│   ├── user.py          # User model
│   ├── subscription.py  # Subscription model
│   ├── menu.py          # Menu and Meal models
│   └── delivery.py      # Delivery model
└── routes/
    ├── __init__.py
    ├── auth.py          # Authentication endpoints
    ├── users.py         # User management endpoints
    ├── subscriptions.py # Subscription endpoints
    ├── menu.py          # Menu endpoints
    ├── delivery.py      # Delivery tracking endpoints
    ├── orders.py        # Order management endpoints
    ├── payments.py      # Payment endpoints
    └── notifications.py # Notification endpoints
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8 or higher
- MongoDB Atlas account or local MongoDB instance
- pip (Python package installer)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NourishNet-Backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   SECRET_KEY=your-secret-key-here
   JWT_SECRET_KEY=jwt-secret-string
   MONGODB_URI=mongodb+srv://ManglamX:Manglam@529@nourishnet.bjjeltx.mongodb.net/NourishNet
   FLASK_ENV=development
   DEBUG=True
   ```

5. **Run the application**
   ```bash
   python app.py
   ```

The API will be available at `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/profile` - Update user profile

### Subscriptions
- `GET /api/v1/subscriptions/` - Get user subscriptions
- `GET /api/v1/subscriptions/active` - Get active subscription
- `POST /api/v1/subscriptions/` - Create subscription
- `GET /api/v1/subscriptions/<id>` - Get subscription by ID
- `PUT /api/v1/subscriptions/<id>` - Update subscription
- `POST /api/v1/subscriptions/<id>/pause` - Pause subscription
- `POST /api/v1/subscriptions/<id>/resume` - Resume subscription
- `POST /api/v1/subscriptions/<id>/cancel` - Cancel subscription
- `GET /api/v1/subscriptions/plans` - Get available plans

### Menu
- `GET /api/v1/menu/daily` - Get daily menu
- `GET /api/v1/menu/weekly` - Get weekly menu
- `GET /api/v1/menu/meal/<id>` - Get meal details
- `GET /api/v1/menu/search` - Search meals
- `GET /api/v1/menu/categories` - Get meal categories
- `GET /api/v1/menu/category/<category>` - Get meals by category

### Delivery Tracking
- `GET /api/v1/delivery/track/<id>` - Track delivery
- `GET /api/v1/delivery/active` - Get active delivery
- `GET /api/v1/delivery/history` - Get delivery history
- `PUT /api/v1/delivery/<id>/location` - Update location
- `PUT /api/v1/delivery/<id>/route` - Update route
- `PUT /api/v1/delivery/<id>/eta` - Update ETA
- `PUT /api/v1/delivery/<id>/status` - Update status

### Users
- `GET /api/v1/users/addresses` - Get user addresses
- `POST /api/v1/users/addresses` - Add address
- `PUT /api/v1/users/preferences` - Update preferences

## 🔧 Configuration

### MongoDB Connection
The application uses MongoDB Atlas with the following connection string:
```
mongodb+srv://ManglamX:Manglam@529@nourishnet.bjjeltx.mongodb.net/NourishNet
```

### JWT Configuration
- Access token expires in 24 hours
- Refresh token expires in 30 days
- Tokens are stored securely in the client

### CORS Configuration
- Configured to allow requests from React Native app
- All origins allowed for development

## 📊 Database Schema

### Users Collection
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string (unique)",
  "password": "string (hashed)",
  "phone": "string (unique)",
  "addresses": [
    {
      "id": "string",
      "label": "string",
      "street": "string",
      "city": "string",
      "state": "string",
      "pincode": "string",
      "coordinates": {
        "latitude": "number",
        "longitude": "number"
      },
      "isDefault": "boolean"
    }
  ],
  "preferences": {
    "dietaryRestrictions": ["string"],
    "spiceLevel": "string",
    "allergies": ["string"],
    "mealSize": "string"
  },
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "isActive": "boolean",
  "isEmailVerified": "boolean"
}
```

### Subscriptions Collection
```json
{
  "_id": "ObjectId",
  "userId": "string",
  "planType": "string (daily/weekly/monthly)",
  "status": "string (active/paused/cancelled)",
  "startDate": "datetime",
  "endDate": "datetime",
  "price": "number",
  "currency": "string",
  "deliveryAddress": "object",
  "mealPreferences": "object",
  "nextBillingDate": "datetime",
  "autoRenew": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

## 🔐 Security Features

- **Password Hashing**: bcrypt for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Request data validation
- **CORS Protection**: Cross-origin request handling
- **Error Handling**: Comprehensive error responses

## 🚧 Development Status

### ✅ Completed
- Project setup and configuration
- MongoDB integration
- Authentication system
- User management
- Subscription management
- Menu management
- Delivery tracking
- API endpoints structure

### 🚧 In Progress
- Payment gateway integration
- Email notifications
- Real-time updates with Socket.IO
- Advanced search functionality

### 📋 Planned
- Admin dashboard
- Analytics and reporting
- Push notifications
- File upload for images
- Rate limiting
- API documentation with Swagger

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@nourishnet.com or create an issue in the repository.

---

**NourishNet Backend** - Powered by Flask & MongoDB 🚀
