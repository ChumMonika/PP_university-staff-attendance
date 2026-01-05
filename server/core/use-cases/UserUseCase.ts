import bcrypt from "bcrypt";
import IStorage from "../interfaces/IStorage";
import type { User, InsertUser } from "@shared/schema";
import { UnauthorizedError, NotFoundError, ValidationError } from "../errors";

export interface UserResponse extends Omit<User, "password"> {}

export class UserUseCase {
  constructor(private storage: IStorage) {}

  async getAllUsers(currentUserId: number, userRole: string): Promise<User[]> {
    if (userRole === "admin") {
      return await this.storage.getAllUsers();
    } else if (userRole === "head") {
      const currentUser = await this.storage.getUser(currentUserId);

      if (currentUser?.departmentId) {
        const allUsers = await this.storage.getAllUsers();
        return allUsers.filter((u) => u.departmentId === currentUser.departmentId);
      } else {
        return [];
      }
    } else {
      throw new UnauthorizedError("Unauthorized");
    }
  }

  async createUser(userData: InsertUser): Promise<UserResponse> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const userDataWithHashedPassword = {
      ...userData,
      password: hashedPassword,
    };

    const user = await this.storage.createUser(userDataWithHashedPassword);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUser(userId: number, updates: Partial<User>): Promise<UserResponse> {
    let finalUpdates = updates;

    if (updates.password) {
      const hashedPassword = await bcrypt.hash(updates.password, 10);
      finalUpdates = {
        ...updates,
        password: hashedPassword,
      };
    }

    const updatedUser = await this.storage.updateUser(userId, finalUpdates);
    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async deleteUser(userId: number): Promise<void> {
    const deleted = await this.storage.deleteUser(userId);

    if (!deleted) {
      throw new NotFoundError("User not found");
    }
  }

  async resetPassword(userId: number, newPassword: string): Promise<void> {
    if (!newPassword || newPassword.length < 6) {
      throw new ValidationError("Password must be at least 6 characters");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await this.storage.updateUser(userId, {
      password: hashedPassword,
    });

    if (!updatedUser) {
      throw new Error("User not found");
    }
  }
}
