import { useQuery, useMutation } from "@tanstack/react-query";
import { leaveService, type CreateLeaveRequestData, type UpdateLeaveRequestData } from "../services/leaveService";
import { queryClient } from "@/shared/services/queryClient";

export function useLeaveRequests() {
  return useQuery({
    queryKey: ["/api/leave-requests"],
    queryFn: leaveService.getLeaveRequests,
  });
}

export function useCreateLeaveRequest() {
  return useMutation({
    mutationFn: (data: CreateLeaveRequestData) => leaveService.createLeaveRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leave-requests"] });
    },
  });
}

export function useUpdateLeaveRequest() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLeaveRequestData }) =>
      leaveService.updateLeaveRequest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leave-requests"] });
    },
  });
}

export function useDeleteLeaveRequest() {
  return useMutation({
    mutationFn: (id: number) => leaveService.deleteLeaveRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leave-requests"] });
    },
  });
}
