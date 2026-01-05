import IStorage from "../interfaces/IStorage";
import type { LeaveRequest, InsertLeaveRequest } from "@shared/schema";
import { UnauthorizedError, NotFoundError, ValidationError } from "../errors";

export interface LeaveRequestWithUser extends LeaveRequest {
  user?: any;
}

export class LeaveRequestUseCase {
  constructor(private storage: IStorage) {}

  async createLeaveRequest(
    userId: number,
    leaveType: string,
    startDate: string,
    endDate: string,
    reason: string
  ): Promise<LeaveRequest> {
    const leaveRequest = await this.storage.createLeaveRequest({
      userId,
      leaveType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
    });

    return leaveRequest;
  }

  async getLeaveRequests(
    currentUserId: number,
    userRole: string
  ): Promise<LeaveRequestWithUser[]> {
    let leaveRequests: any[];

    if (userRole === "admin") {
      leaveRequests = await this.storage.getLeaveRequests();
    } else if (userRole === "head") {
      leaveRequests = await this.storage.getLeaveRequests();

      const currentUser = await this.storage.getUser(currentUserId);

      if (currentUser?.departmentId) {
        const allUsers = await this.storage.getAllUsers();
        const departmentUserIds = allUsers
          .filter((u) => u.departmentId === currentUser.departmentId)
          .map((u) => u.id);

        leaveRequests = leaveRequests.filter((req) =>
          departmentUserIds.includes(req.userId)
        );
      } else {
        leaveRequests = [];
      }
    } else {
      leaveRequests = await this.storage.getLeaveRequests(currentUserId);
    }

    // Enrich with user data
    const leaveRequestsWithUsers = await Promise.all(
      leaveRequests.map(async (request) => {
        const user = await this.storage.getUser(request.userId);
        return { ...request, user };
      })
    );

    return leaveRequestsWithUsers;
  }

  async respondToLeaveRequest(
    requestId: number,
    status: "approved" | "rejected",
    currentUserId: number,
    userRole: string,
    rejectionReason?: string
  ): Promise<LeaveRequest> {
    if (userRole !== "head" && userRole !== "admin") {
      throw new UnauthorizedError("Only Head of Department can approve/reject leave requests");
    }

    const allLeaveRequests = await this.storage.getLeaveRequests();
    const leaveRequest = allLeaveRequests.find((r) => r.id === requestId);

    if (!leaveRequest) {
      throw new NotFoundError("Leave request not found");
    }

    // Department check for heads
    if (userRole === "head") {
      const currentUser = await this.storage.getUser(currentUserId);
      const requestUser = await this.storage.getUser(leaveRequest.userId);

      if (currentUser?.departmentId !== requestUser?.departmentId) {
        throw new ValidationError("You can only respond to leave requests from your department");
      }
    }

    const updates: Partial<LeaveRequest> = {
      status: status as any,
      respondedAt: new Date(),
      respondedBy: currentUserId,
    };

    if (status === "rejected" && rejectionReason) {
      updates.rejectionReason = rejectionReason;
    }

    const updatedRequest = await this.storage.updateLeaveRequest(requestId, updates);
    if (!updatedRequest) {
      throw new ValidationError("Failed to update leave request");
    }

    // Auto-create attendance records for approved leaves
    if (status === "approved") {
      await this.createAttendanceForApprovedLeave(
        updatedRequest.userId,
        updatedRequest.startDate,
        updatedRequest.endDate,
        currentUserId
      );
    }

    return updatedRequest;
  }

  private async createAttendanceForApprovedLeave(
    userId: number,
    startDate: Date | string,
    endDate: Date | string,
    respondedBy: number
  ): Promise<void> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      await this.storage.markAttendance({
        userId,
        date: new Date(dateStr),
        status: "leave",
        isLate: 0,
        markedAt: new Date(),
        markedBy: respondedBy,
      });
    }
  }
}
