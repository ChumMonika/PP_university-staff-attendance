import type IStorage from "../interfaces/IStorage";

export class AnalyticsUseCase {
  constructor(private storage: IStorage) {}

  async getAttendanceSummary(
    userRole: string,
    userId: number,
    filters: { startDate?: string; endDate?: string; userId?: number }
  ) {
    // Role-based access control
    let targetUserId = filters.userId || null;
    
    // Teachers/staff can only view their own data
    if (userRole === 'teacher' || userRole === 'staff') {
      targetUserId = userId;
    }
    
    const allAttendance = await this.storage.getAllAttendance();
    
    // Filter by date range if provided
    let filteredAttendance = allAttendance;
    if (filters.startDate) {
      filteredAttendance = filteredAttendance.filter((a: any) => 
        new Date(a.date) >= new Date(filters.startDate!)
      );
    }
    if (filters.endDate) {
      filteredAttendance = filteredAttendance.filter((a: any) => 
        new Date(a.date) <= new Date(filters.endDate!)
      );
    }
    if (targetUserId) {
      filteredAttendance = filteredAttendance.filter((a: any) => a.userId === targetUserId);
    }
    
    // Calculate statistics
    const totalDays = filteredAttendance.length;
    const presentDays = filteredAttendance.filter((a: any) => a.status === 'present').length;
    const absentDays = filteredAttendance.filter((a: any) => a.status === 'absent').length;
    const leaveDays = filteredAttendance.filter((a: any) => a.status === 'leave').length;
    const attendanceRate = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : "0.0";
    
    return {
      totalDays,
      presentDays,
      absentDays,
      leaveDays,
      attendanceRate: parseFloat(attendanceRate)
    };
  }

  async getLeaveStatistics(
    userRole: string,
    userId: number,
    filters: { startDate?: string; endDate?: string }
  ) {
    const allLeaves = await this.storage.getLeaveRequests();
    
    // Filter by date range if provided
    let filteredLeaves = allLeaves;
    if (filters.startDate) {
      filteredLeaves = filteredLeaves.filter((l: any) => 
        new Date(l.startDate) >= new Date(filters.startDate!)
      );
    }
    if (filters.endDate) {
      filteredLeaves = filteredLeaves.filter((l: any) => 
        new Date(l.endDate) <= new Date(filters.endDate!)
      );
    }
    
    // Teachers/staff can only view their own data
    if (userRole === 'teacher' || userRole === 'staff') {
      filteredLeaves = filteredLeaves.filter((l: any) => l.userId === userId);
    }
    
    // Calculate statistics
    const totalRequests = filteredLeaves.length;
    const pendingRequests = filteredLeaves.filter((l: any) => l.status === 'pending').length;
    const approvedRequests = filteredLeaves.filter((l: any) => l.status === 'approved').length;
    const rejectedRequests = filteredLeaves.filter((l: any) => l.status === 'rejected').length;
    
    // Calculate average leave days
    const totalDays = filteredLeaves.reduce((sum: any, leave: any) => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return sum + days;
    }, 0);
    const averageDays = totalRequests > 0 ? (totalDays / totalRequests).toFixed(1) : "0.0";
    
    return {
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      totalDays,
      averageDays: parseFloat(averageDays)
    };
  }

  async getDepartmentOverview(userRole: string) {
    // Only admin/head can view department overview
    if (userRole !== 'admin' && userRole !== 'head') {
      throw new Error("Forbidden");
    }
    
    const allUsers = await this.storage.getAllUsers();
    
    // Count by role
    const roleDistribution = {
      head: allUsers.filter((u: any) => u.role === 'head').length,
      admin: allUsers.filter((u: any) => u.role === 'admin').length,
      hr_assistant: allUsers.filter((u: any) => u.role === 'hr_assistant').length,
      hr_backup: allUsers.filter((u: any) => u.role === 'hr_backup').length,
      class_moderator: allUsers.filter((u: any) => u.role === 'class_moderator').length,
      moderator: allUsers.filter((u: any) => u.role === 'moderator').length,
      teacher: allUsers.filter((u: any) => u.role === 'teacher').length,
      staff: allUsers.filter((u: any) => u.role === 'staff').length
    };
    
    // Count by status
    const statusDistribution = {
      active: allUsers.filter((u: any) => u.status === 'active').length,
      inactive: allUsers.filter((u: any) => u.status === 'inactive').length,
      banned: allUsers.filter((u: any) => u.status === 'banned').length,
      pending: allUsers.filter((u: any) => u.status === 'pending').length,
      suspended: allUsers.filter((u: any) => u.status === 'suspended').length
    };
    
    return {
      totalUsers: allUsers.length,
      roleDistribution,
      statusDistribution
    };
  }

  async getMonthlyTrends(userRole: string, year?: number) {
    // Only admin/head can view trends
    if (!['admin', 'head'].includes(userRole)) {
      throw new Error("Forbidden");
    }
    
    const targetYear = year || new Date().getFullYear();
    const allAttendance = await this.storage.getAllAttendance();
    const allLeaves = await this.storage.getLeaveRequests();
    
    // Initialize monthly data
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(targetYear, i).toLocaleString('default', { month: 'short' }),
      attendance: 0,
      leaves: 0,
      present: 0,
      absent: 0
    }));
    
    // Aggregate attendance by month
    allAttendance.forEach((a: any) => {
      const date = new Date(a.date);
      if (date.getFullYear() === targetYear) {
        const monthIndex = date.getMonth();
        monthlyData[monthIndex].attendance++;
        if (a.status === 'present') monthlyData[monthIndex].present++;
        if (a.status === 'absent') monthlyData[monthIndex].absent++;
      }
    });
    
    // Aggregate leaves by month
    allLeaves.forEach((l: any) => {
      const date = new Date(l.startDate);
      if (date.getFullYear() === targetYear && l.status === 'approved') {
        const monthIndex = date.getMonth();
        monthlyData[monthIndex].leaves++;
      }
    });
    
    return {
      year: targetYear,
      monthlyData
    };
  }

  async getUsers(userRole: string) {
    // Only admin/head can view all users
    if (userRole !== 'admin' && userRole !== 'head') {
      throw new Error("Forbidden");
    }
    
    const allUsers = await this.storage.getAllUsers();
    
    // Return simplified user list
    return allUsers.map((u: any) => ({
      id: u.id,
      uniqueId: u.uniqueId,
      name: u.name,
      role: u.role,
      status: u.status
    }));
  }
}
