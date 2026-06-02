import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

type AuthCredentials = {
  email?: string;
  password?: string;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        try {
          const credentials = rawCredentials as AuthCredentials | undefined;
          if (!credentials?.email || !credentials?.password) return null;
          const normalizedEmail = credentials.email.trim().toLowerCase();

          const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
          });

          if (!user || !user.password) return null;

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordValid) return null;

          return {
            id: String(user.id),
            email: user.email,
            name: user.name,
            role: String(user.role),
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = String(user.role);
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = String(token.role ?? "");
        session.user.id = String(token.id ?? "");
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};
