# NourishNet - Tiffin Logistics SaaS Mobile App

A comprehensive React Native Expo mobile application for the NourishNet tiffin service platform, designed to digitize and optimize local tiffin service operations.

## 🚀 Features

### Authentication & User Management
- Secure login/register with email and password
- Forgot password functionality
- User profile management
- Secure token storage using Expo SecureStore

### Subscription Management
- Flexible subscription plans (Daily, Weekly, Monthly)
- Pause/Resume subscription functionality
- Subscription history tracking
- Plan comparison and selection

### Menu & Meal Management
- Dynamic daily/weekly menu display
- Meal categorization (Breakfast, Lunch, Dinner, Snacks)
- Detailed meal information with nutritional data
- Meal customization options
- Dietary restrictions and allergen information

### Live Delivery Tracking
- Real-time delivery tracking with maps
- Delivery timeline and status updates
- ETA calculations and distance tracking
- Delivery history

### User Interface
- Modern, intuitive design
- Responsive layout for all screen sizes
- Smooth animations and transitions
- Dark/Light theme support ready

## 🛠 Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **State Management**: React Context API
- **UI Components**: React Native Paper
- **Maps**: React Native Maps
- **Storage**: Expo SecureStore
- **HTTP Client**: Axios
- **Real-time**: Socket.IO (ready for integration)

## 📱 Screens

### Authentication Screens
- Login Screen
- Register Screen
- Forgot Password Screen

### Main Screens
- Home Dashboard
- Menu Browser
- Menu Detail
- Subscription Management
- Live Delivery Tracking
- User Profile
- Settings
- Notifications
- Payment
- Address Management

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
│   ├── auth/          # Authentication screens
│   ├── main/          # Main app screens
│   └── common/        # Common screens (loading, etc.)
├── navigation/         # Navigation configuration
├── services/          # API services
├── context/           # React Context providers
├── types/             # TypeScript type definitions
├── utils/             # Utility functions and constants
└── assets/            # Images, fonts, etc.
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NourishNet
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   ```bash
   # For Android
   npm run android
   
   # For iOS
   npm run ios
   
   # For web
   npm run web
   ```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
API_BASE_URL=https://api.nourishnet.com/v1
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
FIREBASE_API_KEY=your_firebase_api_key
```

### API Integration
The app is designed to work with a REST API. Update the `API_BASE_URL` in `src/utils/constants.ts` to point to your backend server.

## 📦 Key Dependencies

- `@react-navigation/native` - Navigation
- `react-native-paper` - UI components
- `react-native-maps` - Maps integration
- `expo-secure-store` - Secure storage
- `axios` - HTTP client
- `socket.io-client` - Real-time communication
- `expo-location` - Location services
- `expo-notifications` - Push notifications

## 🎨 Design System

The app follows a consistent design system with:
- **Primary Color**: Green (#2E7D32)
- **Secondary Color**: Orange (#FF6F00)
- **Typography**: System fonts with consistent sizing
- **Spacing**: 8px base unit
- **Border Radius**: Consistent rounded corners
- **Shadows**: Subtle elevation for cards

## 🔐 Security Features

- Secure token storage
- Input validation
- API request authentication
- Error handling and logging

## 📱 Platform Support

- iOS 11.0+
- Android API 21+
- Web (limited functionality)

## 🚧 Development Status

### ✅ Completed
- Project setup and configuration
- Authentication system
- Navigation structure
- Core screens implementation
- UI/UX design
- TypeScript integration

### 🚧 In Progress
- Payment gateway integration
- Push notifications
- Real-time delivery tracking
- Backend API integration

### 📋 Planned
- Offline support
- Advanced analytics
- Social features
- Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@nourishnet.com or join our Slack channel.

## 🙏 Acknowledgments

- React Native community
- Expo team
- All contributors and testers

---

**NourishNet** - Your Daily Meal Companion 🍽️