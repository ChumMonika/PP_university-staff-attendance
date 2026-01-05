import type { Request, Response, NextFunction } from "express";
import { LeaveRequestUseCase } from "../../core/use-cases/LeaveRequestUseCase";
import { insertLeaveRequestSchema, respondLeaveRequestSchema } from "@shared/schema";

export class LeaveRequestController {
  constructor(private leaveRequestUseCase: LeaveRequestUseCase) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const requestData = insertLeaveRequestSchema.parse(req.body);
    const userId = (req.session as any).userId;

    const leaveRequest = await this.leaveRequestUseCase.createLeaveRequest(
      userId,
      requestData.leaveType,
      requestData.startDate,
      requestData.endDate,
      requestData.reason
    );

    res.json(leaveRequest);
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userRole = (req.session as any).userRole;
    const currentUserId = (req.session as any).userId;

    console.log("📋 [Leave Requests API] Request from:", {
      userId: currentUserId,
      role: userRole,
    });

    const leaveRequests = await this.leaveRequestUseCase.getLeaveRequests(
      currentUserId,
      userRole
    );

    console.log("📤 [Response] Sending leave requests:", leaveRequests.length);
    res.json(leaveRequests);
  }

  async respond(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log("📝 [Leave Respond] Request body:", req.body);
    console.log("📝 [Leave Respond] Session:", {
      userId: (req.session as any).userId,
      role: (req.session as any).userRole,
    });

    const { requestId, status, rejectionReason } = respondLeaveRequestSchema.parse(req.body);

    const userRole = (req.session as any).userRole;
    const currentUserId = (req.session as any).userId;

    const updatedRequest = await this.leaveRequestUseCase.respondToLeaveRequest(
      requestId,
      status,
      currentUserId,
      userRole,
      rejectionReason
    );

    console.log("✅ [Leave Respond] Updated successfully");
    res.json(updatedRequest);
  }
}
