import type { Request, Response, NextFunction } from "express";
import { UserUseCase } from "../../core/use-cases/UserUseCase";
import { insertUserSchema } from "@shared/schema";
import { UnauthorizedError, NotFoundError } from "../../core/errors";

export class UserController {
  constructor(private userUseCase: UserUseCase) {}

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userRole = (req.session as any).userRole;
    const currentUserId = (req.session as any).userId;

    console.log("📋 [Users API] Request from:", { userId: currentUserId, role: userRole });

    const users = await this.userUseCase.getAllUsers(currentUserId, userRole);

    console.log("📤 [Response] Sending users:", users.length);
    res.json(users);
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userRole = (req.session as any).userRole;

    if (userRole !== "admin") {
      throw new UnauthorizedError("Forbidden");
    }

    const userData = insertUserSchema.parse(req.body);

    const user = await this.userUseCase.createUser(userData as any);
    res.json(user);
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userRole = (req.session as any).userRole;

    if (userRole !== "admin") {
      throw new UnauthorizedError("Forbidden");
    }

    const userId = parseInt(req.params.id);
    const updates = req.body;

    const updatedUser = await this.userUseCase.updateUser(userId, updates);

    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }

    res.json(updatedUser);
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userRole = (req.session as any).userRole;

    if (userRole !== "admin") {
      throw new UnauthorizedError("Forbidden");
    }

    const userId = parseInt(req.params.id);

    await this.userUseCase.deleteUser(userId);
    res.json({ message: "User deleted successfully" });
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userRole = (req.session as any).userRole;

    if (userRole !== "admin") {
      throw new UnauthorizedError("Forbidden");
    }

    const userId = parseInt(req.params.id);
    const { newPassword } = req.body;

    await this.userUseCase.resetPassword(userId, newPassword);
    res.json({ message: "Password reset successfully" });
  }
}
