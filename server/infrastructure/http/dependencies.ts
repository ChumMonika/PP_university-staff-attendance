import { storage } from "../persistence/MySQLStorage";

// Import use cases
import {
  AuthUseCase,
  UserUseCase,
  AttendanceUseCase,
  LeaveRequestUseCase,
  ClassUseCase,
  ScheduleUseCase,
  ConfigUseCase
} from '../../core/use-cases';
import { DashboardUseCase } from '../../core/use-cases/DashboardUseCase';
import { AnalyticsUseCase } from '../../core/use-cases/AnalyticsUseCase';

// Import controllers
import {
  AuthController,
  UserController,
  AttendanceController,
  LeaveRequestController,
  ClassController,
  ScheduleController,
  ConfigController,
  HealthController,
  AnalyticsController,
  DashboardController
} from '../../presentation/controllers';

/* =======================
   Use Case Instances
   ======================= */

export const authUseCase = new AuthUseCase(storage);
export const userUseCase = new UserUseCase(storage);
export const attendanceUseCase = new AttendanceUseCase(storage);
export const leaveRequestUseCase = new LeaveRequestUseCase(storage);
export const classUseCase = new ClassUseCase(storage);
export const scheduleUseCase = new ScheduleUseCase(storage);
export const configUseCase = new ConfigUseCase(storage);
export const dashboardUseCase = new DashboardUseCase(storage);
export const analyticsUseCase = new AnalyticsUseCase(storage);

/* =======================
   Controller Instances
   ======================= */

export const authController = new AuthController(authUseCase, storage);
export const userController = new UserController(userUseCase);
export const attendanceController = new AttendanceController(attendanceUseCase, storage);
export const leaveRequestController = new LeaveRequestController(leaveRequestUseCase);
export const classController = new ClassController(classUseCase);
export const scheduleController = new ScheduleController(scheduleUseCase);
export const configController = new ConfigController(configUseCase);
export const healthController = new HealthController();
export const analyticsController = new AnalyticsController(analyticsUseCase);
export const dashboardController = new DashboardController(dashboardUseCase);

