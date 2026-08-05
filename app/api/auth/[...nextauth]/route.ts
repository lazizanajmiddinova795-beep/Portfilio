import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Force dynamic rendering - never statically analyze this route
export const dynamic = "force-dynamic";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        try {
          // Phase 2: Look up user from PostgreSQL database via Prisma
          // Dynamic import to avoid module-level initialization during build
          const { prisma } = await import("@/lib/prisma");
          const user = await prisma.user.findFirst({
            where: {
              email: credentials.email,
              deletedAt: null,
            },
          });

          if (!user) {
            throw new Error("Invalid credentials");
          }

          const isPasswordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordMatch) {
            throw new Error("Invalid credentials");
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        } catch (dbError) {
          // Phase 1 fallback: if DB is not connected yet, use env credentials
          // This ensures zero downtime during migration
          const adminEmail = process.env.ADMIN_EMAIL;
          const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

          if (adminEmail && adminPasswordHash) {
            if (credentials.email !== adminEmail) {
              throw new Error("Invalid credentials");
            }
            const isMatch = await bcrypt.compare(
              credentials.password,
              adminPasswordHash
            );
            if (!isMatch) throw new Error("Invalid credentials");
            return { id: "1", name: "Admin", email: adminEmail };
          }

          throw new Error("Authentication service unavailable");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
