# 🏗️ System Architecture & Visual Diagrams

This document provides comprehensive visual representations of the DataSprint1 system architecture, user flows, and technical implementation.

## 🌐 Complete System Architecture Overview

```mermaid
graph TB
    %% User Interface Layer
    subgraph "🖥️ Frontend Layer"
        LANDING[Landing Page<br/>Authentication UI]
        DASHBOARD[Main Dashboard<br/>React Components]
        ADMIN_UI[Admin Panel<br/>Management Interface]
    end
    
    %% Middleware & Routing
    subgraph "⚡ Next.js Framework"
        MIDDLEWARE[API Middleware<br/>Request Routing]
        SSR[Server-Side Rendering<br/>Static Generation]
        AUTH_MW[Authentication<br/>Middleware]
    end
    
    %% API Services Layer
    subgraph "🔌 API Services"
        AUTH_API[Authentication APIs<br/>Login/Signup/Profile]
        FITNESS_API[Fitness APIs<br/>Steps/Pushups/Squats]
        SOCIAL_API[Social APIs<br/>Posts/Comments/Likes]
        TRANSACTION_API[Transaction APIs<br/>Balance/Orders/History]
        ANALYTICS_API[Analytics APIs<br/>ML/Clustering/Insights]
        ADMIN_API[Admin APIs<br/>User Management]
        CONTENT_API[Content APIs<br/>News/Products]
    end
    
    %% External Integrations
    subgraph "🌍 External Services"
        GOOGLE_FIT[Google Fit API<br/>Step Data Sync]
        GOOGLE_OAUTH[Google OAuth<br/>Authentication]
        GEMINI_AI[Google Gemini AI<br/>Chatbot Service]
        EXTERNAL_NEWS[External News APIs<br/>Content Aggregation]
    end
    
    %% Database Layer
    subgraph "🗄️ Database Layer (SQLite)"
        USERS_DB[(Users Database<br/>accounts & profiles)]
        FITNESS_DB[(Fitness Databases<br/>steps, pushups, squats)]
        SOCIAL_DB[(Social Database<br/>posts & interactions)]
        TRANSACTION_DB[(Transaction Database<br/>financial records)]
        ADMIN_DB[(Admin Database<br/>administrative users)]
        CONTENT_DB[(Content Databases<br/>orders, claims, challenges)]
    end
    
    %% Data Processing
    subgraph "🧠 Processing Layer"
        ML_ENGINE[Machine Learning<br/>K-Means Clustering]
        ANALYTICS_ENGINE[Analytics Engine<br/>User Insights]
        RECOMMENDATION_ENGINE[Recommendation Engine<br/>Personalized Targets]
    end
    
    %% Connections
    LANDING --> MIDDLEWARE
    DASHBOARD --> MIDDLEWARE
    ADMIN_UI --> MIDDLEWARE
    
    MIDDLEWARE --> SSR
    MIDDLEWARE --> AUTH_MW
    
    AUTH_MW --> AUTH_API
    MIDDLEWARE --> FITNESS_API
    MIDDLEWARE --> SOCIAL_API
    MIDDLEWARE --> TRANSACTION_API
    MIDDLEWARE --> ANALYTICS_API
    MIDDLEWARE --> ADMIN_API
    MIDDLEWARE --> CONTENT_API
    
    FITNESS_API --> GOOGLE_FIT
    AUTH_API --> GOOGLE_OAUTH
    ANALYTICS_API --> GEMINI_AI
    CONTENT_API --> EXTERNAL_NEWS
    
    AUTH_API --> USERS_DB
    FITNESS_API --> FITNESS_DB
    SOCIAL_API --> SOCIAL_DB
    TRANSACTION_API --> TRANSACTION_DB
    ADMIN_API --> ADMIN_DB
    CONTENT_API --> CONTENT_DB
    
    ANALYTICS_API --> ML_ENGINE
    ML_ENGINE --> ANALYTICS_ENGINE
    ANALYTICS_ENGINE --> RECOMMENDATION_ENGINE
    
    %% Styling
    classDef frontend fill:#e3f2fd
    classDef framework fill:#f3e5f5
    classDef api fill:#e8f5e8
    classDef external fill:#fff3e0
    classDef database fill:#fce4ec
    classDef processing fill:#f1f8e9
    
    class LANDING,DASHBOARD,ADMIN_UI frontend
    class MIDDLEWARE,SSR,AUTH_MW framework
    class AUTH_API,FITNESS_API,SOCIAL_API,TRANSACTION_API,ANALYTICS_API,ADMIN_API,CONTENT_API api
    class GOOGLE_FIT,GOOGLE_OAUTH,GEMINI_AI,EXTERNAL_NEWS external
    class USERS_DB,FITNESS_DB,SOCIAL_DB,TRANSACTION_DB,ADMIN_DB,CONTENT_DB database
    class ML_ENGINE,ANALYTICS_ENGINE,RECOMMENDATION_ENGINE processing
```

