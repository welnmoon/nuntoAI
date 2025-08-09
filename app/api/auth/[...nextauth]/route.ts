import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "@/prisma/prisma-client";
import { compare } from "bcryptjs";

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Введите email" },
        password: {
          label: "Пароль",
          type: "password",
          placeholder: "Введите пароль",
        },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Неверные данные");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Пользователь не найден");
        }

        if (!user.password || user.password.trim() === "") {
          throw new Error(
            "Этот аккаунт создан через GitHub. Войдите через GitHub."
          );
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) {
          throw new Error("Неверный пароль");
        }

        if (!user.verified) {
          throw new Error("Пользователь не верифицирован");
        }
        return {
          ...user,
          name: user.fullName,
          id: String(user.id),
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // для чего и обязательно ли? и откуда брать
  session: {
    strategy: "jwt", // для чего? Можно ли выбрать что то другое или это лучше?
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name; // или user.fullName
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id);
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
