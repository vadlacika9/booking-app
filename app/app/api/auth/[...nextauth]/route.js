import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'


// Globális PrismaClient példány
const db = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" }
      },
      authorize: async (credentials) => {
        // Felhasználó keresése az adatbázisban
        const user = await db.users.findFirst({
          where: { username: credentials.username }
        });

        // Ha nincs ilyen felhasználó, hiba
        if (!user) {
          throw new Error("Hibás felhasználónév vagy jelszó");
        }

        // Jelszó ellenőrzése
        if(user && ( await bcrypt.compare(credentials.password,user.password)))
        {
          return {
            id : user.user_id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
          };
        }
        

        // Felhasználó adatok visszaadása
        
      
    }})
  ],
  session: {
    strategy: "jwt", // JWT alapú session kezelés
    maxAge: 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      // Ha bejelentkezett a felhasználó, akkor hozzáadjuk a tokenhez az adatokat
      if (user) {
        token.id = user.id;          // Felhasználó ID
        token.username = user.username; // Felhasználó neve
        token.email = user.email;      // Felhasználó emailje
        token.first_name = user.first_name; // Felhasználó keresztneve
        token.last_name = user.last_name;   // Felhasználó vezetékneve
      }
      return token; // Visszaadjuk a token-t
    },
    async session({ session, token }) {
      // A session objektumban is hozzáadjuk a token adatokat
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;   // Tokenből jövő username
        session.user.email = token.email;         // Tokenből jövő email
        session.user.first_name = token.first_name; // Tokenből jövő keresztneve
        session.user.last_name = token.last_name;   // Tokenből jövő vezetéknév
      }
      return session; // A session visszaadása
    }

  },
  
 
}

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }