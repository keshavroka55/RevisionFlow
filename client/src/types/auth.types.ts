export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: "USER" | "ADMIN";
  timezone: string;
  createdAt: string;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  timezone?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};