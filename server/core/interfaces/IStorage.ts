import type {
  User,
  InsertUser,
  Attendance,
  InsertAttendance,
  LeaveRequest,
  InsertLeaveRequest,
  Schedule,
  InsertSchedule,
  Department,
  InsertDepartment,
  Major,
  InsertMajor,
  Class,
  InsertClass,
  Subject,
  InsertSubject,
} from "@shared/schema";

export interface ClassModerator {
  userId: number;
  classId: number;
  role: "class_moderator" | "moderator";
  assignedAt: string;
}

export interface InsertClassModerator {
  userId: number;
  classId: number;
}

export default interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserWithDepartment(id: number): Promise<any>;
  getUserByUniqueId(uniqueId: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;

  // Attendance
  getAttendance(userId: number): Promise<Attendance[]>;
  getAllAttendance(): Promise<Attendance[]>;
  getAttendanceByDate(date: string): Promise<Attendance[]>;
  getAttendanceByDepartment(departmentId: number): Promise<Attendance[]>;
  getDepartmentSummary(): Promise<any>;
  markAttendance(attendance: InsertAttendance): Promise<Attendance>;

  // Leave
  getLeaveRequests(userId?: number): Promise<LeaveRequest[]>;
  getPendingLeaveRequests(): Promise<LeaveRequest[]>;
  createLeaveRequest(request: InsertLeaveRequest): Promise<LeaveRequest>;
  updateLeaveRequest(
    id: number,
    updates: Partial<LeaveRequest>
  ): Promise<LeaveRequest | undefined>;

  // Schedule
  getAllSchedules(): Promise<Schedule[]>;
  getSchedulesByDay(day: string): Promise<Schedule[]>;
  getSchedulesByTeacher(teacherId: number): Promise<Schedule[]>;
  getSchedulesByMajor(major: string): Promise<Schedule[]>;
  getSchedulesByClass(classId: number): Promise<Schedule[]>;
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
  createBulkSchedules(schedules: InsertSchedule[]): Promise<Schedule[]>;
  validateScheduleConflict(
    teacherId: number,
    day: string,
    startTime: string,
    endTime: string,
    excludeId?: number,
    classId?: number
  ): Promise<{ hasConflict: boolean; type?: string; details?: string }>;
  updateSchedule(
    id: number,
    updates: Partial<Schedule>
  ): Promise<Schedule | undefined>;
  deleteSchedule(id: number): Promise<boolean>;
  getScheduleById(id: number): Promise<Schedule | undefined>;

  // Departments
  getAllDepartments(): Promise<Department[]>;
  getDepartment(id: number): Promise<Department | undefined>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  updateDepartment(
    id: number,
    updates: Partial<InsertDepartment>
  ): Promise<Department | undefined>;
  deleteDepartment(id: number): Promise<boolean>;

  // Majors
  getAllMajors(): Promise<Major[]>;
  getMajor(id: number): Promise<Major | undefined>;
  getMajorsByDepartment(departmentId: number): Promise<Major[]>;
  createMajor(major: InsertMajor): Promise<Major>;
  updateMajor(id: number, updates: Partial<InsertMajor>): Promise<Major | undefined>;
  deleteMajor(id: number): Promise<boolean>;

  // Classes
  getAllClasses(): Promise<Class[]>;
  getClass(id: number): Promise<Class | undefined>;
  getClassesByMajors(majorIds: number[]): Promise<Class[]>;
  createClass(classData: InsertClass & { name: string }): Promise<Class>;
  updateClass(id: number, updates: Partial<InsertClass>): Promise<Class | undefined>;
  deleteClass(id: number): Promise<boolean>;

  // Subjects
  getAllSubjects(): Promise<Subject[]>;
  getSubject(id: number): Promise<Subject | undefined>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  updateSubject(
    id: number,
    updates: Partial<InsertSubject>
  ): Promise<Subject | undefined>;
  deleteSubject(id: number): Promise<boolean>;

  // Class Moderators
  getAllClassModerators(): Promise<ClassModerator[]>;
  getClassModeratorsByClass(classId: number): Promise<ClassModerator[]>;
  getClassModeratorsByUser(userId: number): Promise<ClassModerator[]>;
  createClassModerator(
    moderator: InsertClassModerator
  ): Promise<ClassModerator>;
  deleteClassModerator(userId: number): Promise<boolean>;
}
