import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any): Promise<any> {
        // connect  database
        await dbConnect();

        try {
          /* find the user with credentials
           * - find by email
           * - Or by username
           */
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          // user is not found
          if (!user) throw new Error("No user found with the given details");

          // user is found but not verify
          if (!user.isVerified)
            throw new Error("Please verify the account before login");

          /* credentials (username or email) match in DB
           * - Check Password
           *   - if password is correct return user
           *   - else throw error
           */
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) return user;
          else throw new Error("Incorrect Password");
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      /* If user is there
       * - add user details in token
       * - Purpose(user details are accessible if we have a token)
       */
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptMessages = user.isAcceptMessages;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, token }) {
      /* If token is there
       * - add token details in session.user
       * - Purpose(token contain user details, so user details are accessible if we have a session)
       */
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptMessages = token.isAcceptMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },

  pages: {
    signIn: "/signIn",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
