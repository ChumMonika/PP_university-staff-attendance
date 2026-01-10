import {
  users,
  attendance,
  leaveRequests,
  schedules,
  departments,
  majors,
  classes,
  subjects,
  type User,
  type InsertUser,
  type Attendance,
  type InsertAttendance,
  type LeaveRequest,
  type InsertLeaveRequest,
  type Schedule,
  type InsertSchedule,
  type Department,
  type InsertDepartment,
  type Major,
  type InsertMajor,
  type Class,
  type InsertClass,
  type Subject,
  type InsertSubject,
} from "@shared/schema";

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2";
import { eq, and, or, desc, ne, not, isNull } from "drizzle-orm";
import IStorage, { type ClassModerator, type InsertClassModerator } from "../../core/interfaces/IStorage";
import {
  UserRepository,
  AttendanceRepository,
  DepartmentRepository,
  type IUserRepository,
  type IAttendanceRepository,
  type IDepartmentRepository
} from "./repositories";

/* =======================
   Re-export types & interface
   ======================= */

export type { ClassModerator, InsertClassModerator };
export { type default as IStorage } from "../../core/interfaces/IStorage";


/* =======================
   MySQL Storage
   ======================= */

export class MySQLStorage implements IStorage {
  private db: any;
  private userRepository: IUserRepository;
  private attendanceRepository: IAttendanceRepository;
  private departmentRepository: IDepartmentRepository;

  constructor() {
    // Validate required environment variables
    if (!process.env.MYSQL_PASSWORD) {
      throw new Error("MYSQL_PASSWORD environment variable is required");
    }
    
    const pool = mysql.createPool({
      host: process.env.MYSQL_HOST || "localhost",
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD,
      database:
        process.env.MYSQL_DATABASE || "university_staff_tracker",
      connectionLimit: 10,
    });

    this.db = drizzle(pool);
    console.log("🔌 MySQL connected");

    // Initialize repositories
    this.userRepository = new UserRepository(this.db);
    this.attendanceRepository = new AttendanceRepository(this.db);
    this.departmentRepository = new DepartmentRepository(this.db);
  }

  /* ========= Users ========= */

  async getUser(id: number) {
    return this.userRepository.findById(id);
  }

  async getUserWithDepartment(id: number) {
    return this.userRepository.findByIdWithDepartment(id);
  }

  async getUserByUniqueId(uniqueId: string) {
    return this.userRepository.findByUniqueId(uniqueId);
  }

  async getUserById(id: number) {
    return this.userRepository.findById(id);
  }

  async getAllUsers() {
    return this.userRepository.findAll();
  }

  async createUser(user: InsertUser) {
    const now = new Date();
    return this.userRepository.create({
      ...user,
      createdAt: now,
      updatedAt: now,
    });
  }

  async updateUser(id: number, updates: Partial<User>) {
    return this.userRepository.updateUser(id, updates);
  }

  async deleteUser(id: number) {
    const result = await this.db.delete(users).where(eq(users.id, id));
    return (result as any).affectedRows > 0;
  }

  /* ========= Attendance ========= */

  async getAttendance(userId: number) {
    return this.attendanceRepository.findByUserId(userId);
  }

  async getAllAttendance() {
    return this.attendanceRepository.findAll();
  }

  async getAttendanceByDate(date: string) {
    return this.attendanceRepository.findByDate(date);
  }

  async getAttendanceByDepartment(departmentId: number) {
    return this.attendanceRepository.findByDepartment(departmentId);
  }

  async getDepartmentSummary() {
    const usersList = await this.getAllUsers();
    const attendanceList = await this.getAllAttendance();
    const today = new Date().toISOString().split("T")[0];

    const map = new Map<number, any>();

    usersList.forEach((u: any) => {
      if (u.departmentId && !map.has(u.departmentId)) {
        map.set(u.departmentId, {
          departmentId: u.departmentId,
          total: 0,
          present: 0,
          absent: 0,
          leave: 0,
        });
      }
    });

    usersList.forEach((u: any) => {
      if (u.departmentId) map.get(u.departmentId).total++;
    });

    attendanceList
      .filter((a: any) => a.date.toISOString().split("T")[0] === today)
      .forEach((a: any) => {
        const user = usersList.find((u: any) => u.id === a.userId);
        if (!user?.departmentId) return;
        const d = map.get(user.departmentId);
        if (a.status === "present") d.present++;
        if (a.status === "absent") d.absent++;
        if (a.status === "leave") d.leave++;
      });

    return Array.from(map.values());
  }

  async markAttendance(data: InsertAttendance) {
    return this.attendanceRepository.markAttendance(data);
  }

  /* ========= Leave ========= */

