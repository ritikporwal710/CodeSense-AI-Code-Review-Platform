export type UserRole = "user" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role?: UserRole;
  forcePasswordChange?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
}
