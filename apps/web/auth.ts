import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";

const providers: Provider[] = [
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: true,
      })
    : null,
  process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
    ? GitHub({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: true,
      })
    : null,
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
      name: { label: "Name", type: "text" },
      action: { label: "Action", type: "text" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      const email = String(credentials.email);
      const password = String(credentials.password);
      const action = String(credentials.action ?? "login");
      const name = credentials.name ? String(credentials.name) : null;

      const existing = await prisma.user.findUnique({ where: { email } });

      if (action === "signup") {
        if (existing) {
          throw new Error("Email already in use");
        }
        const passwordHash = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
          data: { email, passwordHash, name },
        });
        return { id: user.id, email: user.email, name: user.name };
      }

      if (!existing || !existing.passwordHash) {
        return null;
      }

      const valid = await bcrypt.compare(password, existing.passwordHash);
      if (!valid) {
        return null;
      }

      return { id: existing.id, email: existing.email, name: existing.name };
    },
  }),
].filter(Boolean) as Provider[];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  session: { strategy: "database" },
  trustHost: true,
  pages: {
    signIn: "/login",
  },
});
