import 'server-only';

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { AuthOptions, Session } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import GoogleProvider from 'next-auth/providers/google';

import { prisma } from '@/lib/prisma';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, user }: { session: Session; user: AdapterUser }) {
      if (session?.user) {
        session.user = {
          ...(session.user as AdapterUser),
          id: user.id,
          emailVerified: user.emailVerified
        };
      }
      return session;
    }
  }
};
