import api from "../api/axiosInstance";
import { RegisterInput, LoginInput, LoginResponse, User, MessageResponse, ResetPasswordInput } from "../types/auth.types";

//
export const authService = {
  register: async (data: RegisterInput): Promise<User> => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  login: async (data: LoginInput): Promise<LoginResponse> => {
    const response = await api.post("/auth/login", data);



    // store the jwt token on local storage.
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);


      // attach token to all the future requestes automatically. 
      api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
    }
    return response.data;
  },

  // Just redirect the window to your backend Google route
  loginWithGoogle: (): void => {
    const googleAuthUrl = import.meta.env.VITE_GOOGLE_AUTH_URL as string | undefined;

    if (!googleAuthUrl) {
      throw new Error(
        "Google login is not configured. Add VITE_GOOGLE_AUTH_URL to client/.env"
      );
    }

    // Full browser redirect — passport.js takes over from here
    window.location.href = googleAuthUrl;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get("/auth/me");
    return response.data;

  },

  forgotPassword: async (email: string): Promise<MessageResponse> => {
    const respose = await api.post("/auth/forgot-password", { email });
    return respose.data;

  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  },

  resetPassword: async (data: ResetPasswordInput): Promise<MessageResponse> => {
    const response = await api.post("/auth/reset-password", data);
    return response.data;
  },


  // Helper: attach saved token on app startup ( page refresh)

  loadTokenFromStorage: () => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  },

};