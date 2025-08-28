import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

// Shared NextAuth configuration for Google Fit integration
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/fitness.activity.read"
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      return session
    },
  },
  pages: {
    signIn: '/', // Redirect to home page for sign in
  }
}

// Export auth function for NextAuth v5
export const { auth, handlers } = NextAuth(authOptions)