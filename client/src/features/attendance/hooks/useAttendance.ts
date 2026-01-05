import { useQuery, useMutation } from "@tanstack/react-query";
import { attendanceService } from "../services/attendanceService";
import { queryClient } from "@/shared/services/queryClient";

export function useAttendance(params?: { date?: string; departmentId?: number }) {
  return useQuery({
    queryKey: ["/api/attendance", params],
    queryFn: () => attendanceService.getAttendance(params),
  });
}

export function useRecordAttendance() {
  return useMutation({
    mutationFn: attendanceService.recordAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/attendance"] });
    },
  });
}

export function useDepartmentSummary(departmentId: number, date?: string) {
  return useQuery({
    queryKey: ["/api/attendance/department", departmentId, date],
    queryFn: () => attendanceService.getDepartmentSummary(departmentId, date),
    enabled: !!departmentId,
  });
}

export function useMyClassStatus(date?: string) {
  return useQuery({
    queryKey: ["/api/attendance/my-class/status", date],
    queryFn: () => attendanceService.getMyClassStatus(date),
  });
}
