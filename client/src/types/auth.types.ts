export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  timezone: string;
  createdAt: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// What POST /api/auth/login returns
// Your backend returns { user, token } from loginUser()
export interface LoginResponse {
  user: User;
  token: string;
}

// What POST /api/auth/forgot-password and reset-password return
export interface MessageResponse {
  message: string;
}

// What you send to POST /api/auth/reset-password
export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}
