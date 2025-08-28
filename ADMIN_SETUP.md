# Admin Panel Setup and Usage

## Overview
The admin panel has been completely separated from the main application and now requires dedicated admin authentication.

## New Admin Structure
- **Admin Login**: `/admin` - Dedicated admin login page
- **Admin Dashboard**: `/admin/dashboard` - Full admin panel functionality
- **Admin APIs**: `/api/admin/*` - Protected admin endpoints

## Key Changes
1. **Separated from Main App**: Admin panel is now completely independent of the regular user app
2. **Dedicated Authentication**: Admin users have separate authentication system
3. **Protected Routes**: All admin routes require admin authentication
4. **Secure Admin Sessions**: Admin tokens are separate from user tokens

## Setup Instructions

### 1. Environment Variables
Add these environment variables to your `.env.local` file:

```bash
# Required: Main application secret
SECRET_KEY=your_secret_key_here

# Optional: Separate admin secret (defaults to SECRET_KEY + '_ADMIN')
ADMIN_SECRET_KEY=your_admin_secret_key_here

# Required for admin setup: Setup key for creating first admin
ADMIN_SETUP_KEY=your_setup_key_here
```

### 2. Create First Admin User

#### Option A: Using the Setup Script
```bash
node setup-admin.js
```

#### Option B: Manual API Call
When the server is running, create the first admin user:

```bash
curl -X POST http://localhost:3003/api/admin/auth/setup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "secure_password",
    "email": "admin@example.com",
    "setupKey": "your_setup_key_here"
  }'
```

### 3. Start the Application
```bash
npm run dev
# or
npm run build && npm start
```

## Usage

### Admin Login
1. Navigate to `/admin`
2. Enter admin credentials
3. You'll be redirected to `/admin/dashboard`

### Admin Dashboard Features
- View all users and their data
- Edit user balances and step counts
- Export user data to CSV
- View summary statistics
- Secure logout

### Security Features
- **Separate Authentication**: Admin tokens are completely separate from user tokens
- **HttpOnly Cookies**: Admin tokens are stored in secure HttpOnly cookies
- **Route Protection**: All admin routes check for valid admin authentication
- **Protected APIs**: All admin API endpoints require admin authentication

## Database Changes
A new `admin.db` database is created with the `admin_users` table containing:
- `id`: Primary key
- `username`: Unique admin username
- `password`: Hashed password
- `email`: Optional email
- `created_at`: Account creation timestamp
- `last_login`: Last login timestamp

## API Endpoints

### Admin Authentication
- `POST /api/admin/auth/login` - Admin login
- `POST /api/admin/auth/logout` - Admin logout
- `POST /api/admin/auth/setup` - Create first admin (requires setup key)

### Admin Data Management
- `GET /api/admin/users` - Get all user data (admin auth required)
- `PUT /api/admin/users` - Update user data (admin auth required)

## Migration Notes
- The old `/app/admin` route has been removed
- All existing admin functionality is preserved in the new `/admin/dashboard`
- No data migration is needed for existing users
- Admin users are completely separate from regular users

## Troubleshooting

### Cannot Access Admin Panel
1. Ensure you have created an admin user using the setup endpoint
2. Check that environment variables are properly set
3. Verify the admin token cookie is being set

### Setup Endpoint Not Working
1. Ensure `ADMIN_SETUP_KEY` environment variable is set
2. Use the exact same key in your setup request
3. Check server logs for errors

### Build Failures
1. Ensure all dependencies are installed: `npm install`
2. Check that database files are accessible
3. Verify file paths in import statements