  async getLeaveRequests(userId?: number) {
    if (userId) {
      return this.db
        .select()
        .from(leaveRequests)
        .where(eq(leaveRequests.userId, userId));
    }
    return this.db
      .select()
      .from(leaveRequests)
      .orderBy(desc(leaveRequests.submittedAt));
  }

  async getPendingLeaveRequests() {
    return this.db
      .select()
      .from(leaveRequests)
      .where(eq(leaveRequests.status, "pending"));
  }

  async createLeaveRequest(data: InsertLeaveRequest): Promise<LeaveRequest> {
    const result = await this.db.insert(leaveRequests).values({
      ...data,
      status: "pending",
      submittedAt: new Date(),
    });
    const inserted = await this.db
      .select()
      .from(leaveRequests)
      .where(eq(leaveRequests.id, result[0].insertId))
      .limit(1);
    return inserted[0];
  }

  async updateLeaveRequest(id: number, updates: Partial<LeaveRequest>): Promise<LeaveRequest | undefined> {
    await this.db
      .update(leaveRequests)
      .set(updates)
      .where(eq(leaveRequests.id, id));
    const result = await this.db
      .select()
      .from(leaveRequests)
      .where(eq(leaveRequests.id, id))
      .limit(1);
    return result[0];
  }

  /* ========= Schedule ========= */

  async getAllSchedules() {
    return this.db.select().from(schedules);
  }

  async getSchedulesByDay(day: string) {
    return this.db
      .select()
      .from(schedules)
      .where(eq(schedules.day, day));
  }

  async getSchedulesByTeacher(teacherId: number) {
    return this.db
      .select()
      .from(schedules)
      .where(eq(schedules.teacherId, teacherId));
  }

  async getSchedulesByMajor(major: string) {
    return this.db
      .select()
      .from(schedules)
      .innerJoin(classes, eq(schedules.classId, classes.id))
      .innerJoin(majors, eq(classes.majorId, majors.id))
      .where(eq(majors.shortName, major));
  }

  async getSchedulesByClass(classId: number) {
    return this.db
      .select()
      .from(schedules)
      .where(eq(schedules.classId, classId));
  }

  async createSchedule(data: InsertSchedule) {
    const now = new Date();
    const result = await this.db.insert(schedules).values({
      ...data,
      createdAt: now,
      updatedAt: now,
    });
    return this.getScheduleById(result[0].insertId);
  }

  async createBulkSchedules(list: InsertSchedule[]) {
    const created: Schedule[] = [];
    for (const s of list) {
      created.push(await this.createSchedule(s));
    }
    return created;
  }

  async validateScheduleConflict(
    teacherId: number,
    day: string,
    startTime: string,
    endTime: string,
    excludeId?: number,
    classId?: number
  ) {
    const rows = await this.db
      .select()
      .from(schedules)
      .where(
        and(
          eq(schedules.teacherId, teacherId),
          eq(schedules.day, day),
          excludeId ? ne(schedules.id, excludeId) : undefined
        )
      );

    for (const r of rows) {
      if (
        startTime < r.endTime &&
        endTime > r.startTime
      ) {
        return {
          hasConflict: true,
          type: "teacher",
          details: "Teacher time overlap",
        };
      }
    }

    return { hasConflict: false };
  }

  async updateSchedule(id: number, updates: Partial<Schedule>) {
    console.log('MySQLStorage.updateSchedule called with:', { id, updates });

    try {
      await this.db
        .update(schedules)
        .set(updates)
        .where(eq(schedules.id, id));

      console.log('Update query executed successfully');

      const result = await this.getScheduleById(id);
      console.log('getScheduleById result:', result);

      return result;
    } catch (error) {
      console.error('Error in updateSchedule:', error);
      throw error;
    }
  }

  async deleteSchedule(id: number) {
    const result = await this.db
      .delete(schedules)
      .where(eq(schedules.id, id));
    return (result as any).affectedRows > 0;
  }

  async getScheduleById(id: number) {
    const result = await this.db
      .select()
      .from(schedules)
      .where(eq(schedules.id, id))
      .limit(1);
    return result[0];
  }

  /* ========= Departments / Majors / Classes / Subjects ========= */

  getAllDepartments() {
    return this.departmentRepository.findAll();
  }

  async getDepartment(id: number): Promise<Department | undefined> {
    return this.departmentRepository.findById(id);
  }

  async createDepartment(d: InsertDepartment): Promise<Department> {
    const now = new Date();
    return this.departmentRepository.create({
      ...d,
      createdAt: now,
      updatedAt: now,
    });
  }

  async updateDepartment(id: number, u: Partial<InsertDepartment>): Promise<Department | undefined> {
    return this.departmentRepository.updateDepartment(id, u);
  }

  async deleteDepartment(id: number): Promise<boolean> {
    return this.departmentRepository.delete(id);
  }

