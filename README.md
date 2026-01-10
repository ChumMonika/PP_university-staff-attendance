# **This repository contains both source code and 3 required project documents for submission.**

# University Staff Attendance Management System

A web-based attendance and leave management system for university teachers and staff, built with modern technologies and clean architecture principles.

---

## 📄 Project Documentation

All **must-submit** project 3 report documents are located in the **`Draft-ReportPPracticum/`** folder:

1. **Project Practicum Draft Report** - `Draft-ReportPPracticum/1. Attendace_University_Staff_Report_Final.pdf`
2. **Functional Requirements** - `Draft-ReportPPracticum/2. IC-Functional-Requirements.pdf`
3. **Non-Functional Requirements** - `Draft-ReportPPracticum/3. Non-FunctionalRequirements.pdf`

---

## ⚙️ System Requirements

- **Node.js** v20 or higher
- **MySQL** 8.0 or higher
- **npm** (comes with Node.js)

---

## 🚀 Setup Instructions

### Step 1: Clone the Repository

```bash
git clone https://github.com/ChumMonika/PP_university-staff-attendance.git
cd PP_university-staff-attendance
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Setup Database
Open powershell to run the cmd:
mysql -u root -p
=> Then enter your MySQL password.

You should see:
mysql>

Now you can run 2 SQL files in the project folder to set up the database and seed some data for test

(inside MySQL) Now run:
source database/final_schema.sql;
source database/seed_data.sql;

After that, you can exit MySQL by run: 
exit;

This creates the database `university_staff_tracker_copy` with sample data.

### Step 4: Configure Environment Variables
Edit `.env.example .env` file to `.env` and update:
- `MYSQL_PASSWORD` - Your MySQL root password
- `SESSION_SECRET` - A random 32-character string 
can generate: node -e "console.log(crypto.randomBytes(32).toString('hex'))"

### Step 5: Run the Application

```bash
npm run dev
```

Access the application:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## 🔑 Test Login Accounts

go to create class moderator and hr fro attedacne marking and test these accounts to test the system (password: `password123`):

| Username | Role | Description |
|----------|------|-------------|
| ADMIN001 | Admin | System configuration and user management |
| HEAD001 | Department Head | Approve leave, view department reports |
| HR002 | HR Assistant | Mark staff attendance |
| CM001 | Class Moderator | Mark teacher attendance |
| T001 | Teacher | Submit leave, view schedule |
| S001 | Staff | Submit leave, view attendance |

---

## 🛠️ Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm test         # Run test suite (72 tests)
npm run check    # TypeScript type checking
```

---

## 📂 Project Structure

```
client/              # React frontend (Vite + TypeScript)
server/              # Node.js backend (Express + Clean Architecture)
  ├── core/          # Business logic and use cases
  ├── infrastructure/# Database repositories
  └── presentation/  # API controllers and routes
database/            # MySQL schema and seed data
shared/              # Shared types and schemas
```

---

## ✨ Key Features

- **Role-Based Access Control** - 6 different user roles
- **Digital Attendance Tracking** - For teachers and staff
- **Leave Management** - Submit and approve leave requests
- **Schedule Management** - Semester-based class schedules
- **Department Analytics** - Reports and statistics
- **Clean Architecture** - Separation of concerns, testable code
