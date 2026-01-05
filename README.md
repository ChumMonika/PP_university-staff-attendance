# University Staff Attendance System

A full-stack web application for managing university staff and student attendance, leave requests, and class schedules.

## Requirements

- **Node.js** v20+
- **MySQL** 8.0+
- **npm**

## Quick Setup

### 1. Clone Repository

```bash
git clone https://github.com/ChumMonika/PP_university-staff-attendance.git
cd PP_university-staff-attendance
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

Open MySQL and run:

```sql
source database/final_schema.sql;
source database/seed_data.sql;
```

This creates database `university_staff_tracker_copy` with test data.

### 4. Configure Environment

```bash
# Copy template
cp .env.example .env
```

Edit `.env` and update:
- `MYSQL_PASSWORD` - Your MySQL root password
- `SESSION_SECRET` - Generate a random 32-character string

### 5. Start Application

```bash
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## Test Accounts

Login with these credentials (password: `password123`):

| Username | Role | Access |
|----------|------|--------|
| ADMIN001 | Admin | Full system access |
| CM001 | Class Moderator | Mark attendance |
| T001 | Teacher | View schedule, submit leave |
| HEAD001 | Department Head | Department analytics, approve leave |
| HR002 | HR Assistant | Mark staff attendance, manage leave |
| S001 | Staff | View attendance, submit leave |

## Available Scripts

```bash
npm run dev      # Run development server
npm run build    # Build for production
npm test         # Run test suite (72 tests)
npm run check    # TypeScript type checking
```

## Project Structure

```
 client/              # React frontend
    src/
       components/  # UI components
       pages/       # Page components
       lib/         # Utilities, API client
 server/              # Node.js backend
    core/            # Business logic
    infrastructure/  # Database repositories
    presentation/    # Controllers, routes
 database/            # SQL schema and seed data
 shared/              # Shared TypeScript types
```

## Key Features

- **Role-Based Access Control** (8 user roles)
- **Attendance Tracking** (students, teachers, staff)
- **Leave Request Management** (submit, approve/reject)
- **Class Scheduling**
- **Department & Major Configuration**
- **Analytics Dashboard**

## Technologies

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js 20, Express.js, TypeScript
- **Database**: MySQL 8.0, Drizzle ORM
- **Testing**: Vitest (72 passing tests)

## Troubleshooting

**Cannot connect to MySQL?**
- Check `.env` has correct `MYSQL_PASSWORD`
- Verify MySQL is running: `mysql -u root -p`

**Port 5000 already in use?**
- Change `PORT` in `.env` to 5001

**Login fails?**
- Ensure you ran `seed_data.sql`
- Use username `ADMIN001` (uppercase)
- Password is `password123`

**npm install fails?**
- Check Node.js version: `node --version` (must be 20+)
- Delete `node_modules/` and retry

## Documentation

- **[TEACHER_NOTES.md](TEACHER_NOTES.md)** - Detailed evaluation guide for instructors
- **[SETUP_GUIDE.txt](SETUP_GUIDE.txt)** - Simple text-based setup instructions

## License

Educational project for university coursework.