## 👤 User Journey & Experience Flow

```mermaid
journey
    title Corporate Employee Wellness Journey
    section Authentication
      Visit Platform: 3: User
      Login/Signup: 4: User
      Google OAuth: 5: User, System
      Dashboard Access: 5: User
    section Daily Wellness
      View Dashboard: 5: User
      Check Step Count: 4: User, Google Fit
      Log Exercises: 4: User
      Join Challenges: 5: User
    section Social Engagement
      View Social Feed: 4: User
      Create Wellness Post: 5: User
      Comment & Like: 5: User, Colleagues
      Team Leaderboard: 5: User, Team
    section AI Assistance
      Chat with Steppe: 5: User, AI
      Get Recommendations: 5: User, AI
      Personalized Goals: 5: User, AI
    section Financial Wellness
      Check Balance: 4: User
      Make Transactions: 4: User
      Order Products: 4: User
      View History: 3: User
    section Analytics & Insights
      View Personal Analytics: 5: User
      Team Performance: 4: User, Team
      Progress Tracking: 5: User
```

## 🔄 Data Flow Architecture

```mermaid
flowchart LR
    %% Data Sources
    USER_INPUT[👤 User Input<br/>Manual Entry]
    GOOGLE_FIT_DATA[📱 Google Fit<br/>Automatic Sync]
    ADMIN_INPUT[👨‍💼 Admin Input<br/>Management Actions]
    EXTERNAL_DATA[🌐 External APIs<br/>News & Content]
    
    %% Processing Layers
    VALIDATION[✅ Data Validation<br/>& Sanitization]
    AUTHENTICATION[🔐 Authentication<br/>& Authorization]
    BUSINESS_LOGIC[⚙️ Business Logic<br/>Processing]
    
    %% Storage & Analytics
    DATABASE_WRITE[💾 Database<br/>Write Operations]
    ML_PROCESSING[🧠 ML Analytics<br/>Processing]
    
    %% Output Generation
    API_RESPONSE[📡 API Response<br/>Generation]
    UI_UPDATE[🖥️ UI Updates<br/>Real-time Sync]
    NOTIFICATIONS[🔔 Notifications<br/>& Alerts]
    
    %% Connections
    USER_INPUT --> VALIDATION
    GOOGLE_FIT_DATA --> VALIDATION
    ADMIN_INPUT --> AUTHENTICATION
    EXTERNAL_DATA --> VALIDATION
    
    VALIDATION --> AUTHENTICATION
    AUTHENTICATION --> BUSINESS_LOGIC
    
    BUSINESS_LOGIC --> DATABASE_WRITE
    BUSINESS_LOGIC --> ML_PROCESSING
    
    DATABASE_WRITE --> API_RESPONSE
    ML_PROCESSING --> API_RESPONSE
    
    API_RESPONSE --> UI_UPDATE
    API_RESPONSE --> NOTIFICATIONS
```

## 🏃 Fitness Tracking User Flow

```mermaid
stateDiagram-v2
    [*] --> UserAuthenticated
    UserAuthenticated --> GoogleFitSync
    UserAuthenticated --> ManualEntry
    
    GoogleFitSync --> StepDataRetrieved
    StepDataRetrieved --> DatabaseUpdate
    
    ManualEntry --> PushupEntry
    ManualEntry --> SquatEntry
    
    PushupEntry --> DatabaseUpdate
    SquatEntry --> DatabaseUpdate
    
    DatabaseUpdate --> UserProfileUpdate
    UserProfileUpdate --> LeaderboardUpdate
    
    LeaderboardUpdate --> TeamRankingUpdate
    TeamRankingUpdate --> AnalyticsProcessing
    
    AnalyticsProcessing --> PersonalizedRecommendations
    PersonalizedRecommendations --> ChallengeGeneration
    
    ChallengeGeneration --> [*]
```

