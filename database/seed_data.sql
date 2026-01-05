USE university_staff_tracker_copy;

-- =========================
-- Seed: departments
-- =========================
INSERT INTO departments (id, name, short_name, created_at, updated_at) VALUES
(1,'Information Technology Engineering','ITE','2025-12-13 22:42:24','2025-12-17 16:15:13'),
(7,'Supply Chain & Automation Engineering','SCA','2025-12-14 06:46:09','2025-12-14 06:46:09'),
(8,'Bio Engineering','BIO','2025-12-14 06:46:09','2025-12-14 06:46:09'),
(9,'Environmental Engineering','DEE','2025-12-14 06:46:09','2025-12-14 06:46:09'),
(10,'Telecommunication & Electronics Engineering','TEE','2025-12-14 06:46:09','2025-12-14 06:46:09');

-- =========================
-- Seed: majors
-- =========================
INSERT INTO majors (id, name, short_name, department_id, created_at, updated_at) VALUES
(2,'Bachelor Supply Chain & Automation Engineering','SCA',7,'2025-12-14 06:46:09','2025-12-14 06:46:09'),
(3,'Bachelor Bio Engineering','BIO',8,'2025-12-14 06:46:09','2025-12-14 06:46:09'),
(4,'Bachelor Food Technology And Engineering','FTE',8,'2025-12-14 06:46:09','2025-12-14 06:46:09'),
(5,'Bachelor Environmental Engineering','DEE',9,'2025-12-14 06:46:09','2025-12-14 06:46:09'),
(6,'Bachelor Information Technology Engineering','ITE',1,'2025-12-14 06:46:09','2025-12-14 06:46:09'),
(7,'Bachelor Data Science And Engineering','DSE',1,'2025-12-14 06:46:09','2025-12-14 06:46:09'),
(8,'Bachelor Telecommunication & Electronics Engineering','TEE',10,'2025-12-14 06:46:09','2025-12-14 06:46:09');

-- =========================
-- Seed: subjects
-- =========================
INSERT INTO subjects (id, name, code, credits, created_at, updated_at) VALUES
(1,'Big Data','BD301',3,'2025-12-13 22:44:05','2025-12-13 22:44:05'),
(2,'Data Warehousing','DW301',3,'2025-12-13 23:50:10','2025-12-13 23:50:10'),
(47,'Web and Cloud Technology II','WCT301',3,'2025-12-16 12:16:54','2025-12-16 12:16:54'),
(48,'Data Mining','DM301',3,'2025-12-16 12:17:46','2025-12-16 12:17:46'),
(49,'Regression Analysis','RA301',3,'2025-12-16 12:31:17','2025-12-16 12:31:17'),
(50,'Project Practicum I','PP301',4,'2025-12-16 14:03:48','2025-12-16 14:03:48');

