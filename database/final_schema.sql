-- ===============================
-- FINAL DATABASE SCHEMA
-- Project: University Staff Attendance Tracker
-- Portable & Fresh Install Safe
-- ===============================

DROP DATABASE IF EXISTS university_staff_tracker_copy;
CREATE DATABASE university_staff_tracker_copy
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE university_staff_tracker_copy;

-- ===============================
-- departments
-- ===============================
CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  short_name VARCHAR(50) NOT NULL UNIQUE,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===============================
-- majors
-- ===============================
CREATE TABLE majors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  short_name VARCHAR(50) NOT NULL,
  department_id INT NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,

  CONSTRAINT fk_majors_department
    FOREIGN KEY (department_id)
    REFERENCES departments(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===============================
-- classes
-- ===============================
CREATE TABLE classes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  major_id INT NOT NULL,
  `group` VARCHAR(10) NOT NULL,
  year INT NOT NULL,
  semester INT NOT NULL,
  academic_year VARCHAR(20) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  start_date DATE,
  end_date DATE,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,

  UNIQUE KEY unique_class (major_id, year, semester, `group`, academic_year),

  CONSTRAINT fk_classes_major
    FOREIGN KEY (major_id)
    REFERENCES majors(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===============================
-- users
-- ===============================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  unique_id VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  role ENUM(
    'head','admin','hr_assistant','hr_backup',
    'class_moderator','moderator','teacher','staff'
  ) NOT NULL,
  department_id INT,
  class_id INT,
  work_type VARCHAR(100),
  schedule VARCHAR(50),
  status ENUM('active','inactive','banned','pending','suspended')
    NOT NULL DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_users_department
    FOREIGN KEY (department_id)
    REFERENCES departments(id)
    ON DELETE SET NULL,

  CONSTRAINT fk_users_class
    FOREIGN KEY (class_id)
    REFERENCES classes(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===============================
-- subjects
-- ===============================
CREATE TABLE subjects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  credits INT NOT NULL DEFAULT 3,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===============================
-- schedules
-- ===============================
CREATE TABLE schedules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  class_id INT NOT NULL,
  subject_id INT NOT NULL,
  teacher_id INT NOT NULL,
  day VARCHAR(20) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room VARCHAR(50) NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,

  CONSTRAINT fk_schedules_class
    FOREIGN KEY (class_id)
    REFERENCES classes(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_schedules_subject
    FOREIGN KEY (subject_id)
    REFERENCES subjects(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_schedules_teacher
    FOREIGN KEY (teacher_id)
    REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===============================
-- attendance
-- ===============================
CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  date DATE NOT NULL,
  status ENUM('present','absent','leave') NOT NULL,
  is_late TINYINT(1) NOT NULL DEFAULT 0,
  schedule_id INT,
  notes TEXT,
  marked_at DATETIME,
  marked_by INT,

  UNIQUE KEY unique_attendance (user_id, date),

  CONSTRAINT fk_attendance_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_attendance_schedule
    FOREIGN KEY (schedule_id)
    REFERENCES schedules(id)
    ON DELETE SET NULL,

  CONSTRAINT fk_attendance_marked_by
    FOREIGN KEY (marked_by)
    REFERENCES users(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===============================
-- leave_requests
-- ===============================
CREATE TABLE leave_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  leave_type VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  submitted_at DATETIME NOT NULL,
  responded_at DATETIME,
  responded_by INT,

  CONSTRAINT fk_leave_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_leave_responded_by
    FOREIGN KEY (responded_by)
    REFERENCES users(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===============================
-- INDEXES (Performance)
-- ===============================
CREATE INDEX idx_users_department ON users(department_id);
CREATE INDEX idx_attendance_user_date ON attendance(user_id, date);
CREATE INDEX idx_leave_user ON leave_requests(user_id);
CREATE INDEX idx_schedules_class ON schedules(class_id);
