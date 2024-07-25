"use client"

import { SessionProvider } from "next-auth/react";
import React from "react";

type AuthProviderProp = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProp) {
  return <SessionProvider>{children}</SessionProvider>;
}
