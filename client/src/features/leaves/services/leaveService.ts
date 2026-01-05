import { apiRequest } from "@/shared/services/queryClient";

export interface CreateLeaveRequestData {
  startDate: string;
  endDate: string;
  reason: string;
  type: string;
}

export interface UpdateLeaveRequestData {
  status: string;
  remarks?: string;
}

export const leaveService = {
  async getLeaveRequests() {
    const response = await apiRequest("GET", "/api/leave-requests");
    return response.json();
  },

  async createLeaveRequest(data: CreateLeaveRequestData) {
    const response = await apiRequest("POST", "/api/leave-requests", data);
    return response.json();
  },

  async updateLeaveRequest(id: number, data: UpdateLeaveRequestData) {
    const response = await apiRequest("PUT", `/api/leave-requests/${id}`, data);
    return response.json();
  },

  async deleteLeaveRequest(id: number) {
    const response = await apiRequest("DELETE", `/api/leave-requests/${id}`);
    return response.json();
  }
};