-- =========================
-- Seed: users (admin + staff)
-- =========================
INSERT INTO users VALUES (1,'ADMIN001','Admin User','admin@example.com','$2b$10$1WF01587r4C4O4Dul9h7POcuC7ISZH77hJLYFkoDGz.VHcW/fsW1.','admin',NULL,NULL,'Full-Time','08:00-17:00','active','2025-12-13 11:21:05','2025-12-13 11:21:05'),(89,'CM001','Mony','mony@edu.kh','$2b$10$EtpLWGrHDxdNVPfybL4NqOIhNu6WH85qYq.tIfwOZxUXcm2w1ADM6','class_moderator',1,36,NULL,NULL,'active','2025-12-14 03:37:23','2025-12-20 07:38:17'),(120,'T001','Ms. CheaDaly','dalychea@example.com','$2b$10$2FjEcH0///Pp5saOYvQHYuFINkTE8aE2Ot3anbpRJtjIWROVwxOJy','teacher',1,NULL,NULL,NULL,'active','2025-12-16 12:09:06','2025-12-16 21:10:07'),(121,'T002','Dr. Khim Chamroeun','khimchamroeun@rupp.edu.kh','$2b$10$sBIA7knLq.UyCgcGIXCf0u0wFlIuYdX8MgwxD6rEQW7YZd8Y0/7Oa','teacher',1,36,NULL,NULL,'active','2025-12-16 14:07:38','2025-12-29 18:45:52'),(122,'T003','Mr. Seng Vannak','sengvannak@rupp.edu.kh','$2b$10$FHz2a6aLY4AjtY.FqO4GHuBtlNPBcLEBYlJ.WPPPyWZgrcxVSiUWS','teacher',7,NULL,NULL,NULL,'active','2025-12-16 14:08:43','2025-12-30 22:23:55'),(123,'T004','Mr. Chhim Bunchhun','chhimbunchhun@rupp.edu.kh','$2b$10$DNSs4AO4lRoOD3oJq7pyoevm6aLWtMuMjTkEtCXFFodiZiOGbugYa','teacher',1,NULL,NULL,NULL,'active','2025-12-16 14:09:10','2025-12-16 14:09:10'),(124,'T005','Mr. Chap Chanpiseth','chapchanpiseth@rupp.edu.kh','$2b$10$HaOAL7syoFgfhEac/dKsOew6yDCb3HUX9fGoI68C8legcXmaGt8oG','teacher',1,NULL,NULL,NULL,'active','2025-12-16 14:09:33','2025-12-16 14:09:33'),(125,'T006','Mr. Touch Nguonchhay','touchnguonchhay@rupp.edu.kh','$2b$10$Z4seyedfs94Ju0bTfU1As.xyc786VvxVFcufH8EmFi3Yf2o7N5MsG','teacher',1,NULL,NULL,NULL,'active','2025-12-16 14:09:58','2025-12-20 10:21:57'),(126,'S001','dan','chhimnchhun@rupp.edu.kh','$2b$10$JEUC7BAQP2qNMJesIzqiXu20goNhkzJ3X8TiEfxEe2/ymhnkTAzXW','staff',1,NULL,'Full-Time','08:00-17:00','active','2025-12-20 00:31:18','2025-12-29 18:44:47'),(127,'HEAD001','Srun Sovila','srunsovila@example.com','$2b$10$4jtRFx2gCgstk/Q3UwA.KO4MN7Xpbolb.Q9c.6z.ZYNqkwolU7cWC','head',1,NULL,NULL,NULL,'active','2025-12-28 22:47:53','2025-12-29 05:48:10'),(128,'HR002','emily','emily@rupp.edu.kh','$2b$10$wH5UL6i.f9oru0ftKlX2v.zMYre7HzYJTkXVVgSf0mDqexGSuC3AW','hr_assistant',1,NULL,'Full-Time','08:00-17:00','active','2025-12-29 11:40:44','2025-12-29 11:40:44'),(129,'S002','emilyy','chhimnchhun@rupp.edu.kh','$2b$10$y3Ne8W0ptjEWOHTDSqKhBO6sEGFrgdwHUIw7e6r9v/.SpGybGanNq','staff',8,NULL,'Full-Time','08:00-17:00','active','2025-12-29 17:34:05','2025-12-29 17:34:05'),(130,'HEAD002','Regr','emily@rupp.edu.kh','$2b$10$5yC6KJq8oMCuf5p.BFoLWug.FHspuF9.3kDI4Ur0VZgDKg/MZm5F.','head',8,NULL,NULL,NULL,'active','2025-12-29 18:17:39','2025-12-30 01:18:03'),(131,'CM002','fdfd','sagag@rupp.edu.kh','$2b$10$PYB32ORA9iMuDWr32HC6tuqrqpSAOfWiemd6fHfCKPSXooiy62fL2','class_moderator',7,37,NULL,NULL,'active','2025-12-30 04:32:32','2025-12-30 04:32:32'),(132,'HEAD003','dsghs','shdsh@rupp.edu.kh','$2b$10$O3FRGZPeoUYjvfVoOa7WpuXhZ8nzSCPCgUkL0gc866pruvh0eh2My','head',7,NULL,NULL,NULL,'active','2025-12-30 04:34:11','2025-12-30 11:52:24');
