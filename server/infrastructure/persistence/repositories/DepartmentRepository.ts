import { eq } from "drizzle-orm";
import { departments, type Department, type InsertDepartment } from "@shared/schema";
import type { IDepartmentRepository } from "./interfaces";

export class DepartmentRepository implements IDepartmentRepository {
  constructor(private db: any) {}

  async findById(id: number): Promise<Department | undefined> {
    const result = await this.db.select().from(departments).where(eq(departments.id, id)).limit(1);
    return result[0];
  }

  async findAll(): Promise<Department[]> {
    return await this.db.select().from(departments);
  }

  async create(department: InsertDepartment): Promise<Department> {
    const result = await this.db.insert(departments).values(department).$returningId();
    const id = result[0].id;
    const created = await this.findById(id);
    if (!created) {
      throw new Error("Failed to create department");
    }
    return created;
  }

  async update(id: number, updates: Partial<Department>): Promise<Department | undefined> {
    await this.db.update(departments).set(updates).where(eq(departments.id, id));
    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.delete(departments).where(eq(departments.id, id));
    return result.rowsAffected > 0;
  }

  async findByName(name: string): Promise<Department | undefined> {
    const result = await this.db.select().from(departments).where(eq(departments.name, name)).limit(1);
    return result[0];
  }

  async updateDepartment(id: number, updates: Partial<InsertDepartment>): Promise<Department | undefined> {
    await this.db.update(departments).set(updates).where(eq(departments.id, id));
    return await this.findById(id);
  }
}