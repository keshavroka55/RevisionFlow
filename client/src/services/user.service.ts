import api from "../api/axiosInstance";
import { UserProfile, UpdateProfileInput, UpdatedProfile } from "../types/user.types";

export const userService = {

  // GET /api/users/me — full profile with subscription, stats, streaks
  getMyProfile: async (): Promise<UserProfile> => {
    const response = await api.get("/users/me");
    return response.data;
  },

  // PUT /api/users/me — update name, avatarUrl, timezone
  updateMyProfile: async (data: UpdateProfileInput): Promise<UpdatedProfile> => {
    const response = await api.put("/users/me", data);
    return response.data;
  },
};
