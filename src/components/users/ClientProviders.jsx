
"use client";
import { AuthProvider } from "./authContext";

export default function ClientProviders({ children }) {
  return (
    <AuthProvider>
        {children}
    </AuthProvider>
  );
}
