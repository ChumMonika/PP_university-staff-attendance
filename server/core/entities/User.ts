export interface User {
// server/domain/repositories/IUserRepository.ts

import type { User } from "@shared/schema";

// Define the extended user type with department
export interface Department {
  id: number;
  name: string;
}

export interface UserWithDepartment extends User {
  department: Department | null; // null if no department assigned
}

// Main repository interface
export interface IUserRepository {
  findById(id: number): Promise<User | undefined>;
  findByIdWithDepartment(id: number): Promise<UserWithDepartment | undefined>; // 👈 ADD THIS
  findAll(): Promise<User[]>;
  create(user: any): Promise<User>;
  update(id: number, updates: Partial<User>): Promise<User | undefined>;
  delete(id: number): Promise<boolean>;
  findByUniqueId(uniqueId: string): Promise<User | undefined>;
  findByRole(role: string): Promise<User[]>;
  findByDepartment(departmentId: number): Promise<User[]>;
  findByClass(classId: number): Promise<User[]>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
}
