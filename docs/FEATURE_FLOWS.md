# StepUp Application - Feature Flow Diagrams

## API Endpoint Flow Charts

### 1. User Authentication Flow

```mermaid
flowchart TD
    A[User Visits App] --> B{Already Authenticated?}
    B -->|Yes| C[Redirect to Home Dashboard]
    B -->|No| D[Show Login Page]
    
    D --> E[User Enters Credentials]
    E --> F[Submit Login Form]
    F --> G[POST /api/auth/login]
    
    G --> H{Valid Credentials?}
    H -->|No| I[Return Error Message]
    H -->|Yes| J[Generate JWT Token]
    
    J --> K[Set HTTP-only Cookie]
    K --> L[Return Success Response]
    L --> C
    
    I --> D
    
    %% Registration Flow
    D --> M[Click Sign Up]
    M --> N[Enter New Credentials]
    N --> O[POST /api/auth/signup]
    O --> P{Username Available?}
    P -->|No| Q[Return Error]
    P -->|Yes| R[Hash Password]
    R --> S[Create User in DB]
    S --> T[Initial Balance ₹100,000]
    T --> U[Return Success]
    U --> D
    Q --> M
    
    style A fill:#e3f2fd
    style C fill:#e8f5e8
    style I fill:#ffebee
    style Q fill:#ffebee
```

### 2. Google Fit Integration Flow

```mermaid
flowchart TD
    A[User Clicks Google Fit] --> B[Navigate to /app/googlefit]
    B --> C{Google Authenticated?}
    
    C -->|No| D[Show Sign In Button]
    D --> E[Click Sign In with Google]
    E --> F[OAuth Redirect to Google]
    F --> G[User Grants Permissions]
    G --> H[Return with Access Token]
    H --> I[Store Token in Session]
    
    C -->|Yes| J[Show Fetch Steps Button]
    I --> J
    
    J --> K[User Clicks Fetch Steps]
    K --> L[GET /api/fit]
    L --> M[Validate Access Token]
    M --> N{Token Valid?}
    
    N -->|No| O[Return 401 Error]
    N -->|Yes| P[Calculate Time Range]
    P --> Q[Last 24 Hours]
    Q --> R[Call Google Fit API]
    
    R --> S[Process Step Data]
    S --> T[Save to Database]
    T --> U[Return Step Count]
    U --> V[Display Progress]
    V --> W[Show Goal Progress]
    W --> X[10,000 Steps Target]
    
    O --> D
    
    %% Database Flow
    T --> Y[INSERT user_steps]
    Y --> Z[user_email, steps, date]
    
    style A fill:#e1f5fe
    style V fill:#e8f5e8
    style O fill:#ffebee
```

### 3. Transaction Management Flow

```mermaid
flowchart TD
    A[User Accesses Profile] --> B[POST /api/auth/profile]
    B --> C[Verify JWT Token]
    C --> D{Token Valid?}
    
    D -->|No| E[Return 401 Error]
    D -->|Yes| F[Get User Data]
    F --> G[Display Balance & Info]
    
    %% Transaction Flow
    G --> H[User Makes Transaction]
    H --> I[POST /api/transaction]
    I --> J[Validate Request Data]
    J --> K{Valid Data?}
    
    K -->|No| L[Return 400 Error]
    K -->|Yes| M[Check User Exists]
    M --> N{User Found?}
    
    N -->|No| O[Return 404 Error]
    N -->|Yes| P{Transaction Type?}
    
    P -->|Deposit| Q[Add Amount to Balance]
    P -->|Withdraw| R{Sufficient Balance?}
    
    R -->|No| S[Return Insufficient Funds]
    R -->|Yes| T[Subtract Amount]
    
    Q --> U[Update User Balance]
    T --> U
    U --> V[Log Transaction]
    V --> W[INSERT into transactions]
    W --> X[Return New Balance]
    
    %% History Flow
    G --> Y[View Transaction History]
    Y --> Z[POST /api/history]
    Z --> AA[Verify JWT Token]
    AA --> BB[Get User Transactions]
    BB --> CC[ORDER BY date DESC]
    CC --> DD[Return Transaction List]
    
    style A fill:#e3f2fd
    style G fill:#e8f5e8
    style X fill:#c8e6c9
    style E fill:#ffebee
    style L fill:#ffebee
    style O fill:#ffebee
    style S fill:#ffebee
```

