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

        if (!user.emailVerified) {
          throw new Error("Пользователь не верифицирован");
        }
        return {
          ...user,
          fullName: user.fullName ?? null,
          id: String(user.id),
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.name = user.name ?? token.name;
        token.fullName = user.name ?? null;
      }

      if (!token.id && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
        });
        token.id = dbUser?.id;
        token.name = token.name ?? dbUser?.fullName ?? null;
        token.fullName =
          token.fullName ?? dbUser?.fullName ?? null;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token?.id) session.user.id = token.id as string;
      if (token?.name) session.user.name = token.name;
      const fullName = token.fullName;
      if (typeof fullName !== "undefined") {
        session.user.fullName = fullName;
      }
      if (token?.email) session.user.email = token.email;
      return session;
    },
  },
};
