import IStorage from "../interfaces/IStorage";
import type { User, Attendance, InsertAttendance, LeaveRequest, Schedule, Class, Major } from "@shared/schema";
import { UnauthorizedError, NotFoundError, ValidationError } from "../errors";

export interface EnrichedAttendance extends Attendance {
  schedule?: Schedule & { subject?: any; classInfo?: any };
  markedByName?: string;
}

export interface AttendanceRecord {
  id: string | number;
  userId: number;
  date: string;
  status: string;
  markedBy?: number | null;
  markedAt?: Date | string | null;
  user?: User;
  classId: number | null;
  classLabel: string | null;
  schedule?: Schedule;
  scheduleId?: number | null;
}

export class AttendanceUseCase {
  constructor(private storage: IStorage) {}

  async getMyAttendance(userId: number): Promise<EnrichedAttendance[]> {
    const attendance = await this.storage.getAttendance(userId);

    const enriched = await Promise.all(
      attendance.map(async (att) => {
        const enrichedAtt: any = { ...att };

        if (att.scheduleId) {
          const sched = await this.storage.getScheduleById(att.scheduleId).catch(() => undefined);
          if (sched) {
            const subject = await (this.storage as any)
              .getSubject(sched.subjectId)
              .catch(() => undefined);
            const classInfo = await (this.storage as any)
              .getClass(sched.classId)
              .catch(() => undefined);
            enrichedAtt.schedule = { ...sched, subject, classInfo };
          }
        }

        if (att.markedBy) {
          const marker = await this.storage.getUser(att.markedBy).catch(() => undefined);
          enrichedAtt.markedByName = marker ? marker.name : undefined;
        }

        return enrichedAtt;
      })
    );

    return enriched;
  }

