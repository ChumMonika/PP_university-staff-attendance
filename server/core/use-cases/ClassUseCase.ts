import IStorage from "../interfaces/IStorage";
import type { Class, InsertClass, Major } from "@shared/schema";
import { UnauthorizedError, NotFoundError, ValidationError } from "../errors";

export interface ClassWithFullName extends Class {
  classLabel: string;
  fullClassName: string;
  displayClassName: string;
  majorShort: string;
}

export class ClassUseCase {
  constructor(private storage: IStorage) {}

  async getAllClasses(userId: number, userRole: string): Promise<ClassWithFullName[]> {
    let classes: any[];

    if (userRole === "admin") {
      // Admin can see all classes (including inactive for management)
      classes = await this.storage.getAllClasses();
    } else if (userRole === "head") {
      // Head can see classes from their department
      const currentUser = await this.storage.getUser(userId);
      if (!currentUser?.departmentId) {
        throw new NotFoundError("User department not found");
      }

      const departmentMajors = await this.storage.getMajorsByDepartment(currentUser.departmentId);
      const majorIds = departmentMajors.map((m) => m.id);
      classes = await this.storage.getClassesByMajors(majorIds);
    } else if (userRole === "class_moderator" || userRole === "moderator") {
      // Class moderators only see their assigned ACTIVE classes
      const allClasses = await this.storage.getAllClasses();
      const currentUser = await this.storage.getUser(userId);

      if (currentUser?.classId) {
        classes = allClasses.filter((cls) => cls.id === currentUser.classId && cls.isActive === 1);
      } else {
        classes = [];
      }
    } else {
      throw new UnauthorizedError("Access denied");
    }

    // For non-admin users, filter to active classes only
    if (userRole !== "admin") {
      classes = classes.filter((cls) => cls.isActive === 1);
    }

    // Get all majors to build fullClassName
    const majors = await this.storage.getAllMajors();
    const majorMap = new Map(majors.map((m) => [m.id, m]));

    // Add fullClassName to each class
    const classesWithFullName = classes.map((cls) => {
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

  async createClass(classData: InsertClass & { name?: string }): Promise<Class> {
    // Auto-generate class name: "MAJORSHORT YyearSsemester GROUP" (uppercase)
    const major = await this.storage.getMajor(classData.majorId);
    if (!major) {
      throw new ValidationError("Invalid major ID");
    }

    const generatedName = `${major.shortName} Y${classData.year}S${classData.semester} ${classData.group.toUpperCase()}`;

    const classObj = await this.storage.createClass({
      ...classData,
      name: generatedName,
      group: classData.group.toUpperCase(), // Ensure group is uppercase
    });

    return classObj;
  }

  async updateClass(id: number, updates: Partial<InsertClass>): Promise<Class | undefined> {
    // If any component that affects the name changes, regenerate it
    if (updates.majorId || updates.year || updates.semester || updates.group) {
      const existingClass = await this.storage.getClass(id);
      if (!existingClass) {
        throw new NotFoundError("Class not found");
      }

      const finalMajorId = updates.majorId || existingClass.majorId;
      const major = await this.storage.getMajor(finalMajorId);
      if (!major) {
        throw new ValidationError("Invalid major ID");
      }

      const finalYear = updates.year || existingClass.year;
      const finalSemester = updates.semester || existingClass.semester;
      const finalGroup = ((updates.group || existingClass.group || "") as string).toUpperCase();

      updates.name = `${major.shortName} Y${finalYear}S${finalSemester} ${finalGroup}`;
      updates.group = finalGroup; // Ensure group is also uppercase in updates
    }

    const updated = await this.storage.updateClass(id, updates);
    return updated;
  }

  async deleteClass(id: number): Promise<void> {
    await this.storage.deleteClass(id);
  }
}
