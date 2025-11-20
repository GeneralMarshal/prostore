import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { cookies } from "next/headers";

import { prisma } from "@/db/prisma";
import { authConfig } from "@/auth.config";

export const config = {
  ...authConfig,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: PrismaAdapter(prisma),
  callbacks: {
    ...(authConfig.callbacks ?? {}),
    async session({ session, user, token, trigger }: any) {
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;
      if (trigger === "update") {
        session.user.name = user.name;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }: any) {
      // Assign user fields to token
      if (user) {
        token.id = user.id;
        token.role = user.role;

        if (trigger === "signIn" || trigger === "signUp") {
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get("sessionCartId")?.value;

          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId },
            });

            if (sessionCart) {
              // overwrite an existin guser cart
              await prisma.cart.deleteMany({
                where: { userId: user.id },
              });

              //Then assign the guest cart to the logged in user
              await prisma.cart.update({
                where: { id: sessionCart.id },
                data: { userId: user.id },
              });
            }
          }
        }
        // If user has no name, then use the first part of their email as the name
        if (user.name === "NO_NAME") {
          token.name = user.email!.split("@")[0];
        }
        //Then update the database
        await prisma.user.update({
          where: { id: user.id },
          data: { name: token.name },
        });
      }
      // Handle session updates (e.g., name change)
      if (session?.user.name && trigger === "update") {
        token.name = session.user.name;
      }

      return token;
    },
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        // first Step, find user in the database
        const user = await prisma.user.findFirst({
          where: { email: credentials.email as string },
        });

        // second step compare passwords
        if (user && user.password) {
          const isVerified = compareSync(
            credentials.password as string,
            user.password
          );

          // if is Verified, return user object
          if (isVerified) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
