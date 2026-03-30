import { User } from "../app-states/AuthStore";
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

export const requestOtp = async (phone: string): Promise<{ success: boolean; request_id: string }> => {
  const { data } = await api.post("phone_login/request_code", { phone });
  return { success: true, request_id: data.request_id };
};

export const verifyOtp = async (
  phone: string,
  code: string,
  request_id: string
): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>("phone_login/verify_code", {
    phone,
    code,
    request_id,
  });
  return data;
};
