import type { Request, Response, NextFunction } from "express";
import { ConfigUseCase } from "../../core/use-cases/ConfigUseCase";
import {
  insertDepartmentSchema,
  insertMajorSchema,
  insertSubjectSchema,
} from "@shared/schema";
import { UnauthorizedError, NotFoundError } from "../../core/errors";

export class ConfigController {
  constructor(private configUseCase: ConfigUseCase) {}

  // Department methods
  async getDepartments(req: Request, res: Response, next: NextFunction): Promise<void> {
    const departments = await this.configUseCase.getDepartments();
    res.json(departments);
  }

  async createDepartment(req: Request, res: Response, next: NextFunction): Promise<void> {
    const departmentData = insertDepartmentSchema.parse(req.body);
    const userRole = (req.session as any).userRole;

    if (userRole !== "admin") {
      throw new UnauthorizedError("Forbidden");
    }

    const newDepartment = await this.configUseCase.createDepartment(departmentData);
    res.json(newDepartment);
  }

  async updateDepartment(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    const updates = insertDepartmentSchema.partial().parse(req.body);
    const userRole = (req.session as any).userRole;

    if (userRole !== "admin") {
      throw new UnauthorizedError("Forbidden");
    }

    const updatedDepartment = await this.configUseCase.updateDepartment(
      parseInt(id, 10),
      updates
    );

    if (!updatedDepartment) {
      throw new NotFoundError("Department not found");
    }

    res.json(updatedDepartment);
  }

  async deleteDepartment(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    const userRole = (req.session as any).userRole;

    if (userRole !== "admin") {
      throw new UnauthorizedError("Forbidden");
    }

    await this.configUseCase.deleteDepartment(parseInt(id, 10));

    res.json({ message: "Department deleted" });
  }

  // Major methods
  async getMajors(req: Request, res: Response, next: NextFunction): Promise<void> {
    const majors = await this.configUseCase.getMajors();
    res.json(majors);
  }

  async getMajorsByDepartment(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { departmentId } = req.params;

    const majors = await this.configUseCase.getMajorsByDepartment(
      parseInt(departmentId, 10)
    );

    res.json(majors);
  }

  async createMajor(req: Request, res: Response, next: NextFunction): Promise<void> {
    const majorData = insertMajorSchema.parse(req.body);
    const userRole = (req.session as any).userRole;

    if (userRole !== "admin") {
      throw new UnauthorizedError("Forbidden");
    }

    const newMajor = await this.configUseCase.createMajor(majorData);
    res.json(newMajor);
  }

  async updateMajor(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    const updates = insertMajorSchema.partial().parse(req.body);
    const userRole = (req.session as any).userRole;

    if (userRole !== "admin") {
      throw new UnauthorizedError("Forbidden");
    }

    const updatedMajor = await this.configUseCase.updateMajor(parseInt(id, 10), updates);

    if (!updatedMajor) {
      throw new NotFoundError("Major not found");
    }

    res.json(updatedMajor);
  }

  async deleteMajor(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    const userRole = (req.session as any).userRole;

    if (userRole !== "admin") {
      throw new UnauthorizedError("Forbidden");
    }

    await this.configUseCase.deleteMajor(parseInt(id, 10));

    res.json({ message: "Major deleted" });
  }

  // Subject methods
  async getSubjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    const subjects = await this.configUseCase.getSubjects();
    res.json(subjects);
  }

  async createSubject(req: Request, res: Response, next: NextFunction): Promise<void> {
    const subjectData = insertSubjectSchema.parse(req.body);
    const userRole = (req.session as any).userRole;

    if (userRole !== "admin") {
      throw new UnauthorizedError("Forbidden");
    }

    const newSubject = await this.configUseCase.createSubject(subjectData);
    res.json(newSubject);
  }

  async updateSubject(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    const updates = insertSubjectSchema.partial().parse(req.body);
    const userRole = (req.session as any).userRole;

    if (userRole !== "admin") {
      throw new UnauthorizedError("Forbidden");
    }

    const updatedSubject = await this.configUseCase.updateSubject(
      parseInt(id, 10),
      updates
    );

    if (!updatedSubject) {
      throw new NotFoundError("Subject not found");
    }

    res.json(updatedSubject);
  }

  async deleteSubject(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    const userRole = (req.session as any).userRole;

    if (userRole !== "admin") {
      throw new UnauthorizedError("Forbidden");
    }

    await this.configUseCase.deleteSubject(parseInt(id, 10));

    res.json({ message: "Subject deleted" });
  }
}
