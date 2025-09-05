# DataSprint1 - Corporate Wellness & Fitness Platform

A comprehensive Next.js-based corporate wellness platform that gamifies fitness tracking, promotes employee engagement, and provides AI-powered health assistance. The platform integrates with Google Fit, features a competitive leaderboard system, includes financial wellness tracking, and offers personalized AI coaching.

## 🌟 Overview

DataSprint1 is designed to boost corporate wellness programs by:
- **Advanced Fitness Tracking**: Multi-exercise tracking (steps, pushups, squats) with Google Fit integration
- **ML-Powered Analytics**: User clustering, personalized recommendations, and behavioral insights
- **Social Community Platform**: Corporate social networking with posts, comments, and likes
- **Gamification System**: Dynamic challenges, leaderboards, and reward mechanisms
- **Financial Wellness**: Comprehensive balance tracking and transaction management
- **AI Assistant**: "Steppe" - Google Gemini-powered fitness and wellness coach
- **Advanced Admin Tools**: Multi-database analytics and comprehensive user management
- **E-commerce Integration**: Order processing with automated transaction handling
- **External Content**: News aggregation and product catalog management
- **Security-First Design**: Multi-layer authentication with JWT and OAuth integration

## 🚀 What's New in DataSprint1

### 📊 Advanced Analytics & Machine Learning
- **K-Means User Clustering**: Automatic segmentation into 4 behavioral clusters
- **Engagement Index Scoring**: Weighted algorithm across fitness and financial metrics
- **Outlier Detection**: Z-score based anomaly identification for unusual patterns
- **Smart Recommendations**: ML-driven personalized fitness targets and challenge deadlines
- **Team Analytics**: Comprehensive team performance insights and comparisons

### 🤝 Social Community Features
- **Corporate Social Networking**: Share wellness achievements and experiences
- **Interactive Comments**: Threaded discussions on social posts
- **Like System**: Engagement mechanism with toggle functionality
- **Rich Content Support**: Text and image-based social posts

### 🏆 Enhanced Gamification
- **Multi-Metric Challenges**: Combine steps, pushups, and squats in single challenges
- **Dynamic Reward System**: Configurable win bonuses and achievement tracking
- **Daily Claim Limits**: Step-based rewards with fraud prevention
- **Smart Deadlines**: Performance-based challenge deadline assignment

### 💪 Comprehensive Fitness Tracking
- **Beyond Steps**: Dedicated pushup and squat exercise tracking
- **Team Integration**: All exercises contribute to team leaderboards
- **Historical Analysis**: Complete exercise history with trend tracking
- **Google Fit Sync**: Seamless integration with existing fitness data

### 🛒 E-commerce Capabilities
- **Order Processing**: Integrated product ordering with balance deduction
- **Product Catalog**: CSV-based product management system
- **Transaction Integration**: Automatic financial processing for orders

### 📰 Content Management
- **News Aggregation**: External news content integration
- **Content Syndication**: Fetch and relay external API data
- **Product Information**: Dynamic product catalog management

## 📚 Comprehensive Documentation

For detailed information about all features and technical implementation:

- **📋 [New Features Documentation](./docs/NEW_FEATURES_DOCUMENTATION.md)** - Complete guide to all advanced features
- **🔌 [API Architecture & Flowcharts](./docs/API_FLOWCHARTS.md)** - Comprehensive API documentation with visual flowcharts
- **🗃️ [Database Schema & Relationships](./docs/DATABASE_SCHEMA.md)** - Detailed database documentation with ER diagrams

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
- **Personal Balance Display**: Real-time financial wellness tracking (₹100,000 default)
- **Step Count Visualization**: Google Fit integration with daily progress
- **Quick Feature Access**: Navigation to all platform features
- **Real-time Updates**: Live data synchronization across all metrics

### 🏃 Advanced Fitness Tracking
- **Google Fit Integration**: Automatic step counting with 24-hour activity windows
- **Multi-Exercise Support**: Dedicated tracking for pushups, squats, and steps
- **Progress Goals**: Customizable targets with smart recommendations
- **Team Integration**: Individual and team-based performance tracking
- **Historical Data**: Comprehensive exercise history with trend analysis

### 🏆 Enhanced Leaderboard System
- **Dual Rankings**: Individual user and team-based competitions
- **Real-time Updates**: Live step count competition with automatic refresh
- **Medal System**: Gold, Silver, Bronze rankings with visual indicators
- **Performance Metrics**: Days logged, max steps, total transactions
- **Team Analytics**: Aggregated team performance with member contributions

### 🤖 Steppe AI Assistant (Advanced)
- **Google Gemini Integration**: State-of-the-art AI conversation capabilities
- **Corporate Wellness Focus**: Specialized knowledge in workplace health
- **Personalized Coaching**: AI-driven fitness and wellness recommendations
- **Natural Conversation**: Context-aware responses and follow-up questions
- **24/7 Availability**: Always-on wellness support for employees

### 💰 Financial Wellness Platform
- **Balance Management**: Comprehensive financial health tracking
- **Transaction System**: Deposit/withdrawal with detailed history
- **Admin Controls**: Administrative balance adjustments and oversight
- **Order Integration**: E-commerce functionality with automatic balance deduction
- **Fraud Prevention**: Security measures and transaction validation

### 🤝 Social Community Features
- **Wellness Posts**: Share achievements, progress, and motivation
- **Interactive Comments**: Threaded discussions on social posts
- **Like System**: Engagement mechanism with toggle functionality
- **Image Support**: Rich content sharing with photo uploads
- **Corporate Networking**: Connect with colleagues around wellness goals

