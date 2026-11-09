import { apiClient } from "./client";
import type {
  LoginCredentials,
  RegisterData,
  Token,
  User,
} from "../types";

export async function login(
  credentials: LoginCredentials
): Promise<Token> {
  const formData = new URLSearchParams();

  formData.append("username", credentials.email);
  formData.append("password", credentials.password);

  const response = await apiClient.post<Token>(
    "/auth/login",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data;
}

export async function register(
  data: RegisterData
): Promise<User> {
  const response = await apiClient.post<User>(
    "/auth/register",
    data
  );

  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<User>("/auth/me");

  return response.data;
}