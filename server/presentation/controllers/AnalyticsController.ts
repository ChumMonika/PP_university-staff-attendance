import { Request, Response, NextFunction } from "express";
import type { AnalyticsUseCase } from "../../core/use-cases/AnalyticsUseCase";

export class AnalyticsController {
  constructor(private analyticsUseCase: AnalyticsUseCase) {}

  async getAttendanceSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = req.session as any;
      const userId = session.userId;
      const userRole = session.userRole;
      
      const filters = {
        startDate: req.query.startDate as string | undefined,
        endDate: req.query.endDate as string | undefined,
        userId: req.query.userId ? parseInt(req.query.userId as string) : undefined
      };
      
      const summary = await this.analyticsUseCase.getAttendanceSummary(userRole, userId, filters);
      res.json(summary);
    } catch (error) {
      next(error);
    }
  }

  async getLeaveStatistics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = req.session as any;
      const userId = session.userId;
      const userRole = session.userRole;
      
      const filters = {
        startDate: req.query.startDate as string | undefined,
        endDate: req.query.endDate as string | undefined
      };
      
      const stats = await this.analyticsUseCase.getLeaveStatistics(userRole, userId, filters);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  async getDepartmentOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = req.session as any;
      const userRole = session.userRole;
      
      const overview = await this.analyticsUseCase.getDepartmentOverview(userRole);
      res.json(overview);
    } catch (error: any) {
      if (error.message === "Forbidden") {
        res.status(403).json({ message: "Forbidden" });
        return;
      }
      next(error);
    }
  }

  async getMonthlyTrends(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = req.session as any;
      const userRole = session.userRole;
      const year = req.query.year ? parseInt(req.query.year as string) : undefined;
      
      const trends = await this.analyticsUseCase.getMonthlyTrends(userRole, year);
      res.json(trends);
    } catch (error: any) {
      if (error.message === "Forbidden") {
        res.status(403).json({ message: "Forbidden" });
        return;
      }
      next(error);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = req.session as any;
      const userRole = session.userRole;
      
      const users = await this.analyticsUseCase.getUsers(userRole);
      res.json(users);
    } catch (error: any) {
      if (error.message === "Forbidden") {
        res.status(403).json({ message: "Forbidden" });
        return;
      }
      next(error);
    }
  }
}
