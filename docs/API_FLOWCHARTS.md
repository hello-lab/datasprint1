# 🔌 API Architecture & Flowchart Documentation

This document provides comprehensive flowcharts and architectural diagrams for all APIs in the DataSprint1 platform.

## 🏗️ Overall API Architecture

```mermaid
graph TB
    %% User Interface Layer
    UI[User Interface Layer]
    
    %% API Gateway/Middleware
    MW[Next.js API Middleware]
    
    %% Authentication Layer
    AUTH[Authentication Layer]
    JWT[JWT Verification]
    GOOGLE[Google OAuth]
    ADMIN[Admin Auth]
    
    %% Core API Services
    USER_API[User Management APIs]
    FITNESS_API[Fitness Tracking APIs]
    SOCIAL_API[Social & Community APIs]
    ADMIN_API[Admin Management APIs]
    AI_API[AI & Analytics APIs]
    TRANSACTION_API[Financial APIs]
    
    %% External Services
    GOOGLEFIT[Google Fit API]
    GEMINI[Google Gemini AI]
    EXTERNAL[External Data Sources]
    
    %% Database Layer
    USER_DB[(Users Database)]
    FITNESS_DB[(Fitness Databases)]
    SOCIAL_DB[(Social Database)]
    ADMIN_DB[(Admin Database)]
    TRANSACTION_DB[(Transaction Database)]
    ANALYTICS_DB[(Analytics Data)]
    
    %% Connections
    UI --> MW
    MW --> AUTH
    AUTH --> JWT
    AUTH --> GOOGLE
    AUTH --> ADMIN
    
    MW --> USER_API
    MW --> FITNESS_API
    MW --> SOCIAL_API
    MW --> ADMIN_API
    MW --> AI_API
    MW --> TRANSACTION_API
    
    FITNESS_API --> GOOGLEFIT
    AI_API --> GEMINI
    USER_API --> EXTERNAL
    
    USER_API --> USER_DB
    FITNESS_API --> FITNESS_DB
    SOCIAL_API --> SOCIAL_DB
    ADMIN_API --> ADMIN_DB
    TRANSACTION_API --> TRANSACTION_DB
    AI_API --> ANALYTICS_DB
```

## 🔐 Authentication Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant AuthAPI
    participant GoogleOAuth
    participant Database
    participant JWT

    User->>Frontend: Login Request
    Frontend->>AuthAPI: POST /api/auth/login
    
    alt Google OAuth Login
        AuthAPI->>GoogleOAuth: Redirect to Google
        GoogleOAuth->>User: Authentication
        User->>GoogleOAuth: Credentials
        GoogleOAuth->>AuthAPI: OAuth Token
        AuthAPI->>Database: Verify/Create User
    else Manual Login
        AuthAPI->>Database: Verify Credentials
    end
    
    Database->>AuthAPI: User Data
    AuthAPI->>JWT: Generate Token
    JWT->>AuthAPI: JWT Token
    AuthAPI->>Frontend: Authentication Success + Token
    Frontend->>User: Login Success
```

## 🏃 Fitness Tracking API Flow

```mermaid
graph TD
    %% Entry Points
    START[User Action: Track Fitness]
    
    %% Google Fit Integration
    GFIT[GET /api/fit]
    GAUTH[Google OAuth Verification]
    GAPI[Google Fit API Call]
    GPARSE[Parse Step Data]
    
    %% Manual Exercise Tracking
    PUSHUP[POST /api/stats/pushups]
    SQUAT[POST /api/stats/squats]
    
    %% Database Operations
    STEP_DB[(Step Database)]
    STATS_DB[(Stats Database)]
    USER_DB[(User Database)]
    
    %% Leaderboard Update
    LEADERBOARD[GET /api/leaderboard]
    RANKING[Calculate Rankings]
    
    %% Analytics Processing
    ANALYTICS[GET /api/analytics]
    ML[ML Processing & Clustering]
    RECOMMENDATIONS[Generate Recommendations]
    
    %% Flow Connections
    START --> GFIT
    START --> PUSHUP
    START --> SQUAT
    
    GFIT --> GAUTH
    GAUTH --> GAPI
    GAPI --> GPARSE
    GPARSE --> STEP_DB
    
    PUSHUP --> STATS_DB
    SQUAT --> STATS_DB
    
    STEP_DB --> USER_DB
    STATS_DB --> USER_DB
    
    USER_DB --> LEADERBOARD
    LEADERBOARD --> RANKING
    
    USER_DB --> ANALYTICS
    ANALYTICS --> ML
    ML --> RECOMMENDATIONS
```

## 💰 Financial Transaction Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant TransactionAPI
    participant UserDB
    participant TransactionDB
    participant OrderAPI
    participant OrderDB

    User->>Frontend: Initiate Transaction
    Frontend->>TransactionAPI: POST /api/transaction
    
    TransactionAPI->>UserDB: Get User Balance
    UserDB->>TransactionAPI: Current Balance
    
    alt Sufficient Balance (Withdrawal)
        TransactionAPI->>UserDB: Update Balance
        TransactionAPI->>TransactionDB: Record Transaction
        TransactionDB->>TransactionAPI: Success
        
        opt Order Processing
            TransactionAPI->>OrderAPI: POST /api/order
            OrderAPI->>OrderDB: Record Order
        end
        
        TransactionAPI->>Frontend: Transaction Success
    else Insufficient Balance
        TransactionAPI->>Frontend: Transaction Failed
    end
    
    Frontend->>User: Transaction Result
```

