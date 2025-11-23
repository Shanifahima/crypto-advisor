import api from "./client";
import { Preferences, User } from "../types";

type MeResponse = User & { preferences?: Preferences };

export const getMe = async () => {
  const res = await api.get<MeResponse>("/user/me");
  return res.data;
};

export const updatePreferences = async (preferences: Preferences) => {
  const res = await api.put("/user/preferences", preferences);
  return res.data;
};
