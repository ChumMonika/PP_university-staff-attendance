import { apiRequest } from "@/shared/services/queryClient";

export const attendanceService = {
  async getAttendance(params?: { date?: string; departmentId?: number }) {
    let url = "/api/attendance";
    if (params?.date || params?.departmentId) {
      const searchParams = new URLSearchParams();
      if (params.date) searchParams.set("date", params.date);
      if (params.departmentId) searchParams.set("departmentId", params.departmentId.toString());
      url += `?${searchParams.toString()}`;
    }
    const response = await apiRequest("GET", url);
    return response.json();
  },

  async recordAttendance(data: { date: string; status: string; remarks?: string }) {
    const response = await apiRequest("POST", "/api/attendance", data);
    return response.json();
  },

  async getDepartmentSummary(departmentId: number, date?: string) {
    let url = `/api/attendance/department/${departmentId}/summary`;
    if (date) url += `?date=${date}`;
    const response = await apiRequest("GET", url);
    return response.json();
  },

  async getMyClassStatus(date?: string) {
    let url = "/api/attendance/my-class/status";
    if (date) url += `?date=${date}`;
    const response = await apiRequest("GET", url);
    return response.json();
  }
};
