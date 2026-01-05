import type IStorage from "../interfaces/IStorage";
import type { User, Attendance, LeaveRequest } from "@shared/schema";

export class DashboardUseCase {
  constructor(private storage: IStorage) {}

  async getMetrics(userId: number, userRole: string) {
    console.log("📊 [Dashboard Metrics] Request from:", { userId, role: userRole });
    
    const allUsers = await this.storage.getAllUsers();
    const allAttendance = await this.storage.getAllAttendance();
    const allLeaves = await this.storage.getLeaveRequests();
    
    console.log("📊 [Dashboard Metrics] Total data:", { users: allUsers.length, attendance: allAttendance.length, leaves: allLeaves.length });
    
    let filteredAttendance = allAttendance;
    let filteredLeaves = allLeaves;
    let filteredUsers = allUsers;
    
    // Apply role-based filtering
    if (userRole === 'teacher' || userRole === 'staff') {
      filteredAttendance = allAttendance.filter((a: Attendance) => a.userId === userId);
      filteredLeaves = allLeaves.filter((l: LeaveRequest) => l.userId === userId);
      filteredUsers = allUsers.filter((u: User) => u.id === userId);
      console.log("👤 [Teacher/Staff] Personal data only");
    }
    
    if (userRole === 'head') {
      const currentUser = allUsers.find((u: User) => u.id === userId);
      console.log("👤 [Head] Current user:", { id: currentUser?.id, name: currentUser?.name, departmentId: currentUser?.departmentId });
      
      if (currentUser?.departmentId) {
        filteredUsers = allUsers.filter((u: User) => u.departmentId === currentUser.departmentId);
        const deptUserIds = filteredUsers.map((u: User) => u.id);
        filteredAttendance = allAttendance.filter((a: Attendance) => deptUserIds.includes(a.userId));
        filteredLeaves = allLeaves.filter((l: LeaveRequest) => deptUserIds.includes(l.userId));
        
        console.log("🏢 [Head] Department data:", { 
          departmentId: currentUser.departmentId,
          users: filteredUsers.length,
          userIds: deptUserIds,
          attendance: filteredAttendance.length,
          leaves: filteredLeaves.length
        });
      } else {
        console.log("⚠️ [Head] No departmentId found");
      }
    }
    
    // Calculate user statistics
    const totalUsers = filteredUsers.length;
    const activeUsers = filteredUsers.filter((u: User) => u.status === 'active').length;
    const inactiveUsers = filteredUsers.filter((u: User) => u.status === 'inactive').length;
    
    // Calculate attendance statistics
    const totalAttendance = filteredAttendance.length;
    const presentCount = filteredAttendance.filter((a: Attendance) => a.status === 'present').length;
    const absentCount = filteredAttendance.filter((a: Attendance) => a.status === 'absent').length;
    const leaveCount = filteredAttendance.filter((a: Attendance) => a.status === 'leave').length;
    const attendanceRate = totalAttendance > 0 
      ? ((presentCount / totalAttendance) * 100).toFixed(1)
      : "0.0";
    
    // Calculate leave statistics
    const totalLeaveRequests = filteredLeaves.length;
    const pendingLeaves = filteredLeaves.filter((l: LeaveRequest) => l.status === 'pending').length;
    const approvedLeaves = filteredLeaves.filter((l: LeaveRequest) => l.status === 'approved').length;
    const rejectedLeaves = filteredLeaves.filter((l: LeaveRequest) => l.status === 'rejected').length;
    
    // Calculate today's statistics
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = filteredAttendance.filter((a: Attendance) => {
      const attDate = typeof a.date === "string" ? a.date : a.date.toISOString().split("T")[0];
      return attDate === today;
    });
    const todayPresent = todayAttendance.filter((a: Attendance) => a.status === 'present').length;
    const todayAbsent = todayAttendance.filter((a: Attendance) => a.status === 'absent').length;
    const todayLeave = todayAttendance.filter((a: Attendance) => a.status === 'leave').length;
    
    // Calculate this month's statistics
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthAttendance = filteredAttendance.filter((a: any) => {
      const date = new Date(a.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    const monthPresent = monthAttendance.filter((a: any) => a.status === 'present').length;
    const monthAbsent = monthAttendance.filter((a: any) => a.status === 'absent').length;
    const monthLeave = monthAttendance.filter((a: any) => a.status === 'leave').length;
    
    // Calculate role distribution for admin/head
    let roleDistribution = null;
    if (userRole === 'admin' || userRole === 'head') {
      roleDistribution = {
        head: allUsers.filter((u: any) => u.role === 'head').length,
        admin: allUsers.filter((u: any) => u.role === 'admin').length,
        hr_assistant: allUsers.filter((u: any) => u.role === 'hr_assistant').length,
        hr_backup: allUsers.filter((u: any) => u.role === 'hr_backup').length,
        class_moderator: allUsers.filter((u: any) => u.role === 'class_moderator').length,
        moderator: allUsers.filter((u: any) => u.role === 'moderator').length,
        teacher: allUsers.filter((u: any) => u.role === 'teacher').length,
        staff: allUsers.filter((u: any) => u.role === 'staff').length
      };
    }
    
    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        byRole: roleDistribution
      },
      attendance: {
        total: totalAttendance,
        present: presentCount,
        absent: absentCount,
        leave: leaveCount,
        rate: parseFloat(attendanceRate)
      },
      leaves: {
        total: totalLeaveRequests,
        pending: pendingLeaves,
        approved: approvedLeaves,
        rejected: rejectedLeaves
      },
      today: {
        total: todayAttendance.length,
        present: todayPresent,
        absent: todayAbsent,
        leave: todayLeave
      },
      thisMonth: {
        total: monthAttendance.length,
        present: monthPresent,
        absent: monthAbsent,
        leave: monthLeave
      }
    };
  }

  async getStats(userRole: string) {
    if (!['head', 'admin'].includes(userRole)) {
      throw new Error("Forbidden");
    }
    
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = await this.storage.getAttendanceByDate(today);
    const allUsers = await this.storage.getAllUsers();
    const pendingRequests = await this.storage.getPendingLeaveRequests();
    
    const present = todayAttendance.filter((att: Attendance) => att.status === 'present').length;
    const absent = todayAttendance.filter((att: Attendance) => att.status === 'absent').length;
    const onLeave = todayAttendance.filter((att: Attendance) => att.status === 'leave').length;
    
    return {
      present,
      absent,
      onLeave,
      pendingRequests: pendingRequests.length,
      totalUsers: allUsers.length
    };
  }
}
