import type { Request, Response, NextFunction } from "express";
import { ClassUseCase } from "../../core/use-cases/ClassUseCase";
import { insertClassSchema } from "@shared/schema";
import { UnauthorizedError, NotFoundError } from "../../core/errors/AppError";

export class ClassController {
  constructor(private classUseCase: ClassUseCase) {}

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = (req.session as any).userId;
    const userRole = (req.session as any).userRole;

    const classes = await this.classUseCase.getAllClasses(userId, userRole);
    res.json(classes);
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const classData = insertClassSchema.parse(req.body);
    const userRole = (req.session as any).userRole;

    if (userRole !== "admin") {
      throw new UnauthorizedError("Forbidden");
    }

    const newClass = await this.classUseCase.createClass(classData as any);
    res.json(newClass);
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    const updates = insertClassSchema.partial().parse(req.body);
    const userRole = (req.session as any).userRole;

    if (userRole !== "admin") {
      throw new UnauthorizedError("Forbidden");
    }

    const updatedClass = await this.classUseCase.updateClass(parseInt(id, 10), updates as any);

    if (!updatedClass) {
      throw new NotFoundError("Class not found");
    }

    res.json(updatedClass);
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    const userRole = (req.session as any).userRole;

    if (userRole !== "admin") {
      throw new UnauthorizedError("Forbidden");
    }

    await this.classUseCase.deleteClass(parseInt(id, 10));
    res.json({ message: "Class deleted" });
  }
}
