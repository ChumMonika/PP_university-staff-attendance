import type { Request, Response, NextFunction } from "express";
import { AuthUseCase } from "../../core/use-cases/AuthUseCase";
import { loginSchema } from "@shared/schema";
import type IStorage from "../../core/interfaces/IStorage";

export class AuthController {
  constructor(
    private authUseCase: AuthUseCase,
    private storage?: IStorage
  ) {}

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.body || !req.body.uniqueId || !req.body.password) {
      res.status(400).json({
        message: "Missing required fields",
      });
      return;
    }

    const { uniqueId, password } = loginSchema.parse(req.body);

    const result = await this.authUseCase.login(uniqueId, password);

    // Set session
    (req.session as any).userId = result.id;
    (req.session as any).userRole = result.role;

    res.json(result);
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: "Could not log out" });
        return;
      }
      res.json({ message: "Logged out successfully" });
    });
  }

  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!this.storage) {
        res.status(500).json({ message: "Storage not configured" });
        return;
      }

      const user = await this.storage.getUser((req.session as any).userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  }
}
