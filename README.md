# DataSprint1 - Corporate Wellness & Fitness Platform

A comprehensive Next.js-based corporate wellness platform that gamifies fitness tracking, promotes employee engagement, and provides AI-powered health assistance. The platform integrates with Google Fit, features a competitive leaderboard system, includes financial wellness tracking, and offers personalized AI coaching.

## 🌟 Overview

DataSprint1 is designed to boost corporate wellness programs by:
- **Fitness Tracking**: Integration with Google Fit for automatic step counting
- **Gamification**: Competitive leaderboards and achievement systems
- **Financial Wellness**: Balance tracking and transaction management
- **AI Assistant**: "Steppe" - an AI-powered fitness and wellness coach
- **Admin Management**: Comprehensive admin panel for user oversight
- **Wellness Tools**: Breathing exercises and mindfulness features

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with custom components
- **Authentication**: NextAuth.js with Google OAuth + Custom JWT
- **Database**: SQLite with Better SQLite3
- **AI Integration**: Google Gemini AI for chatbot
- **Fitness API**: Google Fit API integration
- **Deployment**: Configurable for Vercel or custom hosting

### Key Components
```
├── 🏠 Landing Page (Authentication)
├── 📱 Main App
│   ├── 🏡 Home Dashboard
│   ├── 👤 User Profile
│   ├── 🏃 Google Fit Integration
│   ├── 🏆 Leaderboard
│   ├── 🤖 Steppe AI Assistant
│   └── 🧘 Breathing Exercises
├── 🔧 Admin Panel
│   ├── 🔐 Admin Authentication
│   ├── 📊 User Management
│   └── 📈 Analytics Dashboard
└── 🔌 API Layer
    ├── 🔐 Authentication APIs
    ├── 💳 Transaction APIs
    ├── 🏃 Fitness Data APIs
    ├── 🤖 AI Chat APIs
    └── 👨‍💼 Admin APIs
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Cloud Console account (for Google Fit integration)
- Google API key for Gemini AI

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hello-lab/datasprint1.git
   cd datasprint1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Application Secrets
   SECRET_KEY=your_strong_secret_key_here
   NEXTAUTH_SECRET=your_nextauth_secret_here
   NEXTAUTH_URL=http://localhost:3003

   # Google OAuth (for Google Fit)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # Google AI (for Steppe chatbot)
   GOOGLE_API_KEY=your_google_api_key

   # Admin Setup
   ADMIN_SECRET_KEY=your_admin_secret_key_here
   ADMIN_SETUP_KEY=your_admin_setup_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3003`

5. **Set up admin user (optional)**
   ```bash
   node setup-admin.js
   ```

## 📚 Complete Setup Guide

### Google Fit Integration Setup

1. **Create Google Cloud Project**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the Google Fitness API

2. **Configure OAuth 2.0**
   - Go to "APIs & Services" > "Credentials"
   - Create OAuth 2.0 Client IDs
   - Set authorized redirect URIs:
     - Development: `http://localhost:3003/api/auth/callback/google`
     - Production: `https://yourdomain.com/api/auth/callback/google`

3. **API Scopes Required**
   - `https://www.googleapis.com/auth/fitness.activity.read`

### Google Gemini AI Setup

1. **Get API Key**
   - Visit [Google AI Studio](https://aistudio.google.com/)
   - Generate an API key for Gemini
   - Add to `GOOGLE_API_KEY` environment variable

### Admin Panel Setup

Refer to [ADMIN_SETUP.md](./ADMIN_SETUP.md) for detailed admin configuration.

## 📖 Features Documentation

### 🏠 User Dashboard
- Personal balance display
- Step count visualization
- Quick access to all features
- Real-time data updates

### 🏃 Fitness Tracking
- **Google Fit Integration**: Automatic step counting
- **24-hour Activity**: View last 24 hours of activity
- **Progress Goals**: Track towards 10,000 steps goal
- **Leaderboard Integration**: Steps contribute to ranking

### 🏆 Leaderboard System
- **Real-time Rankings**: Live step count competition
- **Medal System**: Gold, Silver, Bronze rankings
- **User Stats**: Days logged, total transactions
- **Gamification**: Encourages friendly competition

### 🤖 Steppe AI Assistant
- **Personalized Coaching**: AI-powered fitness advice
- **Corporate Focus**: Tailored for workplace wellness
- **Natural Conversation**: Gemini AI integration
- **Fitness Expertise**: Specialized in health and wellness

### 💰 Financial Wellness
- **Balance Tracking**: Monitor financial health
- **Transaction History**: Detailed transaction logs
- **Admin Controls**: Administrative balance adjustments

### 🧘 Wellness Tools
- **Breathing Exercises**: Guided breathing animations
- **Stress Relief**: Mindfulness features
- **Visual Guidance**: Interactive breathing circles

### 🔧 Admin Panel
- **User Management**: View and edit user data
- **Analytics**: Comprehensive user statistics
- **Secure Access**: Separate admin authentication
- **Data Controls**: Balance and step count adjustments

## 🗃️ Database Schema

### Users Table (`users.db`)
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  balance INTEGER DEFAULT 0,
  transactions TEXT,
  password TEXT,
  stepcount INTEGER DEFAULT 0
);
```

### User Steps Table (`steps.db`)
```sql
CREATE TABLE user_steps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_email TEXT,
  user_name TEXT,
  steps INTEGER,
  date TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_email, date)
);
```

### Transactions Table (`transactions.db`)
```sql
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER,
  amount INTEGER,
  type TEXT,
  date TEXT,
  remarks TEXT
);
```

### Admin Users Table (`admin.db`)
```sql
CREATE TABLE admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);
```

## 🔌 API Reference

### Authentication APIs
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/profile` - Get user profile
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js handlers

