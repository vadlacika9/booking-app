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

        if(user.isVerified === "false"){
          throw new Error("The user are not verified")
        }
        if(user && ( await bcrypt.compare(credentials.password,user.password)))
        {
          return {
            id : user.user_id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            profile_pic: user.profile_pic,
          };
        }
        

        
        
      
    }}),
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
        }},
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
        token.id = user.id;          
        token.username = user.username; 
        token.email = user.email;      
        token.first_name = user.first_name; 
        token.last_name = user.last_name;   
        token.profile_pic = user.profile_pic
      } else{
        // manuális update() híváskor – frissítsd a DB alapján
    const dbUser = await db.users.findUnique({
      where: { user_id: token.id },
    });

    if (dbUser) {
      token.profile_pic = dbUser.profile_pic;
    }
      }
      return token; 
    },
    async session({ session, token }) {

      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;   
        session.user.email = token.email;         
        session.user.first_name = token.first_name; 
        session.user.last_name = token.last_name;   
        session.user.profile_pic = token.profile_pic
      }
      return session; 
    },
    async signIn({ account, profile, credentials}){
     
      if(account.provider === "github"){
        if(!profile?.email){
          throw new Error("No profile")
        }
      
       const existingUser = await db.users.findUnique({
        where:{
          email: profile.email
        }
       })

       if (existingUser) {
        // Ha a felhasználó már létezik, de másik providerrel regisztrált
        throw new Error(
            `this user (${profile.email}) is occupied (${existingUser.provider}).`
          );
        
      }

      const oauth = "true";
      await db.users.create({
        data: {
          email: profile.email,
          username: profile.login,
          oauth: oauth
          
        }
      })

      return true;
    }else if(account.provider === "google"){
      if(!profile?.email){
        throw new Error("No profile")
      }

      const existingUser = await db.users.findUnique({
        where:{
          email: profile.email
        }
       })

       if (existingUser) {
        // Ha a felhasználó már létezik, de másik providerrel regisztrált
        throw new Error(
            `this user (${profile.email}) is occupied (${existingUser.provider}).`
          );
        
      }
      const oauth = "true";
      await db.users.create({
       
        data: {
          email: profile.email,
          username: profile.name,
          oauth: oauth
        }
        
      })

      return true;
    }

    if(credentials){
      return true
    }
    }
  },
  
 
}

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }