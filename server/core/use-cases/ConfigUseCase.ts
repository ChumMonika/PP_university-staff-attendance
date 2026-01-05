import IStorage from "../interfaces/IStorage";
import type {
  Department,
  InsertDepartment,
  Major,
  InsertMajor,
  Subject,
  InsertSubject,
} from "@shared/schema";

export class ConfigUseCase {
  constructor(private storage: IStorage) {}

  // ============== DEPARTMENTS ==============

  async getDepartments(): Promise<Department[]> {
    return await this.storage.getAllDepartments();
  }

  async createDepartment(departmentData: InsertDepartment): Promise<Department> {
    const department = await this.storage.createDepartment(departmentData);
    return department;
  }

  async updateDepartment(
    id: number,
    updates: Partial<InsertDepartment>
  ): Promise<Department | undefined> {
    const updated = await this.storage.updateDepartment(id, updates);
    return updated;
  }

  async deleteDepartment(id: number): Promise<void> {
    await this.storage.deleteDepartment(id);
  }

  // ============== MAJORS ==============

  async getMajors(): Promise<Major[]> {
    return await this.storage.getAllMajors();
  }

  async getMajorsByDepartment(departmentId: number): Promise<Major[]> {
    return await this.storage.getMajorsByDepartment(departmentId);
  }

  async createMajor(majorData: InsertMajor): Promise<Major> {
    const major = await this.storage.createMajor(majorData);
    return major;
  }

  async updateMajor(id: number, updates: Partial<InsertMajor>): Promise<Major | undefined> {
    const updated = await this.storage.updateMajor(id, updates);
    return updated;
  }

  async deleteMajor(id: number): Promise<void> {
    await this.storage.deleteMajor(id);
  }

  // ============== SUBJECTS ==============

  async getSubjects(): Promise<Subject[]> {
    return await this.storage.getAllSubjects();
  }

  async createSubject(subjectData: InsertSubject): Promise<Subject> {
    const subject = await this.storage.createSubject(subjectData);
    return subject;
  }

  async updateSubject(id: number, updates: Partial<InsertSubject>): Promise<Subject | undefined> {
    const updated = await this.storage.updateSubject(id, updates);
    return updated;
  }

  async deleteSubject(id: number): Promise<void> {
    await this.storage.deleteSubject(id);
  }
}
