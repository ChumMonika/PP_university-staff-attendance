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

export interface UserDepartment {
  id: number;
  name: string;
}

export interface UserWithDepartment extends User {
  department: UserDepartment | null;
}

// ========================================
// BASE REPOSITORY INTERFACE
// ========================================

export interface IBaseRepository<T, TInsert = Partial<T>> {
  findById(id: number): Promise<T | undefined>;
  findAll(): Promise<T[]>;
  create(entity: TInsert): Promise<T>;
  update(id: number, updates: Partial<T>): Promise<T | undefined>;
  delete(id: number): Promise<boolean>;
}

// ========================================
// USER REPOSITORY
// ========================================

export interface IUserRepository extends IBaseRepository<User, InsertUser> {
  findByIdWithDepartment(id: number): Promise<UserWithDepartment | undefined>;
  findByUniqueId(uniqueId: string): Promise<User | undefined>;
  findByRole(role: string): Promise<User[]>;
  findByDepartment(departmentId: number): Promise<User[]>;
  findByClass(classId: number): Promise<User[]>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
}

// ========================================
// ATTENDANCE REPOSITORY
// ========================================

export interface IAttendanceRepository extends IBaseRepository<Attendance, InsertAttendance> {
  findByUserId(userId: number): Promise<Attendance[]>;
  findByDate(date: string): Promise<Attendance[]>;
  findByUserAndDate(userId: number, date: string): Promise<Attendance | undefined>;
  findByDepartment(departmentId: number): Promise<Attendance[]>;
  findByDateRange(startDate: string, endDate: string): Promise<Attendance[]>;
  markAttendance(attendance: InsertAttendance): Promise<Attendance>;
}

// ========================================
// LEAVE REQUEST REPOSITORY
// ========================================

export interface ILeaveRequestRepository extends IBaseRepository<LeaveRequest, InsertLeaveRequest> {
  findByUserId(userId: number): Promise<LeaveRequest[]>;
  findPending(): Promise<LeaveRequest[]>;
  findByStatus(status: string): Promise<LeaveRequest[]>;
  updateStatus(id: number, status: string, respondedBy?: number, rejectionReason?: string): Promise<LeaveRequest | undefined>;
}

// ========================================
// SCHEDULE REPOSITORY
// ========================================

export interface IScheduleRepository extends IBaseRepository<Schedule, InsertSchedule> {
  findByDay(day: string): Promise<Schedule[]>;
  findByTeacher(teacherId: number): Promise<Schedule[]>;
  findByClass(classId: number): Promise<Schedule[]>;
  findBySubject(subjectId: number): Promise<Schedule[]>;
  createBulk(schedules: InsertSchedule[]): Promise<Schedule[]>;
  checkConflict(
    teacherId: number,
    day: string,
    startTime: string,
    endTime: string,
    excludeId?: number,
    classId?: number
  ): Promise<{ hasConflict: boolean; type?: string; details?: string }>;
}

// ========================================
// DEPARTMENT REPOSITORY
// ========================================

export interface IDepartmentRepository extends IBaseRepository<Department, InsertDepartment> {
  findByName(name: string): Promise<Department | undefined>;
  updateDepartment(id: number, updates: Partial<InsertDepartment>): Promise<Department | undefined>;
}

// ========================================
// MAJOR REPOSITORY
// ========================================

export interface IMajorRepository extends IBaseRepository<Major, InsertMajor> {
  findByDepartment(departmentId: number): Promise<Major[]>;
  findByName(name: string): Promise<Major | undefined>;
  updateMajor(id: number, updates: Partial<InsertMajor>): Promise<Major | undefined>;
}

// ========================================
// CLASS REPOSITORY
// ========================================

export interface IClassRepository extends IBaseRepository<Class, InsertClass & { name: string }> {
  findByMajor(majorId: number): Promise<Class[]>;
  findByMajors(majorIds: number[]): Promise<Class[]>;
  findByYearAndSemester(year: number, semester: number): Promise<Class[]>;
  findActive(): Promise<Class[]>;
  updateClass(id: number, updates: Partial<InsertClass>): Promise<Class | undefined>;
}

// ========================================
// SUBJECT REPOSITORY
// ========================================

export interface ISubjectRepository extends IBaseRepository<Subject, InsertSubject> {
  findByCode(code: string): Promise<Subject | undefined>;
  findByName(name: string): Promise<Subject | undefined>;
  updateSubject(id: number, updates: Partial<InsertSubject>): Promise<Subject | undefined>;
}

// ========================================
// CLASS MODERATOR REPOSITORY
// ========================================

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

export interface IClassModeratorRepository {
  findAll(): Promise<ClassModerator[]>;
  findByClass(classId: number): Promise<ClassModerator[]>;
  findByUser(userId: number): Promise<ClassModerator[]>;
  create(moderator: InsertClassModerator): Promise<ClassModerator>;
  delete(userId: number): Promise<boolean>;
}