## 🤖 AI Assistant Interaction Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant SteppeAI
    participant GeminiAPI
    participant UserData
    participant Analytics

    User->>Frontend: Start Chat with Steppe
    Frontend->>SteppeAI: POST /api/gemini
    
    SteppeAI->>UserData: Get User Context
    UserData->>SteppeAI: User Profile & Stats
    
    SteppeAI->>Analytics: Get User Analytics
    Analytics->>SteppeAI: Personalized Insights
    
    SteppeAI->>GeminiAPI: Enhanced Prompt + Context
    GeminiAPI->>SteppeAI: AI Response
    
    SteppeAI->>Frontend: Personalized Response
    Frontend->>User: Display AI Coaching
    
    loop Conversation
        User->>Frontend: Follow-up Question
        Frontend->>SteppeAI: Continue Chat
        SteppeAI->>GeminiAPI: Contextual Query
        GeminiAPI->>SteppeAI: Contextual Response
        SteppeAI->>Frontend: Response
        Frontend->>User: Display Response
    end
```

## 📊 Analytics & ML Processing Pipeline

```mermaid
graph TD
    %% Data Collection
    CSV_DATA[CSV User Data<br/>Analytics Source]
    DB_USERS[User Database<br/>Profile Data]
    DB_FITNESS[Fitness Databases<br/>Activity Data]
    DB_TRANSACTIONS[Transaction Database<br/>Financial Data]
    
    %% Data Preprocessing
    DATA_MERGE[Data Aggregation<br/>& Merging]
    FEATURE_ENG[Feature Engineering<br/>Vector Creation]
    NORMALIZATION[Data Normalization<br/>& Cleaning]
    
    %% Machine Learning
    KMEANS[K-Means Clustering<br/>k=4 segments]
    ENGAGEMENT[Engagement Index<br/>Weighted Scoring]
    CONSISTENCY[Activity Consistency<br/>Variance Analysis]
    OUTLIER[Outlier Detection<br/>Z-Score Analysis]
    
    %% Insight Generation
    RECOMMENDATIONS[Personalized<br/>Recommendations]
    DEADLINES[Smart Deadline<br/>Assignment]
    SIMILARITY[User Similarity<br/>Matching]
    TEAM_ANALYTICS[Team Performance<br/>Analytics]
    
    %% Output
    DASHBOARD[Analytics Dashboard<br/>Admin Panel]
    USER_INSIGHTS[User Insights<br/>Personal Dashboard]
    API_RESPONSE[API Response<br/>JSON Output]
    
    %% Flow
    CSV_DATA --> DATA_MERGE
    DB_USERS --> DATA_MERGE
    DB_FITNESS --> DATA_MERGE
    DB_TRANSACTIONS --> DATA_MERGE
    
    DATA_MERGE --> FEATURE_ENG
    FEATURE_ENG --> NORMALIZATION
    
    NORMALIZATION --> KMEANS
    NORMALIZATION --> ENGAGEMENT
    NORMALIZATION --> CONSISTENCY
    NORMALIZATION --> OUTLIER
    
    KMEANS --> RECOMMENDATIONS
    ENGAGEMENT --> DEADLINES
    CONSISTENCY --> SIMILARITY
    OUTLIER --> TEAM_ANALYTICS
    
    RECOMMENDATIONS --> DASHBOARD
    DEADLINES --> USER_INSIGHTS
    SIMILARITY --> API_RESPONSE
    TEAM_ANALYTICS --> DASHBOARD
