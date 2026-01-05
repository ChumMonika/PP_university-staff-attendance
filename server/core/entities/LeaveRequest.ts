export interface LeaveRequest {
  id: number;
  userId: number;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason: string | null;
  submittedAt: Date;
  respondedAt: Date | null;
  respondedBy: number | null;
}