## 🤝 Social Features Architecture

```mermaid
graph TB
    %% Social Actions
    POST_CREATE[POST /api/social]
    COMMENT_ADD[POST /api/interaction/comment]
    LIKE_TOGGLE[POST /api/interaction/like]
    
    %% Database
    SOCIAL_DB[(Social Database)]
    
    %% Processing
    POST_PROCESS[Process Post Content]
    COMMENT_PROCESS[Process Comment Thread]
    LIKE_PROCESS[Toggle Like Status]
    
    %% Storage Format
    JSON_COMMENTS[JSON Comments Array]
    JSON_LIKES[JSON Likes Array]
    
    %% Retrieval
    GET_POSTS[GET /api/social]
    DISPLAY[Display Social Feed]
    
    %% Flow
    POST_CREATE --> POST_PROCESS
    POST_PROCESS --> SOCIAL_DB
    
    COMMENT_ADD --> COMMENT_PROCESS
    COMMENT_PROCESS --> JSON_COMMENTS
    JSON_COMMENTS --> SOCIAL_DB
    
    LIKE_TOGGLE --> LIKE_PROCESS
    LIKE_PROCESS --> JSON_LIKES
    JSON_LIKES --> SOCIAL_DB
    
    SOCIAL_DB --> GET_POSTS
    GET_POSTS --> DISPLAY
```

## 🏆 Challenge & Rewards System

```mermaid
flowchart TD
    %% Challenge Creation
    ADMIN[Admin Creates Challenge]
    CREATE[POST /api/challenges]
    CHALLENGE_DB[(Challenges Database)]
    
    %% User Participation
    USER[User Participates]
    TRACK[Track Progress]
    FITNESS_DATA[Fitness Data Collection]
    
    %% Completion Check
    CHECK[Check Challenge Completion]
    COMPLETE{Challenge Complete?}
    
    %% Reward Claims
    CLAIM_STEP[POST /api/claimsteps]
    DAILY_CHECK{Already Claimed Today?}
    CLAIM_DB[(Claims Database)]
    REWARD[Issue Reward]
    
    %% Flow
    ADMIN --> CREATE
    CREATE --> CHALLENGE_DB
    
    USER --> TRACK
    TRACK --> FITNESS_DATA
    FITNESS_DATA --> CHECK
    CHECK --> COMPLETE
    
    COMPLETE -->|Yes| CLAIM_STEP
    COMPLETE -->|No| TRACK
    
    CLAIM_STEP --> DAILY_CHECK
    DAILY_CHECK -->|No| CLAIM_DB
    DAILY_CHECK -->|Yes| ERROR[Claim Denied]
    CLAIM_DB --> REWARD
```

## 🤖 AI & Analytics Pipeline

```mermaid
graph TB
    %% Data Sources
    CSV[Users CSV Data]
    DB_USERS[(User Database)]
    DB_STEPS[(Steps Database)]
    DB_TRANS[(Transaction Database)]
    
    %% Analytics API
    ANALYTICS[GET /api/analytics]
    
    %% Data Processing
    PREPROCESS[Data Preprocessing]
    FEATURE_ENG[Feature Engineering]
    
    %% Machine Learning
    KMEANS[K-Means Clustering]
    ENGAGEMENT[Engagement Index Calculation]
    CONSISTENCY[Activity Consistency Scoring]
    OUTLIER[Outlier Detection]
    
    %% Recommendations
    RECOMMEND[Generate Recommendations]
    DEADLINES[Smart Deadline Assignment]
    SIMILARITY[Find Similar Users]
    
    %% AI Chat
    GEMINI_API[POST /api/gemini]
    GEMINI_AI[Google Gemini AI]
    
    %% Results
    INSIGHTS[Analytics Insights]
    CHAT_RESPONSE[AI Chat Response]
    
    %% Flow
    CSV --> ANALYTICS
    DB_USERS --> ANALYTICS
    DB_STEPS --> ANALYTICS
    DB_TRANS --> ANALYTICS
    
    ANALYTICS --> PREPROCESS
    PREPROCESS --> FEATURE_ENG
    
    FEATURE_ENG --> KMEANS
    FEATURE_ENG --> ENGAGEMENT
    FEATURE_ENG --> CONSISTENCY
    FEATURE_ENG --> OUTLIER
    
    KMEANS --> RECOMMEND
    ENGAGEMENT --> DEADLINES
    CONSISTENCY --> SIMILARITY
    
    RECOMMEND --> INSIGHTS
    DEADLINES --> INSIGHTS
    SIMILARITY --> INSIGHTS
    
    GEMINI_API --> GEMINI_AI
    GEMINI_AI --> CHAT_RESPONSE
```

