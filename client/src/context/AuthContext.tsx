import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types";
import { getMe } from "../api/user";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  loadingUser: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token")
  );
  const [loadingUser, setLoadingUser] = useState<boolean>(!!token);

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) return;
      try {
        const me = await getMe();
        setUser(me);
      } catch (err) {
        console.error("fetchMe error", err);
        setUser(null);
        localStorage.removeItem("token");
        setToken(null);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchMe();
  }, [token]);

  const setAuth = (newToken: string, newUser: User) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, setAuth, logout, loadingUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
