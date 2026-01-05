export interface Schedule {
  id: number;
  classId: number;
  subjectId: number;
  day: string;
  teacherId: number;
  startTime: string;
  endTime: string;
  room: string;
  createdAt: Date;
  updatedAt: Date;
}
