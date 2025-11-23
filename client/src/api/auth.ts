import api from "./client";
import { User } from "../types";

type AuthResponse = {
  token: string;
  user: User;
};

export const signup = async (name: string, email: string, password: string) => {
  const res = await api.post<AuthResponse>("/auth/signup", {
    name,
    email,
    password
  });
  return res.data;
};

export const login = async (email: string, password: string) => {
  const res = await api.post<AuthResponse>("/auth/login", { email, password });
  return res.data;
};