### 4. Leaderboard System Flow

```mermaid
flowchart TD
    A[User Visits Leaderboard] --> B[GET /api/leaderboard]
    B --> C[Get Today's Date]
    C --> D[Query Database]
    D --> E[SELECT user_steps WHERE date = today]
    E --> F[ORDER BY steps DESC]
    F --> G[LIMIT 50]
    G --> H[Add Ranking Numbers]
    H --> I[Calculate Statistics]
    
    I --> J[Total Users Count]
    I --> K[Top Step Count]
    I --> L[Average Steps]
    
    J --> M[Return Leaderboard Data]
    K --> M
    L --> M
    
    M --> N[Display Rankings]
    N --> O[Show Medal Emojis]
    O --> P[🥇 🥈 🥉 🏅]
    P --> Q[Apply Gradient Styling]
    Q --> R[Show User Statistics]
    
    %% Refresh Flow
    R --> S[User Clicks Refresh]
    S --> B
    
    %% Empty State
    E --> T{Any Data?}
    T -->|No| U[Show Empty State]
    U --> V[Sync Your Steps Button]
    V --> W[Navigate to Google Fit]
    
    T -->|Yes| F
    
    style A fill:#e1f5fe
    style N fill:#e8f5e8
    style U fill:#fff3e0
```

### 5. AI Chatbot (Gemini) Flow

```mermaid
flowchart TD
    A[User Opens Steppe Chat] --> B[Initialize Chat Interface]
    B --> C[Show Welcome Message]
    C --> D[User Types Message]
    D --> E[Click Send Button]
    E --> F[POST /api/gemini]
    
    F --> G[Validate Request]
    G --> H{Valid Message?}
    H -->|No| I[Return Error]
    H -->|Yes| J[Prepare Gemini Request]
    
    J --> K[Add API Key]
    K --> L[Format Request Body]
    L --> M[Call Gemini API]
    M --> N[POST to generativelanguage.googleapis.com]
    
    N --> O{API Success?}
    O -->|No| P[Return Error Response]
    O -->|Yes| Q[Extract AI Reply]
    Q --> R[Return to Client]
    
    R --> S[Display AI Response]
    S --> T[Add to Chat History]
    T --> U[Clear Input Field]
    U --> V[Ready for Next Message]
    
    P --> W[Show Error Message]
    I --> W
    W --> V
    
    %% Chat Interface
    V --> X[User Continues Chat]
    X --> D
    
    style A fill:#fce4ec
    style S fill:#e8f5e8
    style W fill:#ffebee
```

### 6. Admin Dashboard Flow

```mermaid
flowchart TD
    A[Admin Access] --> B[POST /api/admin/auth/login]
    B --> C[Verify Admin Credentials]
    C --> D{Valid Admin?}
    
    D -->|No| E[Return 401 Error]
    D -->|Yes| F[Set Admin Cookie]
    F --> G[Navigate to Dashboard]
    
    G --> H[GET /api/admin/users]
    H --> I[Verify Admin Token]
    I --> J{Valid Token?}
    
    J -->|No| K[Redirect to Login]
    J -->|Yes| L[Query All Users]
    L --> M[Join User Data]
    M --> N[Get Step Statistics]
    N --> O[Get Transaction Summary]
    
    O --> P[Combine Data]
    P --> Q[Return User Analytics]
    Q --> R[Display Dashboard]
    
    %% User Management
    R --> S[Admin Edits User]
    S --> T[PUT /api/admin/users]
    T --> U[Validate Updates]
    U --> V[UPDATE users SET...]
    V --> W[Return Success]
    W --> X[Refresh Dashboard]
    
    %% Export Feature
    R --> Y[Export to CSV]
    Y --> Z[Generate CSV Data]
    Z --> AA[Download File]
    
    %% Logout
    R --> BB[Admin Logout]
    BB --> CC[POST /api/admin/auth/logout]
    CC --> DD[Clear Admin Cookie]
    DD --> EE[Redirect to Login]
    
    style A fill:#fff3e0
    style R fill:#e8f5e8
    style E fill:#ffebee
    style K fill:#ffebee
```

