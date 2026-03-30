import { User } from "../app-states/auth/AuthStore";
import { api } from "./api";
export type LoginResponse = {
  user: User;
  token: string;
};

export const login = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  try {
    const { data } = await api.post<LoginResponse>("login", {
      email,
      password,
    });
    return data;
  } catch (error) {
    return error as LoginResponse;
  }
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};
