export interface Attendance {
  id: number;
  userId: number;
  date: Date;
  status: "present" | "absent" | "leave";
  isLate: number;
  scheduleId: number | null;
  notes: string | null;
  markedAt: Date | null;
  markedBy: number | null;
}
