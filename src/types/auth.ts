export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest extends LoginRequest {
  nickname: string;
}

export interface AuthUser {
  id: number;
  email: string;
  nickname: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken?: string;
}
