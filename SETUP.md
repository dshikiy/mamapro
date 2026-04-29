# 🚀 MamPro - Complete Setup Guide

## Prerequisites

Убедитесь, что установлены:
- ✅ Node.js 18+ (`node --version`)
- ✅ npm 9+ (`npm --version`)  
- ✅ PostgreSQL 12+ (`psql --version`)

---

## Complete Setup Instructions

### 1. DATABASE SETUP ✅

```bash
# Create database
createdb mampro

# Verify created
psql -l | grep mampro

# Load schema
psql -U postgres -d mampro -f backend/migrations/001_initial_schema.sql

# Verify tables
psql -d mampro -c "\dt"
```

### 2. BACKEND SETUP ✅

```bash
cd backend

# Install packages
npm install

# Create .env file (already created)
cat .env

# Should show:
# NODE_ENV=development
# PORT=5000
# DATABASE_URL=postgresql://postgres:password@localhost:5432/mampro
```

### 3. FRONTEND SETUP ✅

```bash
cd frontend

# Install packages
npm install

# Check .env.local
cat .env.local

# Should show:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Running the Application

### Start Backend (Terminal 1)

```bash
cd backend
npm run dev

# Expected output:
# 🚀 Server running on port 5000
# Environment: development
```

### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev

# Expected output:
# - Local: http://localhost:3000
```

### Open in Browser

Visit: **http://localhost:3000**

---

## Testing Features

### 1. Register & Login
- Click "Sign Up" button
- Enter: Name, Email, Password
- Create account
- Login with credentials

### 2. View Dashboard
- See stats (Upcoming, Tasks, Courses, Specialists)
- View subscription status
- Access quick actions

### 3. Browse Specialists
- Navigate to "Specialists"
- Click "Book" on any specialist
- Fill booking form (Date, Time)
- Confirm booking

### 4. Explore Courses
- Go to "Courses"
- Filter by category
- Click course to see more

### 5. Daily Tasks
- Visit "Daily Tasks"
- Check off tasks
- Track progress

### 6. Marketplace
- View "Marketplace"
- Browse listings
- See item details

---

## API Endpoints Available

```
Auth:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile

Specialists:
- GET /api/specialists
- GET /api/specialists/:id
- POST /api/specialists

Appointments:
- POST /api/appointments
- GET /api/appointments
- PUT /api/appointments/:id/status

Courses:
- GET /api/courses
- GET /api/courses?category=parenting
- GET /api/courses/:id

Tasks:
- POST /api/tasks
- GET /api/tasks
- PUT /api/tasks/:id

Marketplace:
- POST /api/marketplace
- GET /api/marketplace
- GET /api/marketplace/:id
- PUT /api/marketplace/:id
- DELETE /api/marketplace/:id
```

---

## Environment Files

### backend/.env
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/mampro
JWT_SECRET=mampro-super-secret-jwt-key-2024-change-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### frontend/.env.local
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Troubleshooting

### ❌ "Port 5000 already in use"
```bash
# Kill process on port 5000
lsof -ti :5000 | xargs kill -9
```

### ❌ "Cannot connect to PostgreSQL"
```bash
# Start PostgreSQL
brew services start postgresql      # macOS
sudo systemctl start postgresql     # Linux
net start PostgreSQL                # Windows (Admin)
```

### ❌ "CORS error"
- Verify backend running on `:5000`
- Verify `NEXT_PUBLIC_API_URL` in frontend/.env.local
- Clear browser cache

### ❌ "Module not found"
```bash
# Reinstall packages
cd backend && rm -rf node_modules && npm install
cd frontend && rm -rf node_modules && npm install
```

### ❌ "Database error"
```bash
# Reset database
dropdb mampro
createdb mampro
psql -U postgres -d mampro -f backend/migrations/001_initial_schema.sql
```

---

## Development Tips

### Debug Backend
```bash
# Run with verbose logging
NODE_DEBUG=* npm run dev

# Check database
psql -d mampro -c "SELECT * FROM users;"
```

### Debug Frontend
- Press F12 to open DevTools
- Check "Network" tab for API calls
- Check "Console" for errors

### Test API Locally
```bash
# Using curl
curl http://localhost:5000/api/health

# Should return:
# {"success":true,"message":"Server is running"}
```

---

## Next Steps

1. ✅ Database is set up
2. ✅ Backend is running
3. ✅ Frontend is running
4. ✅ Can register and login
5. Next: Customize data in database
6. Next: Deploy to production

---

## Support

If issues persist:
1. Check logs in both terminals
2. Verify ports: 3000 (frontend), 5000 (backend)
3. Verify PostgreSQL is running
4. Clear cache: `rm -rf node_modules`, `npm install`

Happy coding! 🎉