  async getHeadAttendance(
    currentUserId: number,
    userRole: string,
    filters?: { startDate?: string; endDate?: string; role?: string; class?: string; status?: string }
  ): Promise<AttendanceRecord[]> {
    if (!["head", "admin"].includes(userRole)) {
      throw new UnauthorizedError("Forbidden");
    }

    const currentUser = await this.storage.getUser(currentUserId);
    if (userRole === "head" && !currentUser?.departmentId) {
      throw new NotFoundError("User department not found");
    }

    const { startDate, endDate, role: qRole, class: qClass, status: qStatus } = filters || {};
    const start = startDate ? new Date(startDate) : new Date("2000-01-01");
    const end = endDate ? new Date(endDate) : new Date("2099-12-31");

    const [allUsers, allAttendance, allLeaveRequests, allClasses, allMajors, allSchedules] =
      await Promise.all([
        this.storage.getAllUsers(),
        this.storage.getAllAttendance(),
        this.storage.getLeaveRequests(),
        this.storage.getAllClasses(),
        this.storage.getAllMajors(),
        this.storage.getAllSchedules(),
      ]);

    // ✅ Filter for ACTIVE classes only
    const activeClasses = allClasses.filter((cls) => cls.isActive === 1);
    const activeClassIds = activeClasses.map((cls) => cls.id);

    const majorMap = new Map(allMajors.map((m) => [m.id, m]));
    const classById = new Map(activeClasses.map((cls) => [cls.id, cls]));

    const buildClassLabel = (cls: any) => {
      if (!cls) return null;
      const major = majorMap.get(cls.majorId);
      const majorShort = major?.shortName || major?.name || "Unknown";
      return `${majorShort} Y${cls.year}S${cls.semester}${cls.group ? " " + cls.group : ""}`;
    };

    const departmentMajorIds =
      userRole === "admin"
        ? allMajors.map((m) => m.id)
        : allMajors.filter((m) => m.departmentId === currentUser?.departmentId).map((m) => m.id);

    const departmentClassIds = activeClasses
      .filter((c) => departmentMajorIds.includes(c.majorId))
      .map((c) => c.id);

    const activeSchedules = allSchedules.filter((s) => activeClassIds.includes(s.classId));

    // Teacher attendance
    const teacherAttendance = allAttendance.filter((a) => {
      const u = allUsers.find((uu) => uu.id === a.userId);
      if (!u || u.role !== "teacher") return false;

      const teacherSchedules = activeSchedules.filter((s) => s.teacherId === a.userId);
      const hasDeptSchedule = teacherSchedules.some((s) => departmentClassIds.includes(s.classId));

      return hasDeptSchedule;
    });

    const teacherEntries = teacherAttendance.map((a) => {
      const user = allUsers.find((u) => u.id === a.userId);
      const teacherSchedules = activeSchedules.filter(
        (s) => s.teacherId === a.userId && departmentClassIds.includes(s.classId)
      );

      const classSchedule = teacherSchedules.length > 0 ? teacherSchedules[0] : null;
      const classLabel = classSchedule ? buildClassLabel(classById.get(classSchedule.classId)) : null;

      return {
        id: a.id,
        userId: a.userId,
        date: a.date,
        status: a.status,
        markedBy: a.markedBy,
        markedAt: a.markedAt,
        user,
        classId: classSchedule?.classId || null,
        classLabel,
        schedule: classSchedule,
        scheduleId: classSchedule?.id || null,
      };
    });

    // Staff attendance
    const departmentStaff =
      userRole === "admin"
        ? allUsers.filter((u) => u.role === "staff")
        : allUsers.filter((u) => u.role === "staff" && u.departmentId === currentUser?.departmentId);

    const staffAttendance = allAttendance.filter((a) => {
      const u = allUsers.find((uu) => uu.id === a.userId);
      if (!u || u.role !== "staff") return false;
      if (!departmentStaff.some((ds) => ds.id === u.id)) return false;
      if (startDate && endDate) {
        return new Date(a.date) >= start && new Date(a.date) <= end;
      }
      return true;
    });

    const approvedLeaves = allLeaveRequests.filter((lr) => lr.status === "approved");

    const staffLeaves = approvedLeaves.filter((l) => {
      const u = allUsers.find((uu) => uu.id === l.userId);
      if (!u || u.role !== "staff") return false;
      if (!departmentStaff.some((ds) => ds.id === u.id)) return false;
      if (startDate && endDate) {
        return new Date(l.startDate) <= end && new Date(l.endDate) >= start;
      }
      return true;
    });

    const attendance: AttendanceRecord[] = [];
    attendance.push(...teacherEntries);
    attendance.push(
      ...staffAttendance.map((a) => {
        const user = allUsers.find((u) => u.id === a.userId);
        return {
          ...a,
          user,
          classId: null,
          classLabel: null,
        };
      })
    );

    // Add approved leaves
    for (const leave of staffLeaves) {
      const dateStr = (leave.startDate as any);
      if (startDate && endDate && (new Date(dateStr) < start || new Date(dateStr) > end)) continue;
      const hasExisting = attendance.find((a) => a.userId === leave.userId && a.date === dateStr);
      if (!hasExisting) {
        const user = allUsers.find((u) => u.id === leave.userId);
        attendance.push({
          id: `leave-${leave.id}`,
          userId: leave.userId,
          date: dateStr,
          status: "leave",
          markedBy: leave.respondedBy,
          markedAt: leave.respondedAt || leave.submittedAt,
          user,
          classId: null,
          classLabel: null,
        });
      }
    }

    // Apply filters
    const filtered = attendance.filter((rec) => {
      if (startDate && endDate) {
        const recDate = new Date(rec.date);
        if (recDate < start || recDate > end) return false;
      }
      if (qRole && qRole !== "all" && rec.user?.role !== qRole) return false;
      if (qStatus && qStatus !== "all" && rec.status !== qStatus) return false;
      if (qClass && qClass !== "all") {
        if (typeof qClass === "string" && qClass.match(/^\d+$/)) {
          if (rec.classId !== parseInt(qClass)) return false;
        } else {
          if (rec.classLabel !== qClass) return false;
        }
      }
      return true;
    });

    filtered.sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime() ||
        ((a.user?.name || "") as string).localeCompare((b.user?.name || "") as string)
    );

