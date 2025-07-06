import { FirestoreAdapter, initFirestore } from '@auth/firebase-adapter';
import { cert } from 'firebase-admin/app';
import NextAuth, { DefaultSession } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

import { DBUser, UserDTO } from '@/types';
import mapUserDocToDTO from './mapUserDocToDto';

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
    async session({ session }) {
      session.user.id = session.userId;
      session.userDTO = mapUserDocToDTO(session.user);
      console.log('Session userDTO:', session.userDTO);
      return session;
    },
  },
});

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: DBUser & DefaultSession['user'];
    userDTO: UserDTO;
  }
}
