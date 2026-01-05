import { apiRequest } from "@/shared/services/queryClient";

export interface CreateUserData {
  uniqueId: string;
  name: string;
  email: string;
  password: string;
  role: string;
  departmentId?: number;
  classId?: number;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  departmentId?: number;
  classId?: number;
}

export const userService = {
  async getUsers() {
    const response = await apiRequest("GET", "/api/users");
    return response.json();
  },

  async createUser(data: CreateUserData) {
    const response = await apiRequest("POST", "/api/users", data);
    return response.json();
  },

  async updateUser(id: number, data: UpdateUserData) {
    const response = await apiRequest("PUT", `/api/users/${id}`, data);
    return response.json();
  },

  async deleteUser(id: number) {
    const response = await apiRequest("DELETE", `/api/users/${id}`);
    return response.json();
  }
};
