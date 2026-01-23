# University Staff Attendance System

Web-based attendance and leave management for university teachers and staff.

**Tech Stack:** React + Node.js + MySQL + Docker

## 🚀 Quick Start

### With Docker (Recommended)
```bash
# Setup environment
cp .env.example .env
# Edit .env with your MySQL password and session secret

# Start the app
docker-compose up -d

# Access at http://localhost:5000
```

### Manual Development
```bash
# Install dependencies
npm i

# Setup database
mysql -u root -p
source database/final_schema.sql;
source database/seed_data.sql;

# Configure .env file
cp .env.example .env

# Start development server
npm run dev

# Access at http://localhost:5173
```

## 🔑 Test Accounts

Login with password `password123`:

| Username | Role |
|----------|------|
| ADMIN001 | Admin |
| HEAD001 | Department Head |
| HR002 | HR Assistant |
| CM001 | Class Moderator |
| T001 | Teacher |

## 📦 Build & Deploy

```bash
# Build Docker images
docker build --build-arg NODE_ENV=production -t myapp:latest .

# Or use npm build for manual deployment
npm run build
npm start
```

## 🏆 Features

✅ Role-based access control  
✅ Digital attendance tracking  
✅ Leave request management  
✅ Schedule management  
✅ Analytics dashboard  
✅ Clean architecture

---

**✅ Project Status: 100% Complete**
