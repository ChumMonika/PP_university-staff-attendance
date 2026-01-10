import type { Request, Response, NextFunction } from "express";
import { AttendanceUseCase } from "../../core/use-cases/AttendanceUseCase";
import { markAttendanceSchema } from "@shared/schema";
import type IStorage from "../../core/interfaces/IStorage";

export class AttendanceController {
  constructor(
    private attendanceUseCase: AttendanceUseCase,
    private storage?: IStorage
  ) {}

  async getMyAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
    const currentUserId = (req.session as any).userId;
    const attendance = await this.attendanceUseCase.getMyAttendance(currentUserId);
    res.json(attendance);
  }

  async getHeadAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userRole = (req.session as any).userRole;
    const currentUserId = (req.session as any).userId;

    const filters = {
      startDate: (req.query.startDate as string) || undefined,
      endDate: (req.query.endDate as string) || undefined,
      role: (req.query.role as string) || undefined,
      class: (req.query.class as string) || undefined,
      status: (req.query.status as string) || undefined,
    };

    const attendance = await this.attendanceUseCase.getHeadAttendance(
      currentUserId,
      userRole,
      filters
    );
    res.json(attendance);
  }

  async checkClassActiveStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = (req.session as any).userId;
    const userRole = (req.session as any).userRole;

    const result = await this.attendanceUseCase.checkClassActiveStatus(userId, userRole);
    res.json(result);
  }

  async getActiveClasses(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userRole = (req.session as any).userRole;

    const classes = await this.attendanceUseCase.getActiveClasses(userRole);
    res.json(classes);
  }

  async markAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { userId, date, status, scheduleId } = markAttendanceSchema.parse(req.body);

    const userRole = (req.session as any).userRole;
    const currentUserId = (req.session as any).userId;

    const targetUser = await (this.attendanceUseCase as any).storage?.getUser(userId);
    if (!targetUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const attendance = await this.attendanceUseCase.markAttendance(
      userId,
      date,
      status,
      userRole,
      currentUserId,
      scheduleId || undefined, // Convert null to undefined
      targetUser.schedule
    );

    res.json(attendance);
  }

  async getTodayAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
    const result = await this.attendanceUseCase.getTodayAttendance();
    res.json(result);
  }

  async getStaffAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userRole = (req.session as any).userRole;

    const result = await this.attendanceUseCase.getStaffAttendance(userRole);
    res.json(result);
  }

  async getDepartmentSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userRole = (req.session as any).userRole;
      if (!['head', 'admin'].includes(userRole)) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }

      if (!this.storage) {
        res.status(500).json({ message: "Storage not configured" });
        return;
      }

      const summary = await this.storage.getDepartmentSummary();
      res.json(summary);
    } catch (error) {
      next(error);
    }
  }

  async getMyClassStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.session as any).userId;
      const userRole = (req.session as any).userRole;
      
      if (userRole !== 'class_moderator' && userRole !== 'moderator') {
        res.status(403).json({ message: "Only class moderators can check class status" });
        return;
      }
      
      if (!this.storage) {
        res.status(500).json({ message: "Storage not configured" });
        return;
      }

      const user = await this.storage.getUser(userId);
      
      if (!user?.classId) {
        res.json({ 
          hasClass: false, 
          isActive: false,
          message: "No class assigned" 
        });
        return;
      }
      
      const classObj = await this.storage.getClass(user.classId);
      
      if (!classObj) {
        res.json({ 
          hasClass: false, 
          isActive: false,
          message: "Class not found" 
        });
        return;
      }
      
      res.json({ 
        hasClass: true, 
        isActive: classObj.isActive === 1,
        classInfo: {
          id: classObj.id,
          name: classObj.name,
          isActive: classObj.isActive
        },
        message: classObj.isActive === 1 
          ? "Class is active" 
          : "Class is inactive - you cannot mark attendance"
      });
    } catch (error) {
      next(error);
    }
  }
}
