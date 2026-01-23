# University Staff Attendance System

Web-based attendance and leave management for university teachers and staff.

**Tech Stack:** React + Node.js + MySQL + Docker

This project is built using Clean Architecture and supports:
* Role-based access control (Admin, Head, HR, Teacher, Staff, Moderator)
* Attendance tracking
* Leave request workflow
* Class & schedule management
* Analytics dashboard
The system supports local deployment using Docker to ensure it runs the same on every machine.

## 🚀 Quick Start

### With Docker (Recommended)
```bash
# Setup environment
cp .env.example .env
# Edit .env with your MySQL password and session secret

# Start the app
docker-compose up -d

# Check running
docker ps

# Access at http://localhost:5000
```
### Useful Docker Commands (For Demo)
```bash
# Show running containers
docker ps

# View logs
docker-compose logs -f

# Stop system
docker-compose down
```

### Manual Development (Without Docker)
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
# Build dev
docker build --build-arg NODE_ENV=development -t myapp:dev .

# Build staging  
docker build --build-arg NODE_ENV=staging -t myapp:staging .

# Build production
docker build --build-arg NODE_ENV=production -t myapp:production .

# Tag production as v1.0.0
docker tag myapp:production myapp:v1.0.0

# Verify tags
docker images | findstr myapp

# Or use npm build for manual deployment
npm run build
npm start
```

## 🧠 DevOps Concepts (Simple Explanation)
* Docker: Packages the app so it runs the same everywhere
* Dockerfile: Instructions to build the image
* Image: Built application package
* Container: Running app from image
* Tag: Version label (dev, staging, production)
* CI/CD: GitHub automatically builds the project when you push code
* Docker Hub: Online place to store Docker images (optional)


## 🏆 Features

✅ Role-based access control  
✅ Digital attendance tracking  
✅ Leave request management  
✅ Schedule management  
✅ Analytics dashboard  
✅ Clean architecture

---

**✅ Project Status: 100% Complete**
* Local deployment with Docker
* CI/CD with GitHub Actions
* Production build ready