  getAllMajors() {
    return this.db.select().from(majors);
  }

  async getMajor(id: number): Promise<Major | undefined> {
    const result = await this.db
      .select()
      .from(majors)
      .where(eq(majors.id, id))
      .limit(1);
    return result[0];
  }

  getMajorsByDepartment(deptId: number) {
    return this.db
      .select()
      .from(majors)
      .where(eq(majors.departmentId, deptId));
  }

  async createMajor(m: InsertMajor): Promise<Major> {
    const now = new Date();
    const result = await this.db.insert(majors).values({
      ...m,
      createdAt: now,
      updatedAt: now,
    });
    const created = await this.getMajor(result[0].insertId);
    if (!created) throw new Error("Failed to create major");
    return created;
  }

  async updateMajor(id: number, u: Partial<InsertMajor>): Promise<Major | undefined> {
    await this.db.update(majors).set(u).where(eq(majors.id, id));
    return this.getMajor(id);
  }

  deleteMajor(id: number) {
    return this.db.delete(majors).where(eq(majors.id, id));
  }

  getAllClasses() {
    return this.db.select().from(classes);
  }

  async getClass(id: number): Promise<Class | undefined> {
    const result = await this.db
      .select()
      .from(classes)
      .where(eq(classes.id, id))
      .limit(1);
    return result[0];
  }

  getClassesByMajors(ids: number[]) {
    if (!ids.length) return [];
    return this.db.select().from(classes).where(or(...ids.map(i => eq(classes.majorId, i))));
  }

  async createClass(c: InsertClass & { name: string }): Promise<Class> {
    const now = new Date();
    const result = await this.db.insert(classes).values({
      ...c,
      createdAt: now,
      updatedAt: now,
    });
    const created = await this.getClass(result[0].insertId);
    if (!created) throw new Error("Failed to create class");
    return created;
  }

  async updateClass(id: number, u: Partial<InsertClass>): Promise<Class | undefined> {
    await this.db.update(classes).set(u).where(eq(classes.id, id));
    return this.getClass(id);
  }

  async deleteClass(id: number): Promise<boolean> {
    await this.db.delete(classes).where(eq(classes.id, id));
    return true;
  }

  getAllSubjects() {
    return this.db.select().from(subjects);
  }

  async getSubject(id: number): Promise<Subject | undefined> {
    const result = await this.db
      .select()
      .from(subjects)
      .where(eq(subjects.id, id))
      .limit(1);
    return result[0];
  }

  async createSubject(s: InsertSubject): Promise<Subject> {
    const now = new Date();
    const result = await this.db.insert(subjects).values({
      ...s,
      createdAt: now,
      updatedAt: now,
    });
    const created = await this.getSubject(result[0].insertId);
    if (!created) throw new Error("Failed to create subject");
    return created;
  }

  async updateSubject(id: number, u: Partial<InsertSubject>): Promise<Subject | undefined> {
    await this.db.update(subjects).set(u).where(eq(subjects.id, id));
    return this.getSubject(id);
  }

  async deleteSubject(id: number): Promise<boolean> {
    await this.db.delete(subjects).where(eq(subjects.id, id));
    return true;
  }

  /* ========= Class Moderators ========= */

  async createClassModerator(data: InsertClassModerator): Promise<ClassModerator> {
    await this.db
      .update(users)
      .set({ classId: data.classId, role: "class_moderator" })
      .where(eq(users.id, data.userId));

    const user = await this.getUserById(data.userId);
    if (!user || !user.classId) throw new Error("Assignment failed");

    return {
      userId: user.id,
      classId: user.classId,
      role: "class_moderator" as const,
      assignedAt: user.createdAt.toISOString(),
    };
  }

  async deleteClassModerator(userId: number) {
    const result = await this.db
      .update(users)
      .set({ classId: null })
      .where(eq(users.id, userId));
    return (result as any).affectedRows > 0;
  }

  async getAllClassModerators(): Promise<ClassModerator[]> {
    const rows = await this.db
      .select({
        id: users.id,
        userId: users.id,
        classId: users.classId,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(and(not(isNull(users.classId)), eq(users.role, "class_moderator")));

    return rows.map((u: any) => ({
      userId: u.userId,
      classId: u.classId,
      role: u.role,
      assignedAt: u.createdAt.toISOString(),
    }));
  }

  async getClassModeratorsByClass(classId: number): Promise<ClassModerator[]> {
    const all = await this.getAllClassModerators();
    return all.filter((m: any) => m.classId === classId);
  }

  async getClassModeratorsByUser(userId: number): Promise<ClassModerator[]> {
    const all = await this.getAllClassModerators();
    return all.filter((m: any) => m.userId === userId);
  }
}

/* =======================
   Export singleton
   ======================= */

export const storage = new MySQLStorage();
