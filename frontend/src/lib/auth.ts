import NextAuth, { DefaultSession } from 'next-auth';
import { cert } from 'firebase-admin/app';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';

import { FirestoreAdapter, initFirestore } from '@auth/firebase-adapter';
import { AccountType } from '@/types';

export const firestore = initFirestore({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_AUTH_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_AUTH_PRIVATE_KEY,
  }),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
    }),
    GitHubProvider,
  ],
  adapter: FirestoreAdapter(firestore),
  callbacks: {
    async session({ session, token }) {
      console.log('Session callback:', { session, token });
      session.user.id = session.userId;
      return session;
    },
  },
});

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id?: string;
      accountType?: AccountType;
      isPublic?: boolean;
      displayName?: string;
      pronouns?: string;
      title?: string;
      officeId?: string;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession['user'];
  }
}
