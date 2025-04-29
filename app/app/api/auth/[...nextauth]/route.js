import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'

const db = new PrismaClient();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" }
      },
      authorize: async (credentials) => {
        const user = await db.users.findFirst({
          where: {
            OR: [
              { username: credentials.username },
              { email: credentials.username }
            ]
          }
        });

        if (!user) {
          throw new Error("Incorrect username or password");
        }

        if (user.isVerified === "false") {
          throw new Error("The user is not verified");
        }

        if (user && (await bcrypt.compare(credentials.password, user.password))) {
          return {
            id: user.user_id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            profile_pic: user.profile_pic,
          };
        }
      }
    }),
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
        }
      },
    }),
    GithubProvider({
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user_id = user.id; // valódi auto-increment ID
        token.oauth_id = user.oauth_id;
        token.email = user.email;
        token.username = user.username;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
        token.profile_pic = user.profile_pic;
      } else {
        // fallback: DB-ből újratölteni, ha token van, de user nincs
        const dbUser = await db.users.findUnique({
          where: { email: token.email },
        });
    
        if (dbUser) {
          token.id = dbUser.user_id;
          token.oauth_id = dbUser.oauth_id;
          token.username = dbUser.username;
          token.first_name = dbUser.first_name;
          token.last_name = dbUser.last_name;
          token.profile_pic = dbUser.profile_pic;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.oauth_id = token.oauth_id;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.first_name = token.first_name;
        session.user.last_name = token.last_name;
        session.user.profile_pic = token.profile_pic;
      }
      return session;
    },
    async signIn({ account, profile, credentials }) {
      if (account.provider === "github" || account.provider === "google") {
        if (!profile?.email) throw new Error("No profile");
    
        const existingUser = await db.users.findUnique({
          where: { email: profile.email },
        });
    
        if (existingUser) {
          return {
            id: existingUser.user_id,
            oauth_id: existingUser.oauth_id,
            email: existingUser.email,
            username: existingUser.username,
            first_name: existingUser.first_name,
            last_name: existingUser.last_name,
            profile_pic: existingUser.profile_pic,
          };
        }
    
        const newUser = await db.users.create({
          data: {
            email: profile.email,
            username: account.provider === "github" ? profile.login : profile.name,
            oauth: "true",
            role: "user",
            oauth_id: profile.sub,
          }
        });
    
        return {
          id: newUser.user_id,
          oauth_id: newUser.oauth_id,
          email: newUser.email,
          username: newUser.username,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          profile_pic: newUser.profile_pic,
        };
      }
    
      if (credentials) {
        return true;
      }
    }
  },
}

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }
