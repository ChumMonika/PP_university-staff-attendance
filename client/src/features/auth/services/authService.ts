import { apiRequest } from "@/shared/services/queryClient";

export interface LoginResponse {
  role: string;
  name: string;
  id: number;
  uniqueId: string;
}

export const authService = {
  async login(uniqueId: string, password: string): Promise<LoginResponse> {
    const response = await apiRequest("POST", "/api/login", { uniqueId, password });
    return response.json();
  },

  async logout(): Promise<void> {
    await apiRequest("POST", "/api/logout");
  },

  async getCurrentUser() {
    const response = await apiRequest("GET", "/api/me");
    if (!response.ok) {
      throw new Error('Not authenticated');
    }
    return response.json();
  }
};
