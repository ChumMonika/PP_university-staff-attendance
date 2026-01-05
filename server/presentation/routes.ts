import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { 
  authController,
  userController,
  attendanceController,
  leaveRequestController,
  classController,
  scheduleController,
  configController,
  healthController,
  analyticsController,
  dashboardController
} from "../infrastructure/http/dependencies";

export async function registerRoutes(app: Express): Promise<Server> {
  // Validate required environment variables
  if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET environment variable is required");
  }
  
  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));
  
  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!(req.session as any).userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // ========================================
  // AUTHENTICATION ROUTES
  // ========================================
  app.post("/api/login", (req, res, next) => authController.login(req, res, next));
  app.post("/api/logout", (req, res, next) => authController.logout(req, res, next));
  app.get("/api/me", requireAuth, (req, res, next) => authController.getMe(req, res, next));

  // ========================================
  // HEALTH CHECK
  // ========================================
  app.get('/health', (req, res) => healthController.check(req, res));

  // ========================================
  // LEAVE REQUEST ROUTES
  // ========================================
  app.post("/api/leave-request", requireAuth, (req, res, next) => leaveRequestController.create(req, res, next));
  app.get("/api/leave-requests", requireAuth, (req, res, next) => leaveRequestController.list(req, res, next));
  app.post("/api/leave-requests/respond", requireAuth, (req, res, next) => leaveRequestController.respond(req, res, next));

  // ========================================
  // ATTENDANCE ROUTES
  // ========================================
  app.get("/api/my-attendance", requireAuth, (req, res, next) => attendanceController.getMyAttendance(req, res, next));
  app.get("/api/head/attendance", requireAuth, (req, res, next) => attendanceController.getHeadAttendance(req, res, next));
  app.get("/api/my-class-status", requireAuth, (req, res, next) => attendanceController.getMyClassStatus(req, res, next));
  app.get("/api/classes/active", requireAuth, (req, res, next) => attendanceController.getActiveClasses(req, res, next));
  app.get("/api/department-summary", requireAuth, (req, res, next) => attendanceController.getDepartmentSummary(req, res, next));
  app.post("/api/attendance/mark", requireAuth, (req, res, next) => attendanceController.markAttendance(req, res, next));
  app.get("/api/attendance-today", requireAuth, (req, res, next) => attendanceController.getTodayAttendance(req, res, next));
  app.get("/api/staff-attendance", requireAuth, (req, res, next) => attendanceController.getStaffAttendance(req, res, next));

  // ========================================
  // USER MANAGEMENT ROUTES
  // ========================================
  app.get("/api/users", requireAuth, (req, res, next) => userController.list(req, res, next));
  app.post("/api/users", requireAuth, (req, res, next) => userController.create(req, res, next));
  app.put("/api/user/:id", requireAuth, (req, res, next) => userController.update(req, res, next));
  app.delete("/api/user/:id", requireAuth, (req, res, next) => userController.delete(req, res, next));
  app.post("/api/users/:id/reset-password", requireAuth, (req, res, next) => userController.resetPassword(req, res, next));

  // ========================================
  // DASHBOARD & STATS ROUTES
  // ========================================
  app.get("/api/dashboard/metrics", requireAuth, (req, res, next) => dashboardController.getMetrics(req, res, next));
  app.get("/api/stats", requireAuth, (req, res, next) => dashboardController.getStats(req, res, next));

  // ========================================
  // SCHEDULE MANAGEMENT ROUTES
  // ========================================
  app.get("/api/schedules", requireAuth, (req, res, next) => scheduleController.list(req, res, next));
  app.post("/api/schedules", requireAuth, (req, res, next) => scheduleController.create(req, res, next));
  app.post("/api/schedules/bulk", requireAuth, (req, res, next) => scheduleController.createBulk(req, res, next));
  app.put("/api/schedules/:id", requireAuth, (req, res, next) => scheduleController.update(req, res, next));
  app.delete("/api/schedules/:id", requireAuth, (req, res, next) => scheduleController.delete(req, res, next));
  app.get("/api/schedules/:id", requireAuth, (req, res, next) => scheduleController.getById(req, res, next));
  app.get("/api/schedules/teacher/:teacherId", requireAuth, (req, res, next) => scheduleController.getByTeacher(req, res, next));
  app.get("/api/my-schedules", requireAuth, (req, res, next) => scheduleController.getMySchedules(req, res, next));

  // ========================================
  // ANALYTICS ROUTES
  // ========================================
  app.get("/api/analytics/attendance-summary", requireAuth, (req, res, next) => analyticsController.getAttendanceSummary(req, res, next));
  app.get("/api/analytics/leave-statistics", requireAuth, (req, res, next) => analyticsController.getLeaveStatistics(req, res, next));
  app.get("/api/analytics/department-overview", requireAuth, (req, res, next) => analyticsController.getDepartmentOverview(req, res, next));
  app.get("/api/analytics/monthly-trends", requireAuth, (req, res, next) => analyticsController.getMonthlyTrends(req, res, next));
  app.get("/api/analytics/users", requireAuth, (req, res, next) => analyticsController.getUsers(req, res, next));

  // ========================================
  // ADMIN CONFIGURATION ROUTES
  // ========================================
  app.get("/api/departments", requireAuth, (req, res, next) => configController.getDepartments(req, res, next));
  app.post("/api/departments", requireAuth, (req, res, next) => configController.createDepartment(req, res, next));
  app.put("/api/departments/:id", requireAuth, (req, res, next) => configController.updateDepartment(req, res, next));
  app.delete("/api/departments/:id", requireAuth, (req, res, next) => configController.deleteDepartment(req, res, next));

  app.get("/api/majors", requireAuth, (req, res, next) => configController.getMajors(req, res, next));
  app.post("/api/majors", requireAuth, (req, res, next) => configController.createMajor(req, res, next));
  app.put("/api/majors/:id", requireAuth, (req, res, next) => configController.updateMajor(req, res, next));
  app.delete("/api/majors/:id", requireAuth, (req, res, next) => configController.deleteMajor(req, res, next));

  app.get("/api/classes", requireAuth, (req, res, next) => classController.list(req, res, next));
  app.post("/api/classes", requireAuth, (req, res, next) => classController.create(req, res, next));
  app.put("/api/classes/:id", requireAuth, (req, res, next) => classController.update(req, res, next));
  app.delete("/api/classes/:id", requireAuth, (req, res, next) => classController.delete(req, res, next));

  app.get("/api/subjects", requireAuth, (req, res, next) => configController.getSubjects(req, res, next));
  app.post("/api/subjects", requireAuth, (req, res, next) => configController.createSubject(req, res, next));
  app.put("/api/subjects/:id", requireAuth, (req, res, next) => configController.updateSubject(req, res, next));
  app.delete("/api/subjects/:id", requireAuth, (req, res, next) => configController.deleteSubject(req, res, next));

  // ========================================
  // CATCH-ALL FOR 404
  // ========================================
  app.all("/api/*", (req, res) => {
    res.status(404).json({ message: "API endpoint not found", path: req.path });
  });

  const httpServer = createServer(app);
  return httpServer;
}
