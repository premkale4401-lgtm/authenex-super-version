import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    
    // Test Credentials (for demo without Google)
    CredentialsProvider({
      id: "credentials",
      name: "Test Account",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Demo login - no password check
        if (credentials?.email === "test@authenex.com") {
          return {
            id: "test-001",
            name: "Demo Analyst",
            email: "test@authenex.com",
            image: "https://ui-avatars.com/api/?name=Demo+Analyst&background=06b6d4&color=fff",
            role: "ANALYST",
            clearanceLevel: 3,
          };
        }
        return null;
      }
    })
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "USER";
        token.clearanceLevel = (user as any).clearanceLevel || 1;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).clearanceLevel = token.clearanceLevel;
      }
      return session;
    },
    
    async signIn({ user, account, profile }) {
      console.log("Sign In Callback:", { user, account, profile });
      return true;
    }
  },
  
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  debug: true, // Enable debug logs in console
};