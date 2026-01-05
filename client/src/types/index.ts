export interface Department {
  id: number;
  name: string;
  shortName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Major {
  id: number;
  name: string;
  shortName: string;
  departmentId: number;
  createdAt: string;
  updatedAt: string;
  department?: Department;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  credits?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Class {
  id: number;
  name: string;
  majorId: number;
  year: number;
  semester: number;
  startDate?: string;
  endDate?: string;
  academicYear: string;
  group: string;
  isActive: number; // ✅ ADD THIS: 0 or 1 (tinyint)
  classLabel?: string;
  displayClassName?: string;
  majorShort?: string;
  createdAt: string;
  updatedAt: string;
  major?: Major;
}

export interface Attendance {
  id: number;
  userId: number;
  date: string;
  status: "present" | "absent" | "leave";
  isLate: number; // ✅ CHANGE: boolean → number
  markedAt?: string;
  markedBy?: number;
  markedByName?: string;
  scheduleId?: number;
  notes?: string;
  user?: User;
  schedule?: Schedule;
}

/** @deprecated legacy class moderator mapping */
export interface ClassModerator {
  id: number;
  classId: number;
  userId: number;
  isPrimary: number;
  createdAt: string;
  class?: Class;
  user?: User;
}

export interface User {
  id: number;
  uniqueId: string;
  name: string;
  email?: string;
  role: "head" | "admin" | "hr_assistant" | "hr_backup" | "class_moderator" | "moderator" | "teacher" | "staff";
  departmentId?: number;
  classId?: number; // For class_moderator role
  workType?: string;
  schedule?: string;
  status: "active" | "inactive" | "banned" | "pending" | "suspended";
  createdAt: string;
  updatedAt: string;
  department?: Department;
  class?: Class;
}


export interface LeaveRequest {
  id: number;
  userId: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  submittedAt: string;
  respondedAt?: string;
  respondedBy?: number;
  user?: User;
}

export interface Schedule {
  id: number;
  classId: number;
  subjectId: number;
  teacherId: number;
  day: string;
  startTime: string;
  endTime: string;
  room?: string;
  createdAt: string;
  updatedAt: string;
  class?: Class;
  subject?: Subject;
  teacher?: User;
  classLabel?: string; // Compact format: "BDSE Y2S2 M1"
  displayClassName?: string; // Readable format for UI
  fullClassName?: string; // Alias for classLabel
  majorShort?: string; // For hierarchical filtering
  classInfo?: Class; // Full class information
}

export interface TodaySchedule {
  user: User;
  attendance: Attendance | null;
}


export interface Stats {
  present: number;
  absent: number;
  onLeave: number;
  pendingRequests: number;
  totalUsers: number;
}

export interface ScheduleWithTeacher extends Schedule {
  teacher: User;
  class: Class;
  subject: Subject;
}

export interface ScheduleFormData {
  classId: number;
  subjectId: number;
  teacherId: number;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
}