### Fitness APIs
- `GET /api/fit` - Fetch Google Fit step data
- `GET /api/leaderboard` - Get leaderboard data

### Transaction APIs
- `POST /api/transaction` - Create transaction
- `POST /api/history` - Get transaction history

### AI APIs
- `POST /api/gemini` - Chat with Steppe AI assistant

### Admin APIs
- `POST /api/admin/auth/login` - Admin login
- `POST /api/admin/auth/logout` - Admin logout
- `POST /api/admin/auth/setup` - Create first admin
- `GET /api/admin/users` - Get all users (admin)
- `PUT /api/admin/users` - Update user data (admin)

## 🚀 Deployment

### Environment Setup
1. Set production environment variables
2. Configure Google OAuth for production domain
3. Set up SSL certificates
4. Configure database persistence

### Vercel Deployment
```bash
npm run build
# Deploy to Vercel
vercel --prod
```

### Custom Server Deployment
```bash
npm run build
npm start
```
Application runs on port 3003 by default.

## 🔧 Development Workflow

### Running Tests
```bash
npm run lint
```

### Building for Production
```bash
npm run build
```

### Development Mode
```bash
npm run dev
```

### Database Management
SQLite databases are created automatically on first run:
- `users.db` - User accounts and balances
- `steps.db` - Google Fit step data
- `transactions.db` - Financial transactions
- `admin.db` - Admin user accounts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use Tailwind CSS for styling
- Follow React best practices
- Implement proper error handling
- Add appropriate loading states

### 📱 Feature Documentation with Screenshots
Added comprehensive documentation for all major features with visual examples:

**Landing Page - Authentication Interface**
![Landing Page](https://github.com/user-attachments/assets/7ef08773-31d5-40a0-aeeb-82fd00393b3e)
*Beautiful glassmorphism design with StepUp branding and user authentication*

**Home Dashboard - Breathing Exercise**
![Home Dashboard](https://github.com/user-attachments/assets/a400b8a4-f70e-4318-9c91-3910f2f82860)
*Interactive breathing exercise with clean navigation and wellness focus*

**User Profile - Balance & Activity Tracking**
![User Profile](https://github.com/user-attachments/assets/fdcc709f-7dff-4f93-bd15-6f6526a8d5ac)
*Personal dashboard showing balance (₹100,000), step count, and transaction history*

**Steppe AI Assistant - Corporate Fitness Coach**
![Steppe Chatbot](https://github.com/user-attachments/assets/7a16ead5-575a-46e5-aea8-e96cf08b75ae)
*AI-powered fitness assistant specialized for corporate wellness programs*

**Leaderboard - Gamified Competition**
![Leaderboard](https://github.com/user-attachments/assets/fcaf592d-7adf-4b7d-947f-cfaa5e9b116d)
*Step count competition with Google Fit integration and medal rankings*

**Google Fit Integration - Health Data Sync**
![Google Fit Integration](https://github.com/user-attachments/assets/a400b8a4-f70e-4318-9c91-3910f2f82860)
*Seamless integration with Google Fit for automatic step tracking*


## 🔍 Troubleshooting

### Common Issues

**Google Fit not working:**
- Verify OAuth 2.0 credentials
- Check redirect URIs match exactly
- Ensure Fitness API is enabled
- Confirm environment variables are set

**Admin panel access denied:**
- Run admin setup script: `node setup-admin.js`
- Check admin environment variables
- Verify admin database permissions

**Database errors:**
- Ensure write permissions in project directory
- Check SQLite installation
- Verify database file integrity

**AI chatbot not responding:**
- Verify `GOOGLE_API_KEY` is set correctly
- Check Gemini API quota limits
- Ensure network connectivity

### Performance Tips
- Implement proper caching strategies
- Optimize database queries
- Use Next.js Image optimization
- Implement proper loading states

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team for the excellent framework
- Google for Fit API and Gemini AI
- Corporate wellness best practices
- Open source community contributors

---

**Built with ❤️ for corporate wellness and employee engagement**
