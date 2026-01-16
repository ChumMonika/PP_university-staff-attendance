// server/infrastructure/persistence/repositories/UserRepository.ts

import { eq, sql } from "drizzle-orm";
import {
  users,
  departments,
  type User,
  type InsertUser,
} from "@shared/schema";
import type { IUserRepository, UserWithDepartment } from "../../../domain/repositories/IUserRepository";

export class UserRepository implements IUserRepository {
  constructor(private db: any) {}

  async findById(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async findByIdWithDepartment(id: number): Promise<UserWithDepartment | undefined> {
    const result = await this.db
      .select({
        id: users.id,
        uniqueId: users.uniqueId,
        name: users.name,
        email: users.email,
        password: users.password,
        role: users.role,
        status: users.status,
        departmentId: users.departmentId,
        classId: users.classId,
        workType: users.workType,
        schedule: users.schedule,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        department: {
          id: departments.id,
          name: departments.name,
        },
      })
      .from(users)
      .leftJoin(departments, eq(users.departmentId, departments.id))
      .where(eq(users.id, id))
      .limit(1);

    return result[0] ?? undefined;
  }

  async findAll(): Promise<User[]> {
    return await this.db.select().from(users);
  }

  async create(user: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(user).$returningId();
    const id = result[0].id;
    const created = await this.findById(id);
    if (!created) {
      throw new Error("Failed to create user");
    }
    return created;
  }

  async update(id: number, updates: Partial<User>): Promise<User | undefined> {
    await this.db.update(users).set(updates).where(eq(users.id, id));
    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.delete(users).where(eq(users.id, id));
    return result.rowsAffected > 0;
  }

  async findByUniqueId(uniqueId: string): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(sql`LOWER(${users.uniqueId}) = LOWER(${uniqueId})`)
      .limit(1);
    return result[0];
  }

  async findByRole(role: string): Promise<User[]> {
    return await this.db.select().from(users).where(eq(users.role, role as any));
  }

  async findByDepartment(departmentId: number): Promise<User[]> {
    return await this.db.select().from(users).where(eq(users.departmentId, departmentId));
  }

  async findByClass(classId: number): Promise<User[]> {
    return await this.db.select().from(users).where(eq(users.classId, classId));
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    return await this.update(id, updates);
  }
}
