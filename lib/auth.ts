import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { prisma } from "@/prisma/prisma-client";
import { compare } from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { Session, User, AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
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
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) token.id = user.id;

      if (!token.id && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
        });
        token.id = dbUser?.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token?.id) session.user.id = token.id as string;
      return session;
    },
  },
};
