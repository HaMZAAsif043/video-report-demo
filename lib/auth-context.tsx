"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authApi, saveTokens, clearTokens, getStoredUser, storeUser } from "./api";
import type { User, UserRole } from "./types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isContributor: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isContributor = user?.role === "contributor";
  const isAdmin = user?.role === "admin";

  const refreshUser = useCallback(async () => {
    try {
      const u = await authApi.getProfile();
      setUser(u);
      storeUser(u);
    } catch {
      setUser(null);
      clearTokens();
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const stored = getStoredUser();
      const tokens = JSON.parse(localStorage.getItem("tokens") || "null");

      if (stored && tokens?.access) {
        setUser(stored);
        try {
          await refreshUser();
        } catch {
          // token expired, try refresh
          try {
            await refreshUser();
          } catch {
            clearTokens();
            setUser(null);
          }
        }
      }
      setLoading(false);
    };
    init();
  }, [refreshUser]);

  // Redirect logic
  useEffect(() => {
    if (loading) return;

    const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));

    if (!user && !isPublic) {
      router.replace("/login");
    } else if (user && isPublic) {
      router.replace(user.role === "admin" ? "/admin" : "/");
    } else if (user && pathname === "/") {
      router.replace(user.role === "admin" ? "/admin" : "/");
    }
  }, [user, loading, pathname, router]);

  const login = async (email: string, password: string) => {
    const tokens = await authApi.login(email, password);
    saveTokens(tokens);
    const u = await authApi.getProfile();
    setUser(u);
    storeUser(u);
    router.replace(u.role === "admin" ? "/admin" : "/");
  };

  const logout = () => {
    clearTokens();
    setUser(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser, isContributor, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
