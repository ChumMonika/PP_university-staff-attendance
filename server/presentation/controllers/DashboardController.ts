import { Request, Response, NextFunction } from "express";
import type { DashboardUseCase } from "../../core/use-cases/DashboardUseCase";

export class DashboardController {
  constructor(private dashboardUseCase: DashboardUseCase) {}

  async getMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = req.session as any;
      const userId = session.userId;
      const userRole = session.userRole;
      
      const metrics = await this.dashboardUseCase.getMetrics(userId, userRole);
      res.json(metrics);
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = req.session as any;
      const userRole = session.userRole;
      
      const stats = await this.dashboardUseCase.getStats(userRole);
      res.json(stats);
    } catch (error: any) {
      if (error.message === "Forbidden") {
        res.status(403).json({ message: "Forbidden" });
        return;
      }
      next(error);
    }
  }
}
