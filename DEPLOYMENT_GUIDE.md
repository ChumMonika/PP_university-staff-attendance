# University Staff Attendance - Deployment Guide

This is the **final-production** branch with complete CI/CD and Docker support.

## 📋 What's Included

✅ **Working CI/CD Pipeline** - Automated testing & Docker builds on every push  
✅ **Docker Local Deployment** - Run everything with one command  
✅ **Clean, Safe Code** - Type-checked, tested, and production-ready  
✅ **Simple & Explainable** - Perfect for university project submission  

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 20+
- npm
- MySQL (or use Docker)

### Option 1: Using Docker (Recommended)

```bash
# 1. Copy environment file
cp .env.example .env.local

# 2. Edit .env.local with your password
# Set: MYSQL_PASSWORD=yourpassword
#     SESSION_SECRET=your_secret_here

# 3. Start all services
docker-compose up -d

# 4. Access application
# Frontend: http://localhost:5000
# Backend API: http://localhost:5000/api
```

### Option 2: Local Development (No Docker)

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Edit .env with your MySQL credentials
# MYSQL_HOST=localhost
# MYSQL_PASSWORD=your_password

# 3. Install dependencies
npm install

# 4. Create database
npm run db:schema

# 5. Seed test data (optional)
npm run db:seed

# 6. Start development server
npm run dev

# Access: http://localhost:3000 (frontend)
#         http://localhost:5000 (backend)
```

---

## 📁 Project Structure

```
PP_university-staff-attendance/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── features/         # Feature modules
│   │   ├── pages/           # Page components
│   │   └── shared/          # Shared utilities
│   └── index.html
├── server/                    # Node.js Backend
│   ├── core/                # Business logic
│   ├── infrastructure/      # Database & external services
│   ├── presentation/        # Controllers & routes
│   └── index.ts            # Entry point
├── database/               # Database files
│   ├── final_schema.sql    # Schema
│   └── seed_data.sql       # Test data
├── .github/workflows/      # CI/CD pipelines
│   └── ci-cd.yml          # GitHub Actions
├── docker-compose.yml      # Local deployment
├── Dockerfile             # Production image
└── package.json           # Dependencies
```

---

## 🔧 Common Commands

### Development
```bash
npm run dev              # Start dev server (frontend + backend)
npm run build            # Build for production
npm start                # Run production build
npm test                 # Run tests
npm run check            # TypeScript type check
```

### Database
```bash
npm run db:schema        # Initialize schema
npm run db:seed          # Load seed data
```

### Docker
```bash
docker-compose up -d              # Start all services
docker-compose down               # Stop services
docker-compose logs -f            # View logs
docker-compose restart backend    # Restart backend
docker-compose ps                 # List services
```

---

## 🔐 Environment Variables

Create `.env` or `.env.local`:

```dotenv
# Server
NODE_ENV=development
PORT=5000

# Database
MYSQL_HOST=localhost              # "mysql" if using Docker
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=university_staff_tracker

# Security
SESSION_SECRET=generate_secure_32char_string

# API
VITE_API_URL=http://localhost:5000
```

Generate a secure SESSION_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🧪 Testing & Quality

```bash
# Run tests
npm test

# Type checking
npm run check

# Find dead code
npm run lint:deadcode
```

---

## 🐳 Docker Deployment

### Local Docker Compose

Files involved:
- **docker-compose.yml** - Service orchestration
- **Dockerfile** - Image build configuration
- **.dockerignore** - Exclude unnecessary files

Services:
- **MySQL** - Port 3307 → 3306
- **Backend** - Port 5000
- **Frontend** - Port 3000 (dev only)

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Access MySQL
docker-compose exec mysql mysql -u root -p university_staff_tracker

# Clean restart
docker-compose down -v && docker-compose up -d
```

---

## 🔄 CI/CD Pipeline

**GitHub Actions Workflow** (`.github/workflows/ci-cd.yml`)

Triggers on:
- Push to `main` or `final-production`
- Pull requests to `main` or `final-production`

Steps:
1. ✅ Type check
2. ✅ Run tests (with MySQL)
3. ✅ Build application
4. 🐳 Build Docker image
5. 📝 Log success

---

## 📊 Architecture

### Frontend Stack
- React 18 + TypeScript
- TailwindCSS + Radix UI
- React Query + React Router
- Vite (build tool)

### Backend Stack
- Node.js Express
- TypeScript
- MySQL Database
- Clean Architecture (entities, use-cases, controllers)

### Build Process
```
Client          Server
(TSX)    +      (TS)
  ↓             ↓
React           esbuild
  ↓             ↓
Vite           ESM
  ↓             ↓
HTML/CSS/JS    index.js
  ↓             ↓
dist/public    dist/index.js
```

---

## 🐛 Troubleshooting

### Docker: "port already in use"
```bash
# Change port in docker-compose.yml
# Or kill existing process
docker-compose down -v
```

### MySQL: "connection refused"
```bash
# Wait for MySQL to be ready (health check)
docker-compose logs mysql
docker-compose restart mysql
```

### Build errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Database not initialized
```bash
# Restart with clean database
docker-compose down -v
docker-compose up -d
```

---

## 📚 Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Latest stable (friend's work) |
| `docker-deployment` | Docker experimental |
| `final-production` | **✅ THIS BRANCH - Production ready** |

---

## ✅ Checklist Before Submission

- [ ] Clone repository: `git clone -b final-production <repo>`
- [ ] Copy env file: `cp .env.example .env`
- [ ] Start locally: `npm run dev` (or `docker-compose up -d`)
- [ ] Test app: Visit http://localhost:3000
- [ ] View logs: `npm test` and `npm run check`
- [ ] Verify CI/CD: Check `.github/workflows/ci-cd.yml`
- [ ] Document: Submit this guide with your project

---

## 🎯 For University Presentation

**Say:**
- ✅ "We have CI/CD automation via GitHub Actions"
- ✅ "Tests run automatically on every commit"
- ✅ "Docker enables consistent deployment"
- ✅ "Code is type-safe and production-ready"
- ✅ "This is the final-production branch"

---

## 📞 Support

For issues:
1. Check logs: `docker-compose logs`
2. Verify `.env` file
3. Ensure MySQL is healthy: `docker-compose ps`
4. Review GitHub Actions: `.github/workflows/ci-cd.yml`

---

**Ready to deploy? Start with:**
```bash
docker-compose up -d
```

Happy deploying! 🚀
