-- ============================================
-- FULL SEED DATA FOR TESTING - University Staff Attendance
-- Portable & FK-safe
-- ============================================

USE university_staff_tracker;

-- ============================================
-- 1. DEPARTMENTS
-- ============================================
INSERT INTO departments (id, name, short_name, created_at, updated_at) VALUES
(1, 'Information Technology Engineering', 'ITE', '2025-12-13 22:42:24', '2025-12-17 16:15:13'),
(2, 'Supply Chain & Automation Engineering', 'SCA', '2025-12-14 06:46:09', '2025-12-14 06:46:09'),
(3, 'Bio Engineering', 'BIO', '2025-12-14 06:46:09', '2025-12-14 06:46:09'),
(4, 'Environmental Engineering', 'DEE', '2025-12-14 06:46:09', '2025-12-14 06:46:09'),
(5, 'Telecommunication & Electronics Engineering', 'TEE', '2025-12-14 06:46:09', '2025-12-14 06:46:09');

-- ============================================
-- 2. MAJORS
-- ============================================
INSERT INTO majors (id, name, short_name, department_id, created_at, updated_at) VALUES
(1, 'Bachelor Information Technology Engineering', 'ITE', 1, '2025-12-14 06:46:09', '2025-12-14 06:46:09'),
(2, 'Bachelor Data Science And Engineering', 'DSE', 1, '2025-12-14 06:46:09', '2025-12-14 06:46:09'),
(3, 'Bachelor Supply Chain & Automation Engineering', 'SCA', 2, '2025-12-14 06:46:09', '2025-12-14 06:46:09'),
(4, 'Bachelor Bio Engineering', 'BIO', 3, '2025-12-14 06:46:09', '2025-12-14 06:46:09'),
(5, 'Bachelor Food Technology And Engineering', 'FTE', 3, '2025-12-14 06:46:09', '2025-12-14 06:46:09'),
(6, 'Bachelor Environmental Engineering', 'DEE', 4, '2025-12-14 06:46:09', '2025-12-14 06:46:09'),
(7, 'Bachelor Telecommunication & Electronics Engineering', 'TEE', 5, '2025-12-14 06:46:09', '2025-12-14 06:46:09');

-- ============================================
-- 3. SUBJECTS
-- ============================================
INSERT INTO subjects (id, name, code, credits, created_at, updated_at) VALUES
(1, 'Big Data', 'BD301', 3, '2025-12-13 22:44:05', '2025-12-13 22:44:05'),
(2, 'Data Warehousing', 'DW301', 3, '2025-12-13 23:50:10', '2025-12-13 23:50:10'),
(3, 'Web and Cloud Technology II', 'WCT301', 3, '2025-12-16 12:16:54', '2025-12-16 12:16:54'),
(4, 'Data Mining', 'DM301', 3, '2025-12-16 12:17:46', '2025-12-16 12:17:46'),
(5, 'Regression Analysis', 'RA301', 3, '2025-12-16 12:31:17', '2025-12-16 12:31:17'),
(6, 'Project Practicum I', 'PP301', 4, '2025-12-16 14:03:48', '2025-12-16 14:03:48');

-- ============================================
-- 4. USERS
-- ============================================

-- Admin
INSERT INTO users VALUES
(1, 'ADMIN001', 'Admin User', 'admin@example.com',
'$2b$10$1WF01587r4C4O4Dul9h7POcuC7ISZH77hJLYFkoDGz.VHcW/fsW1.',
'admin', NULL, NULL, 'Full-Time', '08:00-17:00', 'active',
'2025-12-13 11:21:05', '2025-12-13 11:21:05');

-- Department Heads
INSERT INTO users VALUES
(2, 'HEAD001', 'Srun Sovila', 'srunsovila@example.com',
'$2b$10$4jtRFx2gCgstk/Q3UwA.KO4MN7Xpbolb.Q9c.6z.ZYNqkwolU7cWC',
'head', 1, NULL, NULL, NULL, 'active',
'2025-12-28 22:47:53', '2025-12-29 05:48:10'),

(3, 'HEAD002', 'Regr', 'emily@rupp.edu.kh',
'$2b$10$5yC6KJq8oMCuf5p.BFoLWug.FHspuF9.3kDI4Ur0VZgDKg/MZm5F.',
'head', 3, NULL, NULL, NULL, 'active',
'2025-12-29 18:17:39', '2025-12-30 01:18:03'),