### 🏆 Advanced Challenge System
- **Multi-Metric Challenges**: Combine steps, pushups, and squats
- **Dynamic Deadlines**: ML-powered deadline assignment based on user performance
- **Reward System**: Configurable win bonuses and achievement tracking
- **Daily Claims**: Step-based reward claiming with fraud prevention
- **Progress Tracking**: Real-time challenge completion monitoring

### 📊 ML-Powered Analytics
- **User Clustering**: K-means algorithm for behavioral segmentation (4 clusters)
- **Engagement Scoring**: Weighted index across all fitness metrics
- **Outlier Detection**: Z-score based anomaly identification
- **Personalized Recommendations**: Data-driven fitness targets and challenges
- **Team Analytics**: Comprehensive team performance insights
- **Behavioral Similarity**: Find users with similar fitness patterns

### 🧘 Wellness Tools
- **Breathing Exercises**: Interactive breathing animations with guided timing
- **Stress Relief Features**: Mindfulness and relaxation tools
- **Visual Guidance**: Smooth breathing circle animations
- **Progressive Sessions**: Multiple breathing exercise variations

### 🔧 Enhanced Admin Panel
- **Comprehensive Dashboard**: Multi-database user analytics aggregation
- **User Management**: View, edit, and update all user data
- **Financial Oversight**: Transaction monitoring and balance adjustments
- **Team Management**: Team-based user organization and analytics
- **Performance Metrics**: Advanced user statistics and engagement data
- **Secure Access**: Separate admin authentication with role-based controls

## 🗃️ Database Schema

### Users Table (`users.db`)
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  balance INTEGER DEFAULT 0,
  transactions TEXT,
  password TEXT,
  email TEXT DEFAULT '',
  team TEXT,
  stepcount INTEGER DEFAULT 0,
  pushup INTEGER DEFAULT 0,
  squat INTEGER DEFAULT 0
);
```

### User Steps Table (`steps.db` / `stats.db`)
```sql
CREATE TABLE user_steps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_email TEXT,
  user_name TEXT,
  steps INTEGER,
  date TEXT,
  team TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_name, date)
);
```

### Multi-Exercise Tracking (`stats.db`)
```sql
CREATE TABLE user_pushup (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_email TEXT,
  user_name TEXT,
  pushups INTEGER,
  date TEXT,
  team TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_email, date)
);

CREATE TABLE user_squat (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_email TEXT,
  user_name TEXT,
  squats INTEGER,
  date TEXT,
  team TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_email, date)
);
```

### Social Features (`social.db`)
```sql
CREATE TABLE socials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  comments TEXT, -- JSON array
  likes TEXT DEFAULT '[]', -- JSON array
  user_name TEXT,
  content TEXT,
  image_url TEXT,
  date DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Challenge System (`challenges.db`)
```sql
CREATE TABLE challenges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  type TEXT,
  name TEXT,
  steps INTEGER DEFAULT 0,
  squats INTEGER DEFAULT 0,
  pushups INTEGER DEFAULT 0,
  winbonus INTEGER DEFAULT 0,
  deadline TEXT,
  clear BOOLEAN DEFAULT 0
);
```

### Reward Claims (`claims.db`)
```sql
CREATE TABLE claims (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  claim INTEGER DEFAULT 0,
  last_claimed DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Transactions Table (`transactions.db`)
```sql
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId TEXT,
  amount INTEGER,
  type TEXT,
  date TEXT,
  remarks TEXT
);
```

### Order Management (`orders1.db`)
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  orders TEXT,
  username TEXT
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
- `POST /api/auth/login` - User login with JWT token generation
- `POST /api/auth/signup` - User registration with validation
- `POST /api/auth/profile` - Get authenticated user profile
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js OAuth handlers
- `GET /api/users` - Public user data query (sanitized)

### Fitness & Health Tracking APIs
- `GET /api/fit` - Fetch Google Fit step data with database sync
- `POST /api/stats/pushups` - Track and update pushup counts
- `POST /api/stats/squats` - Track and update squat exercises
- `GET /api/leaderboard` - Individual and team-based leaderboards

### Social & Community APIs
- `POST /api/social` - Create social wellness posts with images
- `GET /api/social` - Retrieve paginated social feed
- `POST /api/interaction/comment` - Add threaded comments to posts
- `POST /api/interaction/like` - Toggle like status on posts

### Challenge & Gamification APIs
- `POST /api/challenges` - Create multi-metric fitness challenges
- `POST /api/claimsteps` - Claim step-based daily rewards
- `POST /api/claim` - Process general challenge completions

### Transaction & E-commerce APIs
- `POST /api/transaction` - Process financial transactions (deposit/withdraw)
- `POST /api/history` - Get authenticated user transaction history
- `POST /api/order` - Process orders with integrated transaction handling

### AI & Analytics APIs
- `POST /api/gemini` - Chat with Steppe AI assistant (Google Gemini)
- `GET /api/analytics` - Advanced ML analytics with user clustering and recommendations

### Content & External Data APIs
- `POST /api/news` - Fetch and aggregate external news content
- `GET /api/product_reader` - Product catalog management from CSV

### Admin Management APIs
- `POST /api/admin/auth/login` - Admin authentication system
- `POST /api/admin/auth/logout` - Admin session termination
- `POST /api/admin/auth/setup` - Initial admin user creation
- `GET /api/admin/users` - Comprehensive user analytics dashboard
- `PUT /api/admin/users` - Update user data and balances

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