### 7. News API Proxy Flow

```mermaid
flowchart TD
    A[User Requests News] --> B[POST /api/news]
    B --> C[Extract URL Parameter]
    C --> D{Valid URL?}
    
    D -->|No| E[Return 400 Error]
    D -->|Yes| F[Fetch External API]
    F --> G[await fetch(url)]
    
    G --> H{Request Success?}
    H -->|No| I[Return 500 Error]
    H -->|Yes| J[Parse Response]
    J --> K[Return Proxied Data]
    
    K --> L[Display News Content]
    
    style A fill:#e3f2fd
    style L fill:#e8f5e8
    style E fill:#ffebee
    style I fill:#ffebee
```

---

## Complete Application Data Flow

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Next.js Pages]
        B[React Components]
        C[Client State]
    end
    
    subgraph "API Layer"
        D[Authentication Routes]
        E[Business Logic Routes]
        F[External API Proxies]
    end
    
    subgraph "Data Layer"
        G[SQLite Users DB]
        H[SQLite Transactions DB]
        I[SQLite Steps DB]
    end
    
    subgraph "External Services"
        J[Google Fit API]
        K[Gemini AI API]
        L[News APIs]
        M[Google OAuth]
    end
    
    A --> D
    A --> E
    A --> F
    B --> C
    C --> A
    
    D --> G
    E --> G
    E --> H
    E --> I
    
    F --> J
    F --> K
    F --> L
    D --> M
    
    style A fill:#e1f5fe
    style D fill:#e8f5e8
    style G fill:#fff3e0
    style J fill:#fce4ec
```

---

## Error Handling Patterns

### Authentication Errors
```mermaid
flowchart TD
    A[API Request] --> B{Has Token?}
    B -->|No| C[401 Unauthorized]
    B -->|Yes| D{Token Valid?}
    D -->|No| E[401 Invalid Token]
    D -->|Yes| F[Process Request]
    
    C --> G[Redirect to Login]
    E --> G
    
    style C fill:#ffcdd2
    style E fill:#ffcdd2
```

### Database Errors
```mermaid
flowchart TD
    A[Database Query] --> B{Connection OK?}
    B -->|No| C[500 Database Error]
    B -->|Yes| D{Query Valid?}
    D -->|No| E[400 Bad Query]
    D -->|Yes| F{Data Found?}
    F -->|No| G[404 Not Found]
    F -->|Yes| H[200 Success]
    
    style C fill:#ffcdd2
    style E fill:#ffcdd2
    style G fill:#ffcdd2
    style H fill:#c8e6c9
```

### External API Errors
```mermaid
flowchart TD
    A[External API Call] --> B{Network OK?}
    B -->|No| C[500 Network Error]
    B -->|Yes| D{API Response OK?}
    D -->|No| E[502 Bad Gateway]
    D -->|Yes| F{Valid Data?}
    F -->|No| G[500 Parse Error]
    F -->|Yes| H[200 Success]
    
    style C fill:#ffcdd2
    style E fill:#ffcdd2
    style G fill:#ffcdd2
    style H fill:#c8e6c9
```

---

## Performance Optimization Flows

### Database Query Optimization
```mermaid
flowchart TD
    A[Query Request] --> B{Cached?}
    B -->|Yes| C[Return Cache]
    B -->|No| D[Execute Query]
    D --> E[Apply Indexes]
    E --> F[Use Prepared Statements]
    F --> G[Cache Result]
    G --> H[Return Data]
    
    style C fill:#c8e6c9
    style H fill:#c8e6c9
```

### API Response Caching
```mermaid
flowchart TD
    A[API Request] --> B{Cache Hit?}
    B -->|Yes| C[Return Cached Response]
    B -->|No| D[Process Request]
    D --> E{Cacheable?}
    E -->|Yes| F[Store in Cache]
    E -->|No| G[Return Response]
    F --> G
    
    style C fill:#c8e6c9
    style G fill:#e8f5e8
```

This comprehensive flow chart documentation illustrates every API endpoint, feature interaction, and data flow within the StepUp application, providing a complete technical overview for developers and stakeholders.