(4, 'HEAD003', 'dsghs', 'shdsh@rupp.edu.kh',
'$2b$10$O3FRGZPeoUYjvfVoOa7WpuXhZ8nzSCPCgUkL0gc866pruvh0eh2My',
'head', 2, NULL, NULL, NULL, 'active',
'2025-12-30 04:34:11', '2025-12-30 11:52:24');

-- Teachers (6 teachers for 6 sessions)
INSERT INTO users VALUES
(5, 'T001', 'Ms. CheaDaly', 'dalychea@example.com',
'$2b$10$2FjEcH0///Pp5saOYvQHYuFINkTE8aE2Ot3anbpRJtjIWROVwxOJy',
'teacher', 1, NULL, NULL, NULL, 'active', NOW(), NOW()),

(6, 'T002', 'Dr. Khim Chamroeun', 'khimchamroeun@rupp.edu.kh',
'$2b$10$sBIA7knLq.UyCgcGIXCf0u0wFlIuYdX8MgwxD6rEQW7YZd8Y0/7Oa',
'teacher', 1, NULL, NULL, NULL, 'active', NOW(), NOW()),

(7, 'T003', 'Mr. Seng Vannak', 'sengvannak@rupp.edu.kh',
'$2b$10$FHz2a6aLY4AjtY.FqO4GHuBtlNPBcLEBYlJ.WPPPyWZgrcxVSiUWS',
'teacher', 2, NULL, NULL, NULL, 'active', NOW(), NOW()),

(8, 'T004', 'Mr. Chhim Bunchhun', 'chhimbunchhun@rupp.edu.kh',
'$2b$10$DNSs4AO4lRoOD3oJq7pyoevm6aLWtMuMjTkEtCXFFodiZiOGbugYa',
'teacher', 1, NULL, NULL, NULL, 'active', NOW(), NOW()),

(9, 'T005', 'Mr. Chap Chanpiseth', 'chapchanpiseth@rupp.edu.kh',
'$2b$10$HaOAL7syoFgfhEac/dKsOew6yDCb3HUX9fGoI68C8legcXmaGt8oG',
'teacher', 1, NULL, NULL, NULL, 'active', NOW(), NOW()),

(10,'T006', 'Mr. Touch Nguonchhay', 'touchnguonchhay@rupp.edu.kh',
'$2b$10$Z4seyedfs94Ju0bTfU1As.xyc786VvxVFcufH8EmFi3Yf2o7N5MsG',
'teacher', 1, NULL, NULL, NULL, 'active', NOW(), NOW());

-- ============================================
-- 5. CLASS (DSE Y2S1 M1)
-- ============================================
INSERT INTO classes VALUES
(1, 'DSE Y3S1 M1', 2, 'M1', 2, 1, '2025-2026', 1,
'2025-09-15', '2026-01-17', NOW(), NOW());

-- ============================================
-- 6. SCHEDULES (6 sessions, 6 teachers)
-- ============================================
INSERT INTO schedules (
   class_id, subject_id, teacher_id,
  day, start_time, end_time, room,
  created_at, updated_at
) VALUES
( 1, 4, 6, 'Monday',    '07:00:00', '11:00:00', 'STEM305', '2026-01-11 00:51:19', '2026-01-10 19:09:47'),
( 1, 2, 7, 'Tuesday',   '07:00:00', '11:00:00', 'STEM305', '2026-01-11 00:51:19', '2026-01-10 19:10:03'),
( 1, 5, 5, 'Wednesday', '07:00:00', '11:00:00', 'STEM305', '2026-01-11 00:51:19', '2026-01-10 19:10:10'),
( 1, 1, 8, 'Thursday',  '07:00:00', '11:00:00', 'STEM305', '2026-01-11 00:51:19', '2026-01-10 19:10:18'),
( 1, 3,10, 'Saturday',  '07:00:00', '10:00:00', 'STEM305', '2026-01-11 00:51:19', '2026-01-10 19:10:32'),
(1, 6, 9, 'Saturday',  '10:00:00', '12:00:00', 'STEM305', '2026-01-11 00:51:19', '2026-01-10 19:10:37');

-- ============================================
-- SEED DATA COMPLETE for one class in the Dse major for Year3 Semester1 Class M1 ✅
-- ============================================
