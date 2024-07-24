/* The file next-auth.d.ts is a TypeScript declaration file for customizing the types used by next-auth in our Next.js project. 
This file extends the default types provided by next-auth to include custom fields for the 
User, Session, and JWT interfaces
 */

import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    username?: string;
    isVerified?: boolean;
    isAcceptmessage?: boolean;
  }

  interface Session {
    user: {
      _id?: string;
      username?: string;
      isVerified?: boolean;
      isAcceptmessage?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    username?: string;
    isVerified?: boolean;
    isAcceptmessage?: boolean;
  }
}
