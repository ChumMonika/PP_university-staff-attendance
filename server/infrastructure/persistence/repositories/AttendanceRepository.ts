import { eq, and, gte, lte, desc } from "drizzle-orm";
import { attendance, users, type Attendance, type InsertAttendance } from "@shared/schema";
import type { IAttendanceRepository } from "./interfaces";

export class AttendanceRepository implements IAttendanceRepository {
  constructor(private db: any) {}

  async findById(id: number): Promise<Attendance | undefined> {
    const result = await this.db.select().from(attendance).where(eq(attendance.id, id)).limit(1);
    return result[0];
  }

  async findAll(): Promise<Attendance[]> {
    return await this.db.select().from(attendance).orderBy(desc(attendance.date));
  }

  async create(attendanceData: InsertAttendance): Promise<Attendance> {
    const result = await this.db.insert(attendance).values(attendanceData).$returningId();
    const id = result[0].id;
    const created = await this.findById(id);
    if (!created) {
      throw new Error("Failed to create attendance record");
    }
    return created;
  }

  async update(id: number, updates: Partial<Attendance>): Promise<Attendance | undefined> {
    await this.db.update(attendance).set(updates).where(eq(attendance.id, id));
    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.delete(attendance).where(eq(attendance.id, id));
    return result.rowsAffected > 0;
  }

  async findByUserId(userId: number): Promise<Attendance[]> {
    return await this.db
      .select()
      .from(attendance)
      .where(eq(attendance.userId, userId))
      .orderBy(desc(attendance.date));
  }

  async findByDate(date: string): Promise<Attendance[]> {
    const dateObj = new Date(date);
    return await this.db
      .select()
      .from(attendance)
      .where(eq(attendance.date, dateObj))
      .orderBy(attendance.userId);
  }

  async findByUserAndDate(userId: number, date: string): Promise<Attendance | undefined> {
    const dateObj = new Date(date);
    const result = await this.db
      .select()
      .from(attendance)
      .where(and(eq(attendance.userId, userId), eq(attendance.date, dateObj)))
      .limit(1);
    return result[0];
  }

  async findByDepartment(departmentId: number): Promise<Attendance[]> {
    return await this.db
      .select({
        id: attendance.id,
        userId: attendance.userId,
        date: attendance.date,
        status: attendance.status,
        isLate: attendance.isLate,
        scheduleId: attendance.scheduleId,
        notes: attendance.notes,
        markedAt: attendance.markedAt,
        markedBy: attendance.markedBy,
      })
      .from(attendance)
      .innerJoin(users, eq(attendance.userId, users.id))
      .where(eq(users.departmentId, departmentId))
      .orderBy(desc(attendance.date));
  }

  async findByDateRange(startDate: string, endDate: string): Promise<Attendance[]> {
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    return await this.db
      .select()
      .from(attendance)
      .where(and(gte(attendance.date, startDateObj), lte(attendance.date, endDateObj)))
      .orderBy(desc(attendance.date));
  }

  async markAttendance(attendanceData: InsertAttendance): Promise<Attendance> {
    return await this.create(attendanceData);
  }
}