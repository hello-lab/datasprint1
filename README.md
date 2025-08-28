This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Google Fit Integration

This application includes Google Fit integration that allows users to sign in with Google and view their step data for the last 24 hours.

### Prerequisites for Google Fit Setup

1. **Google Cloud Console Project**: You need a Google Cloud Console project with the Google Fit API enabled
2. **OAuth 2.0 Credentials**: Web application credentials for authentication
3. **Environment Variables**: Proper configuration of Google OAuth credentials

### Setting up Google OAuth Credentials

1. **Create a Google Cloud Project** (if you don't have one):
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google Fit API**:
   - In the Google Cloud Console, go to "APIs & Services" > "Library"
   - Search for "Fitness API" and enable it

3. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application" as the application type
   - Add authorized redirect URIs:
     - For development: `http://localhost:3000/api/auth/callback/google`
     - For production: `https://yourdomain.com/api/auth/callback/google`
   - Save the Client ID and Client Secret

4. **Set up Environment Variables**:
   - Copy `.env.example` to `.env.local`
   - Fill in your Google OAuth credentials:
     ```bash
     cp .env.example .env.local
     ```
   - Edit `.env.local` with your actual values:
     ```env
     NEXTAUTH_SECRET=your-random-secret-string
     NEXTAUTH_URL=http://localhost:3000
     GOOGLE_CLIENT_ID=your-google-client-id
     GOOGLE_CLIENT_SECRET=your-google-client-secret
     SECRET_KEY=your-existing-secret-key
     ```

### Required Environment Variables

- `NEXTAUTH_SECRET`: A random secret string for NextAuth.js (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL`: Your application URL (http://localhost:3000 for development)
- `GOOGLE_CLIENT_ID`: Your Google OAuth 2.0 Client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth 2.0 Client Secret
- `SECRET_KEY`: Your existing application secret key

### Using the Google Fit Integration

1. Navigate to `/app/googlefit` in your application
2. Click "Sign in with Google" to authenticate
3. Grant permissions for Google Fit access when prompted
4. Click "Fetch Step Data" to view your steps from the last 24 hours

### Google Fit API Scopes

The application requests the following Google Fit API scope:
- `https://www.googleapis.com/auth/fitness.activity.read`: Read access to activity data (steps, calories, etc.)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
