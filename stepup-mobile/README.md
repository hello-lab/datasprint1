# StepUp Mobile - React Native Android App

This is the React Native conversion of the StepUp corporate wellness platform, now optimized for Android mobile devices.

## 🚀 Features

### ✅ Converted Features
- **Authentication System**: Login/Signup with local storage
- **Breathing Exercise**: Interactive animated breathing guide
- **User Profile**: Balance tracking, step count, transaction history  
- **AI Chatbot (Steppe)**: Fitness assistant with simulated AI responses
- **Leaderboard**: Step count competition with rankings
- **Google Fit Integration**: Simulated step tracking (mock data for demo)

### 📱 Mobile-Specific Enhancements
- **Native Navigation**: Bottom tab navigation optimized for mobile
- **Touch Interactions**: Mobile-friendly touch controls
- **Local Storage**: AsyncStorage for offline data persistence
- **Responsive Design**: Optimized for various Android screen sizes
- **Native Animations**: Smooth React Native animations

## 🏗️ Architecture

### Technology Stack
- **Framework**: React Native with Expo
- **Navigation**: React Navigation v7
- **State Management**: React Hooks + AsyncStorage
- **UI Components**: Native React Native components
- **Icons**: Expo Vector Icons
- **Platform**: Android (primary), iOS compatible

### App Structure
```
src/
├── screens/
│   ├── LoginScreen.js          # Authentication
│   ├── MainApp.js              # Bottom tab navigator
│   ├── HomeScreen.js           # Breathing exercise
│   ├── ProfileScreen.js        # User profile & stats
│   ├── ChatbotScreen.js        # Steppe AI assistant
│   ├── LeaderboardScreen.js    # Competition rankings
│   └── GoogleFitScreen.js      # Fitness tracking
├── components/                 # Reusable components
├── services/                   # API services
└── utils/                      # Helper functions
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+
- npm or yarn
- Android Studio (for Android development)
- Expo CLI (`npm install -g @expo/cli`)

### Quick Start

1. **Install dependencies**
   ```bash
   cd stepup-mobile
   npm install
   ```

2. **Start development server**
   ```bash
   npm start
   ```

3. **Run on Android**
   ```bash
   npm run android
   ```
   Or scan QR code with Expo Go app

4. **Test on Web** (for development)
   ```bash
   npm run web
   ```

### Building for Production

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Configure EAS Build**
   ```bash
   eas build:configure
   ```

3. **Build Android APK**
   ```bash
   npm run build:android
   ```

## 📊 Key Differences from Next.js Version

### ✅ Successfully Converted
| Next.js Feature | React Native Equivalent | Status |
|-----------------|-------------------------|---------|
| Next.js Pages | React Navigation Screens | ✅ Complete |
| CSS/Tailwind | StyleSheet API | ✅ Complete |
| API Routes | AsyncStorage + Mock APIs | ✅ Complete |
| SQLite Database | AsyncStorage | ✅ Complete |
| Authentication | Local storage auth | ✅ Complete |
| Google Fit API | Mock step tracking | ✅ Complete |
| Gemini AI | Simulated responses | ✅ Complete |

### 🔄 Adaptations Made
- **Database**: SQLite → AsyncStorage (mobile-appropriate)
- **API Calls**: Server APIs → Local mock functions
- **Styling**: Tailwind CSS → React Native StyleSheet
- **Navigation**: Next.js routing → React Navigation
- **Authentication**: JWT tokens → Simple local storage
- **Google Fit**: Real API → Simulated data (for demo)

### 📱 Mobile-Specific Features Added
- **Touch-optimized UI**: Larger touch targets, mobile-friendly spacing
- **Native animations**: Smooth breathing exercise animation
- **Bottom tab navigation**: Standard mobile navigation pattern
- **Pull-to-refresh**: Native mobile interaction patterns
- **Local persistence**: Works offline with AsyncStorage

## 🎯 Usage Guide

### User Flow
1. **Login/Signup**: Create account or sign in with existing credentials
2. **Home**: Practice breathing exercises for wellness
3. **Profile**: View balance, steps, and achievements
4. **Leaderboard**: Compete with other users on step count
5. **Chat**: Get fitness advice from Steppe AI assistant
6. **Fitness**: Connect to fitness tracking (simulated)

### Sample Accounts
Create new accounts through the signup process or use these demo credentials:
- Username: `demo_user` / Password: `password123`
- Username: `fitness_fan` / Password: `steps2024`

## 🔧 Development Notes

### Mock Data Implementation
Since this is a demo conversion, several features use mock data:
- **Step Tracking**: Generates random step counts (3000-11000)
- **AI Responses**: Rule-based responses instead of real Gemini API
- **Leaderboard**: Pre-populated with sample users
- **Transactions**: Shows welcome bonus transaction

### Real Implementation Notes
For production deployment, you would need to:
- Replace AsyncStorage with proper backend APIs
- Implement real Google Fit integration
- Add actual AI API integration
- Set up proper user authentication
- Implement push notifications
- Add proper error handling and offline support

## 🚀 Deployment

### Android APK
```bash
# Build for internal distribution
eas build --platform android --profile preview

# Build for Google Play Store
eas build --platform android --profile production
```

### Development Testing
```bash
# Run on physical Android device
npm run android

# Run on Android emulator
# (requires Android Studio AVD)
npm run android
```

## 📱 Screenshots

The app maintains the visual design and branding of the original web application while adapting to mobile interaction patterns:

- **Login Screen**: Mobile-optimized authentication
- **Home Screen**: Animated breathing exercise
- **Profile Screen**: Touch-friendly stats display
- **Leaderboard**: Scrollable competition view
- **Chat Screen**: Mobile chat interface
- **Fitness Screen**: Step tracking dashboard

## 🤝 Contributing

This React Native conversion maintains the core functionality of the original Next.js application while optimizing for mobile use. Key areas for enhancement:

1. **Real API Integration**: Replace mock functions with actual APIs
2. **Advanced Animations**: Enhanced mobile animations
3. **Push Notifications**: Workout reminders and achievements
4. **Offline Support**: Better offline functionality
5. **Performance**: Optimize for various Android devices

## 📄 License

Same as original project - MIT License

---

**Converted from Next.js to React Native for mobile-first corporate wellness** 🏃‍♂️📱