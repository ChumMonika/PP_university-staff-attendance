import { eq, and, gte, lt, lte, desc } from "drizzle-orm";
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
    // Normalize to a day range to avoid timezone equality issues
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return await this.db
      .select()
      .from(attendance)
      .where(and(gte(attendance.date, start), lt(attendance.date, end)))
      .orderBy(attendance.userId);
  }

  async findByUserAndDate(userId: number, date: string): Promise<Attendance | undefined> {
    // Some databases / drivers return Date objects with timezone offsets when
    // comparing directly which can cause equality checks to fail. To be robust
    // we fetch recent attendance for the user and compare the date portion in
    // JavaScript using YYYY-MM-DD strings.
    const rows = await this.db
      .select()
      .from(attendance)
      .where(eq(attendance.userId, userId))
      .orderBy(desc(attendance.date))
      .limit(10);

    for (const r of rows) {
      const rowDate = r.date instanceof Date ? r.date.toISOString().split('T')[0] : String(r.date).split('T')[0];
      if (rowDate === date) return r;
    }

    return undefined;
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
    // Check if attendance already exists for this user and date
    const dateStr = attendanceData.date instanceof Date 
      ? attendanceData.date.toISOString().split('T')[0] 
      : attendanceData.date;
    const existing = await this.findByUserAndDate(attendanceData.userId, dateStr);
    
    if (existing) {
      // Update existing attendance record
      const updated = await this.update(existing.id, {
        status: attendanceData.status,
        isLate: attendanceData.isLate,
        scheduleId: attendanceData.scheduleId,
        notes: attendanceData.notes,
        markedAt: attendanceData.markedAt,
        markedBy: attendanceData.markedBy,
      });
      if (!updated) {
        throw new Error("Failed to update attendance record");
      }
      return updated;
    }
    // Create new attendance record if it doesn't exist
    return await this.create(attendanceData);
  }
}