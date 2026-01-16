export interface User {
  id: number;
  uniqueId: string;
  name: string;
  email: string | null;
  password: string;
  role:
    | "head"
    | "admin"
    | "hr_assistant"
    | "hr_backup"
    | "class_moderator"
    | "moderator"
    | "teacher"
    | "staff";
  departmentId: number | null;
  classId: number | null;
  workType: string | null;
  schedule: string | null;
  status: "active" | "inactive" | "banned" | "pending" | "suspended";
  createdAt: Date;
  updatedAt: Date;
}