```

## 🔐 Security & Authentication Architecture

```mermaid
graph TB
    %% Entry Points
    CLIENT[Client Application<br/>Web/Mobile]
    
    %% Authentication Layer
    subgraph "🔐 Authentication Layer"
        NEXTAUTH[NextAuth.js<br/>OAuth Handler]
        JWT_SERVICE[JWT Service<br/>Token Management]
        CUSTOM_AUTH[Custom Auth<br/>Username/Password]
        ADMIN_AUTH[Admin Auth<br/>Separate System]
    end
    
    %% External Auth
    GOOGLE_OAUTH[Google OAuth<br/>External Provider]
    
    %% Token Validation
    subgraph "✅ Validation Layer"
        TOKEN_VERIFY[Token Verification<br/>JWT Validation]
        PERMISSION_CHECK[Permission Checking<br/>Role-based Access]
        RATE_LIMITING[Rate Limiting<br/>API Protection]
    end
    
    %% Protected Resources
    subgraph "🛡️ Protected Resources"
        USER_DATA[User Data<br/>Personal Information]
        ADMIN_PANEL[Admin Panel<br/>Management Interface]
        FINANCIAL_DATA[Financial Data<br/>Transaction Records]
        FITNESS_DATA[Fitness Data<br/>Health Information]
    end
    
    %% Connections
    CLIENT --> NEXTAUTH
    CLIENT --> CUSTOM_AUTH
    CLIENT --> ADMIN_AUTH
    
    NEXTAUTH --> GOOGLE_OAUTH
    NEXTAUTH --> JWT_SERVICE
    CUSTOM_AUTH --> JWT_SERVICE
    ADMIN_AUTH --> JWT_SERVICE
    
    JWT_SERVICE --> TOKEN_VERIFY
    TOKEN_VERIFY --> PERMISSION_CHECK
    PERMISSION_CHECK --> RATE_LIMITING
    
    RATE_LIMITING --> USER_DATA
    RATE_LIMITING --> ADMIN_PANEL
    RATE_LIMITING --> FINANCIAL_DATA
    RATE_LIMITING --> FITNESS_DATA
```

## 🎯 Performance & Scalability Architecture

```mermaid
graph LR
    %% Client Layer
    CLIENT[Client Applications<br/>React Frontend]
    
    %% Caching Layer
    subgraph "⚡ Performance Layer"
        NEXT_CACHE[Next.js Caching<br/>Static Generation]
        API_CACHE[API Response Cache<br/>Frequent Queries]
        DB_OPTIMIZATION[Database Optimization<br/>Indexed Queries]
    end
    
    %% Load Balancing (Future)
    subgraph "📈 Scalability (Future)"
        LOAD_BALANCER[Load Balancer<br/>Traffic Distribution]
        API_INSTANCES[Multiple API Instances<br/>Horizontal Scaling]
        DB_REPLICAS[Database Replicas<br/>Read Scaling]
    end
    
    %% Monitoring
    subgraph "📊 Monitoring"
        PERFORMANCE_MONITOR[Performance Monitoring<br/>Response Times]
        ERROR_TRACKING[Error Tracking<br/>Issue Detection]
        ANALYTICS_MONITOR[Analytics Monitoring<br/>Usage Patterns]
    end
    
    %% Connections
    CLIENT --> NEXT_CACHE
    NEXT_CACHE --> API_CACHE
    API_CACHE --> DB_OPTIMIZATION
    
    DB_OPTIMIZATION --> LOAD_BALANCER
    LOAD_BALANCER --> API_INSTANCES
    API_INSTANCES --> DB_REPLICAS
    
    API_INSTANCES --> PERFORMANCE_MONITOR
    PERFORMANCE_MONITOR --> ERROR_TRACKING
    ERROR_TRACKING --> ANALYTICS_MONITOR
```

## 🔧 Development & Deployment Pipeline

```mermaid
gitgraph
    commit id: "Initial Setup"
    branch feature/analytics
    checkout feature/analytics
    commit id: "ML Analytics"
    commit id: "User Clustering"
    checkout main
    merge feature/analytics
    
    branch feature/social
    checkout feature/social
    commit id: "Social Posts"
    commit id: "Comments & Likes"
    checkout main
    merge feature/social
    
    branch feature/ai
    checkout feature/ai
    commit id: "Gemini Integration"
    commit id: "Personalized Chat"
    checkout main
    merge feature/ai
    
    commit id: "Production Build"
    commit id: "Documentation"
    commit id: "Deployment"
```

This comprehensive architecture documentation provides visual insights into the complete DataSprint1 system, from user interactions to data processing and security implementation.