import type { Request, Response, NextFunction } from "express";
import { ScheduleUseCase } from "../../core/use-cases/ScheduleUseCase";
import { insertScheduleSchema } from "@shared/schema";
import { UnauthorizedError, NotFoundError } from "../../core/errors";

export class ScheduleController {
  constructor(private scheduleUseCase: ScheduleUseCase) {}

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = (req.session as any).userId;
    const userRole = (req.session as any).userRole;
    const day = req.query.day as string | undefined;
    const majorId = req.query.majorId ? parseInt(req.query.majorId as string, 10) : undefined;

    const schedules = await this.scheduleUseCase.getAllSchedules(userId, userRole, {
      day,
      majorId,
    });

    res.json(schedules);
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const scheduleData = insertScheduleSchema.parse(req.body);
    const userRole = (req.session as any).userRole;

    if (userRole !== "admin") {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    const newSchedule = await this.scheduleUseCase.createSchedule(scheduleData);
    res.json(newSchedule);
  }

  async createBulk(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { schedules } = req.body;
    const userRole = (req.session as any).userRole;

    if (userRole !== "admin") {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    if (!Array.isArray(schedules)) {
      res.status(400).json({ message: "Schedules must be an array" });
      return;
    }

    const validatedSchedules = schedules.map((s) => insertScheduleSchema.parse(s));
    const newSchedules = await this.scheduleUseCase.createBulkSchedules(validatedSchedules);

    res.json(newSchedules);
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    const updates = insertScheduleSchema.partial().parse(req.body);
    const userRole = (req.session as any).userRole;

    if (userRole !== "admin") {
      throw new UnauthorizedError("Forbidden");
    }

    const updatedSchedule = await this.scheduleUseCase.updateSchedule(
      parseInt(id, 10),
      updates
    );

    if (!updatedSchedule) {
      throw new NotFoundError("Schedule not found");
    }

    res.json(updatedSchedule);
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    const userRole = (req.session as any).userRole;

    if (userRole !== "admin") {
      throw new UnauthorizedError("Forbidden");
    }

    await this.scheduleUseCase.deleteSchedule(parseInt(id, 10));

    res.json({ message: "Schedule deleted" });
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;

    const schedule = await this.scheduleUseCase.getScheduleById(parseInt(id, 10));

    if (!schedule) {
      throw new NotFoundError("Schedule not found");
    }

    res.json(schedule);
  }

  async getByTeacher(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { teacherId } = req.params;

    const schedules = await this.scheduleUseCase.getSchedulesByTeacher(
      parseInt(teacherId, 10)
    );

    res.json(schedules);
  }

  async getMySchedules(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = (req.session as any).userId;
    const userRole = (req.session as any).userRole;

    const schedules = await this.scheduleUseCase.getMySchedules(userId, userRole);

    res.json(schedules);
  }

  async checkConflict(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { teacherId, day, startTime, endTime, classId } = req.body;
    const excludeId = req.body.excludeId ? parseInt(req.body.excludeId, 10) : undefined;

    const hasConflict = await this.scheduleUseCase.validateScheduleConflict(
      teacherId,
      day,
      startTime,
      endTime,
      excludeId,
      classId
    );

    res.json({ hasConflict });
  }
}
