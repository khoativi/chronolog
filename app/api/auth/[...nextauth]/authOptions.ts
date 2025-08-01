import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { AuthOptions, Session, User } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import GoogleProvider from 'next-auth/providers/google';
import { uuidv7 } from 'uuidv7';

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
    },
    async signIn() {
      return true;
    }
  },
  events: {
    async createUser({ user }: { user: User }) {
      const { name, id } = user;
      const defaultTeamName = name ? `${name}'s Team` : 'Default Team';

      await prisma.team.create({
        data: {
          id: uuidv7(),
          name: defaultTeamName,
          members: {
            create: {
              userId: id,
              role: 'owner'
            }
          }
        }
      });
    }
  }
};