## 👨‍💼 Admin Management Flow

```mermaid
sequenceDiagram
    participant Admin
    participant AdminPanel
    participant AdminAPI
    participant UserDB
    participant StepsDB
    participant TransactionDB
    participant Analytics

    Admin->>AdminPanel: Access Admin Dashboard
    AdminPanel->>AdminAPI: GET /api/admin/users
    
    par Multi-Database Query
        AdminAPI->>UserDB: Get All Users
        AdminAPI->>StepsDB: Get Steps Data
        AdminAPI->>TransactionDB: Get Transaction Data
    end
    
    UserDB->>AdminAPI: User Data
    StepsDB->>AdminAPI: Fitness Data
    TransactionDB->>AdminAPI: Financial Data
    
    AdminAPI->>Analytics: Process Combined Data
    Analytics->>AdminAPI: Enriched User Profiles
    
    AdminAPI->>AdminPanel: Comprehensive User Data
    AdminPanel->>Admin: Display Admin Dashboard
    
    opt User Modification
        Admin->>AdminPanel: Modify User Data
        AdminPanel->>AdminAPI: PUT /api/admin/users
        AdminAPI->>UserDB: Update User Data
        UserDB->>AdminAPI: Update Success
        AdminAPI->>AdminPanel: Success Response
    end
```

## 📊 Data Flow & Database Relationships

```mermaid
erDiagram
    USERS {
        int id PK
        string username UK
        int balance
        string transactions
        string password
        string email
        string team
        int stepcount
        int pushup
        int squat
    }
    
    USER_STEPS {
        int id PK
        string user_email
        string user_name FK
        int steps
        string date
        string team
        datetime created_at
    }
    
    TRANSACTIONS {
        int id PK
        int userId FK
        int amount
        string type
        string date
        string remarks
    }
    
    SOCIALS {
        int id PK
        string name UK
        text comments
        text likes
        string user_name FK
        text content
        string image_url
        datetime date
    }
    
    CHALLENGES {
        int id PK
        string title
        string type
        string name
        int steps
        int squats
        int pushups
        int winbonus
        string deadline
        boolean clear
    }
    
    CLAIMS {
        int id PK
        string username FK
        int claim
        datetime last_claimed
    }
    
    ADMIN_USERS {
        int id PK
        string username UK
        string password
        string email UK
        datetime created_at
        datetime last_login
    }
    
    ORDERS {
        int id PK
        text orders
        string username FK
    }
    
    USER_PUSHUP {
        int id PK
        string user_email
        string user_name FK
        int pushups
        string date
        string team
        datetime created_at
    }
    
    USER_SQUAT {
        int id PK
        string user_email
        string user_name FK
        int squats
        string date
        string team
        datetime created_at
    }
    
    %% Relationships
    USERS ||--o{ USER_STEPS : tracks
    USERS ||--o{ TRANSACTIONS : makes
    USERS ||--o{ SOCIALS : creates
    USERS ||--o{ CLAIMS : claims
    USERS ||--o{ ORDERS : places
    USERS ||--o{ USER_PUSHUP : performs
    USERS ||--o{ USER_SQUAT : performs
```

## 🔄 API Endpoint Summary

### Authentication & User Management
- `POST /api/auth/login` - User authentication
- `POST /api/auth/signup` - User registration
- `GET /api/auth/profile` - User profile retrieval
- `GET /api/users` - Public user data query

### Fitness & Health Tracking
- `GET /api/fit` - Google Fit integration
- `POST /api/stats/pushups` - Pushup tracking
- `POST /api/stats/squats` - Squat tracking
- `GET /api/leaderboard` - Fitness leaderboards

### Social & Community
- `POST /api/social` - Create social posts
- `GET /api/social` - Retrieve social feed
- `POST /api/interaction/comment` - Add comments
- `POST /api/interaction/like` - Toggle likes

### Challenges & Rewards
- `POST /api/challenges` - Create challenges
- `POST /api/claimsteps` - Claim step rewards
- `POST /api/claim` - General claim processing

### Financial & E-commerce
- `POST /api/transaction` - Process transactions
- `POST /api/history` - Transaction history
- `POST /api/order` - Order processing

### AI & Analytics
- `POST /api/gemini` - AI chat integration
- `GET /api/analytics` - ML-powered analytics

### Admin & Management
- `POST /api/admin/auth/login` - Admin authentication
- `GET /api/admin/users` - User management
- `PUT /api/admin/users` - User data updates

### Content & External Data
- `POST /api/news` - News content aggregation
- `GET /api/product_reader` - Product catalog management

## 🚀 Performance Optimization Strategies

1. **Database Indexing**: Optimized queries with proper indexing
2. **Connection Pooling**: Efficient SQLite connection management
3. **Response Caching**: Minimal database hits for repeated requests
4. **Batch Operations**: Efficient bulk data processing
5. **Lazy Loading**: On-demand data retrieval
6. **Error Handling**: Graceful degradation and fallback mechanisms

This comprehensive API architecture enables scalable, secure, and efficient operation of the DataSprint1 corporate wellness platform.