    return filtered;
  }

  async checkClassActiveStatus(userId: number, userRole: string): Promise<{
    hasClass: boolean;
    isActive: boolean;
    classInfo?: any;
    message: string;
  }> {
    if (userRole !== "class_moderator" && userRole !== "moderator") {
      throw new UnauthorizedError("Only class moderators can check class status");
    }

    const user = await this.storage.getUser(userId);

    if (!user?.classId) {
      return {
        hasClass: false,
        isActive: false,
        message: "No class assigned",
      };
    }

    const classObj = await (this.storage as any).getClass(user.classId);

    if (!classObj) {
      return {
        hasClass: false,
        isActive: false,
        message: "Class not found",
      };
    }

    return {
      hasClass: true,
      isActive: classObj.isActive === 1,
      classInfo: {
        id: classObj.id,
        name: classObj.name,
        isActive: classObj.isActive,
      },
      message: classObj.isActive === 1 ? "Class is active" : "Class is inactive - you cannot mark attendance",
    };
  }

  async getActiveClasses(userRole: string): Promise<any[]> {
    if (!["admin", "head"].includes(userRole)) {
      throw new Error("Admin or Head access required");
    }

    const allClasses = await this.storage.getAllClasses();
    const activeClasses = allClasses.filter((cls) => cls.isActive === 1);

    const majors = await this.storage.getAllMajors();
    const majorMap = new Map(majors.map((m) => [m.id, m]));

    const classesWithFullName = activeClasses.map((cls) => {
      const major = majorMap.get(cls.majorId);
      const majorShort = major?.shortName || major?.name || "Unknown";
      const majorFull = major?.name || "Unknown";
      const groupStr = (cls as any).group ? ` ${(cls as any).group}` : "";

      const classLabel = `${majorShort} Y${cls.year}S${cls.semester}${groupStr}`;
      const yearText = `Year ${cls.year}`;
      const semesterText = `Semester ${cls.semester}`;
      const groupText = (cls as any).group || "";
      const displayClassName = `${majorFull} - ${yearText} - ${semesterText}${groupText ? " - Group " + groupText : ""}`;

      return {
        ...cls,
        classLabel,
        fullClassName: classLabel,
        displayClassName,
        majorShort,
      };
    });

    return classesWithFullName;
  }

  async markAttendance(
    userId: number,
    date: string,
    status: string,
    userRole: string,
    currentUserId: number,
    scheduleId?: number,
    targetUserSchedule?: string
  ): Promise<Attendance> {
    if (!["class_moderator", "moderator", "hr_assistant", "hr_backup"].includes(userRole)) {
      throw new UnauthorizedError("Only Class Moderators or HR can mark attendance");
    }

    const targetUser = await this.storage.getUser(userId);
    if (!targetUser) {
      throw new NotFoundError("User not found");
    }

    const canMark =
      (["class_moderator", "moderator"].includes(userRole) && targetUser.role === "teacher") ||
      (["hr_assistant", "hr_backup"].includes(userRole) && targetUser.role === "staff");

    if (!canMark) {
      throw new ValidationError(
        ["class_moderator", "moderator"].includes(userRole)
          ? "Class Moderators can only mark teachers' attendance"
          : "HR can only mark staff attendance"
      );
    }

    let isLate = 0;
    if (targetUserSchedule && status === "present") {
      const scheduleStart = targetUserSchedule.split("-")[0];
      const currentTime = new Date().toTimeString().split(" ")[0].substring(0, 5);
      isLate = currentTime > scheduleStart ? 1 : 0;
    }

    const attendance = await this.storage.markAttendance({
      userId,
      date,
      status,
      isLate,
      markedAt: new Date(),
      markedBy: currentUserId,
      scheduleId,
    });

    return attendance;
  }

  async getTodayAttendance(): Promise<any[]> {
    const today = new Date().toISOString().split("T")[0];

    const [allUsers, todaysAttendance, allLeaveRequests] = await Promise.all([
      this.storage.getAllUsers(),
      this.storage.getAttendanceByDate(today),
      this.storage.getLeaveRequests(),
    ]);

    const attendanceByUser = new Map<number, any>();
    for (const att of todaysAttendance) {
      attendanceByUser.set(att.userId, att);
    }

    const approvedLeaveTodayByUser = new Set<number>();
    for (const req of allLeaveRequests) {
      if (req.status === "approved") {
        const start = (req.startDate as any);
        const end = (req.endDate as any);
        if (start <= today && today <= end) {
          approvedLeaveTodayByUser.add(req.userId);
        }
      }
    }

    const result = allUsers.map((u) => {
      const { password, ...userWithoutPassword } = u as any;

      let att = attendanceByUser.get(u.id) || null;

      if (!att && approvedLeaveTodayByUser.has(u.id)) {
        att = {
          id: -1,
          userId: u.id,
          date: today,
          status: "leave",
          markedAt: "Pre-approved",
          markedBy: null,
        };
      }

      return {
        ...userWithoutPassword,
        attendance: att,
      };
    });

    return result;
  }

  async getStaffAttendance(userRole: string): Promise<any[]> {
    if (!["hr_assistant", "hr_backup"].includes(userRole)) {
      throw new UnauthorizedError("Forbidden");
    }

    const today = new Date().toISOString().split("T")[0];

    const allUsers = await this.storage.getAllUsers();
    const staffUsers = allUsers.filter((u) => u.role === "staff");

    const todaysAttendance = await this.storage.getAttendanceByDate(today);
    const staffAttendanceMap = new Map<number, any>();

    for (const att of todaysAttendance) {
      const user = staffUsers.find((u) => u.id === att.userId);
      if (user) {
        staffAttendanceMap.set(att.userId, att);
      }
    }

    const result = await Promise.all(
      staffUsers.map(async (staff) => {
        const attendance = staffAttendanceMap.get(staff.id);

        let status = "pending";
        let markedAt = null;
        let markedByName = null;

        if (attendance) {
          status = attendance.status;
          markedAt = attendance.markedAt;

          if (attendance.markedBy) {
            const marker = await this.storage.getUser(attendance.markedBy).catch(() => null);
            markedByName = marker ? marker.name : null;
          }
        }

        return {
          id: staff.id,
          name: staff.name,
          uniqueId: staff.uniqueId,
          status,
          markedAt,
          markedByName,
        };
      })
    );

    return result;
  }
}
