import { apiClient } from "@/api/client";
import { unwrapApiData } from "@/api/response";
import type { AuthResponse, LoginRequest, SignupRequest } from "@/types/auth";

export async function login(request: LoginRequest) {
  const response = await apiClient.post<AuthResponse | { data: AuthResponse }>(
    "/auth/login",
    request,
  );

  return unwrapApiData<AuthResponse>(response);
}

export async function signup(request: SignupRequest) {
  const response = await apiClient.post<AuthResponse | { data: AuthResponse }>(
    "/auth/signup",
    request,
  );

  return unwrapApiData<AuthResponse>(response);
}
