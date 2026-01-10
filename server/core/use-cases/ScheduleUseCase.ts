import IStorage from "../interfaces/IStorage";
import type { Schedule, InsertSchedule, User, Subject, Class, Major } from "@shared/schema";
import { UnauthorizedError, NotFoundError } from "../errors";

export interface ScheduleWithEnrichment extends Schedule {
  teacher?: User | null;
  subject?: Subject;
  classLabel?: string;
  fullClassName?: string;
  displayClassName?: string;
  majorShort?: string;
  classInfo?: Class;
}

export class ScheduleUseCase {
  constructor(private storage: IStorage) {}

  async getAllSchedules(
    userId: number,
    userRole: string,
    filters?: { day?: string; major?: string }
  ): Promise<ScheduleWithEnrichment[]> {
    if (!["head", "admin", "mazer", "class_moderator", "moderator"].includes(userRole)) {
      throw new UnauthorizedError("Forbidden - Admin, Head, or Moderator access required");
    }

    const { day, major } = filters || {};
    let schedules;

    // Load all classes first (to check isActive)
    const allClasses = await this.storage.getAllClasses();
    const activeClassIds = allClasses.filter((cls) => cls.isActive === 1).map((cls) => cls.id);

    if (userRole === "class_moderator" || userRole === "moderator") {
      const assignedClasses = await this.storage.getClassModeratorsByUser(userId);
      const classIds = assignedClasses.map((cm) => cm.classId);

      if (classIds.length === 0) {
        return [];
      }

      const allSchedules = await this.storage.getAllSchedules();

      // Filter: Only schedules from assigned classes that are ACTIVE
      schedules = allSchedules.filter(
        (schedule) =>
          classIds.includes(schedule.classId) && activeClassIds.includes(schedule.classId)
      );

      if (day) {
        schedules = schedules.filter((schedule) => schedule.day === day);
      }
    } else {
      // For admin/head: Also filter by active classes
      if (day) {
        schedules = await this.storage.getSchedulesByDay(day);
      } else if (major) {
        schedules = await this.storage.getSchedulesByMajor(major);
      } else {
        schedules = await this.storage.getAllSchedules();
      }

      // Filter: Only active classes for admin/head too
      schedules = schedules.filter((schedule) => activeClassIds.includes(schedule.classId));
    }

    // Enrich with teacher/class/subject data
    const classes = await this.storage.getAllClasses();
    const majors = await this.storage.getAllMajors();
    const subjects = await this.storage.getAllSubjects();
    const classMap = new Map(classes.map((c) => [c.id, c]));
    const majorMap = new Map(majors.map((m) => [m.id, m]));
    const subjectMap = new Map(subjects.map((s) => [s.id, s]));

    const schedulesWithTeachers = await Promise.all(
      schedules.map(async (schedule) => {
        const teacher = await this.storage.getUser(schedule.teacherId);
        const classInfo = classMap.get(schedule.classId);
        const subject = subjectMap.get(schedule.subjectId);

        let classLabel = "Unknown Class";
        let fullClassName = "Unknown Class";
        let displayClassName = "Unknown Class";
        let majorShort = "Unknown";

        if (classInfo) {
          const major = majorMap.get(classInfo.majorId);
          majorShort = major?.shortName || major?.name || "Unknown";
          const majorFull = major?.name || "Unknown";
          const groupStr = (classInfo as any).group ? ` ${(classInfo as any).group}` : "";

          classLabel = `${majorShort} Y${classInfo.year}S${classInfo.semester}${groupStr}`;
          fullClassName = classLabel;

          const yearText = `Year ${classInfo.year}`;
          const semesterText = `Semester ${classInfo.semester}`;
          const groupText = (classInfo as any).group || "";
          displayClassName = `${majorFull} - ${yearText} - ${semesterText}${groupText ? " - Group " + groupText : ""}`;
        }

        return {
          ...schedule,
          teacher,
          subject,
          classLabel,
          fullClassName,
          displayClassName,
          majorShort,
          classInfo,
        };
      })
    );

    return schedulesWithTeachers;
  }

  async createSchedule(scheduleData: InsertSchedule): Promise<ScheduleWithEnrichment> {
    const schedule = await this.storage.createSchedule(scheduleData);
    const teacher = await this.storage.getUser(schedule.teacherId);

    return { ...schedule, teacher };
  }

  async createBulkSchedules(schedulesData: InsertSchedule[]): Promise<ScheduleWithEnrichment[]> {
    const createdSchedules = await this.storage.createBulkSchedules(schedulesData);

    const teacherIds = Array.from(new Set(createdSchedules.map((s) => s.teacherId)));
    const teachers = await Promise.all(teacherIds.map((id) => this.storage.getUser(id)));
    const teacherMap = new Map(teachers.map((t) => (t ? [t.id, t] : [0, null])));

    const schedulesWithTeachers = createdSchedules.map((schedule) => ({
      ...schedule,
      teacher: teacherMap.get(schedule.teacherId),
    }));

    return schedulesWithTeachers;
  }

  async updateSchedule(id: number, updates: Partial<Schedule>): Promise<ScheduleWithEnrichment> {
    console.log('ScheduleUseCase.updateSchedule called with:', { id, updates });

    const now = new Date();

    const updatedSchedule = await this.storage.updateSchedule(id, {
      ...updates,
      updatedAt: now as any,
    });

    console.log('Updated schedule result:', updatedSchedule);

    if (!updatedSchedule) {
      throw new NotFoundError("Schedule not found");
    }

    const teacher = await this.storage.getUser(updatedSchedule.teacherId);
    return { ...updatedSchedule, teacher };
  }

  async deleteSchedule(id: number): Promise<void> {
    const deleted = await this.storage.deleteSchedule(id);

    if (!deleted) {
      throw new NotFoundError("Schedule not found");
    }
  }

  async getScheduleById(id: number): Promise<ScheduleWithEnrichment> {
    const schedule = await this.storage.getScheduleById(id);

    if (!schedule) {
      throw new NotFoundError("Schedule not found");
    }

    const teacher = await this.storage.getUser(schedule.teacherId);
    return { ...schedule, teacher };
  }

  async getSchedulesByTeacher(teacherId: number): Promise<ScheduleWithEnrichment[]> {
    const schedules = await this.storage.getSchedulesByTeacher(teacherId);
    const teacher = await this.storage.getUser(teacherId);

    return schedules.map((schedule) => ({ ...schedule, teacher }));
  }

  async getMySchedules(userId: number, userRole: string): Promise<ScheduleWithEnrichment[]> {
    if (!["teacher", "head", "admin", "mazer"].includes(userRole)) {
      throw new UnauthorizedError("Forbidden");
    }

    const schedules = await this.storage.getSchedulesByTeacher(userId);

    // Filter out schedules from inactive classes
    const allClasses = await this.storage.getAllClasses();
    const activeClassIds = allClasses.filter((cls) => cls.isActive === 1).map((cls) => cls.id);

    const activeSchedules = schedules.filter((schedule) =>
      activeClassIds.includes(schedule.classId)
    );

    const teacher = await this.storage.getUser(userId);
    return activeSchedules.map((schedule) => ({ ...schedule, teacher }));
  }

  async validateScheduleConflict(
    teacherId: number,
    day: string,
    startTime: string,
    endTime: string,
    excludeId?: number,
    classId?: number
  ): Promise<{ hasConflict: boolean; type?: string; details?: string }> {
    return await this.storage.validateScheduleConflict(
      teacherId,
      day,
      startTime,
      endTime,
      excludeId,
      classId
    );
  }
}
