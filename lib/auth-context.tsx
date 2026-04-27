"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { auth, AuthResponse, Role } from "./api";

interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface WaitlistResult {
  waitlistPosition?: number;
  remaining?: number;
  community?: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: Role, community?: string) => Promise<WaitlistResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function persist(res: AuthResponse) {
  localStorage.setItem("access_token", res.accessToken);
  localStorage.setItem("refresh_token", res.refreshToken);
  localStorage.setItem("user", JSON.stringify(res.user));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);

    // When api.ts silently refreshes the token it updates localStorage but the
    // React state doesn't know. Listen for storage events so the context stays
    // in sync (e.g. if the user is logged out from another tab).
    function onStorage(e: StorageEvent) {
      if (e.key === "user") {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await auth.login(email, password);
    persist(res);
    setUser(res.user);
  }, []);

  const register = useCallback(
    async (email: string, password: string, name: string, role: Role, community?: string): Promise<WaitlistResult> => {
      const res = await auth.register(email, password, name, role, community);
      persist(res);
      setUser(res.user);
      return {
        waitlistPosition: res.waitlistPosition,
        remaining: res.remaining,
        community: res.community,
      };
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
