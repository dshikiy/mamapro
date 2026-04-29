# MamPro - Support for Moms Platform

A modern wellness platform connecting moms with specialists, curated video courses, and community support.

## 🎨 Design Philosophy

- **Minimalist Interface**: Clean, uncluttered design
- **Warm & Soft Colors**: Beige, cream, soft pink, lavender - calming and welcoming
- **Plenty of Space**: Generous padding and margin for a breathable feel
- **Rounded Elements**: border-radius 12-20px for a friendly appearance
- **Soft Shadows**: Subtle shadows for depth without harshness
- **Wellness Focus**: Typography and layout optimized for mental health content

## 🏗️ Project Structure

```
mampro/
├── frontend/                    # Next.js + React + Tailwind
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   ├── components/         # React components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utilities
│   │   ├── styles/             # Global CSS
│   │   └── types/              # TypeScript types
│   └── tailwind.config.ts
│
├── backend/                     # Node.js + Express + PostgreSQL
│   ├── src/
│   │   ├── config/             # Database & env config
│   │   ├── controllers/        # Route handlers
│   │   ├── middleware/         # Auth, error handling
│   │   ├── models/             # Database queries
│   │   ├── routes/             # API routes
│   │   ├── types/              # TypeScript interfaces
│   │   ├── utils/              # JWT, password hashing
│   │   └── index.ts            # Entry point
│   └── migrations/             # Database schema
│
└── README.md
```

## 🚀 Quick Start - Step by Step

👉 **[Detailed Setup Guide → See SETUP.md](./SETUP.md)** ← Follow this first!

### Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org/))
- **PostgreSQL 12+** ([Download](https://www.postgresql.org/download/))
- **npm** or **yarn**
- macOS/Linux/Windows Terminal

### ⚠️ Important: Start In This Order!

---

### ⚡ Quick Verification

**Before starting, run the verification script:**

macOS/Linux:
```bash
chmod +x verify-setup.sh
./verify-setup.sh
```

Windows:
```cmd
verify-setup.bat
```

---

```bash
# Create database
createdb mampro

# Verify it was created
psql -l | grep mampro
```

✅ You should see `mampro` in the list

**If you get an error:**
```bash
# Create PostgreSQL user first (if needed)
psql -U postgres -c "CREATE USER mampro_user WITH PASSWORD 'password';"
psql -U postgres -c "ALTER USER mampro_user CREATEDB;"

# Then create database
createdb -U mampro_user mampro
```

---

### **STEP 2️⃣ Setup Database Schema**

```bash
# Navigate to project root
cd mampro

# Run migrations
psql -U postgres -d mampro -f backend/migrations/001_initial_schema.sql

# Verify tables were created
psql -d mampro -c "\dt"
```

✅ You should see tables: `users`, `specialists`, `appointments`, `courses`, etc.

---

### **STEP 3️⃣ Start Backend Server**

**Open Terminal 1:**

```bash
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ You should see:
```
🚀 Server running on port 5000
Environment: development
```

**Do NOT close this terminal!**

---

### **STEP 4️⃣ Start Frontend Server**

**Open Terminal 2 (new terminal window):**

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ You should see:
```
- Local: http://localhost:3000
```

---

### **STEP 5️⃣ Verify Everything Works**

1. **Open Browser**: http://localhost:3000
2. **Test Registration**: Click "Sign Up"
3. **Fill Form**: Name, Email, Password
4. **Submit**: Should redirect to Dashboard
5. **View Dashboard**: Should show stats and options

---

### ⚡ Quick Commands Reference

```bash
# Terminal 1 - Backend
cd backend && npm run dev    # http://localhost:5000

# Terminal 2 - Frontend  
cd frontend && npm run dev   # http://localhost:3000

# Database management
psql -d mampro              # Connect to DB
\dt                         # List all tables
\d appointments             # Describe table
SELECT * FROM users;        # Query users
dropdb mampro               # Delete database (reset)
```

---

### 🐛 Troubleshooting

**"Port 5000 already in use"**
```bash
# Find and kill process using port 5000
lsof -ti :5000 | xargs kill -9
npm run dev  # Try again
```

**"Cannot connect to database"**
```bash
# Start PostgreSQL
brew services start postgresql  # macOS
sudo systemctl start postgresql  # Linux
net start PostgreSQL             # Windows

# Verify PostgreSQL is running
psql --version
```

**"CORS error when logging in"**
- Make sure backend is running on `:5000`
- Make sure frontend `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:5000/api`

**"Module not found" errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

### 📊 API Testing (Postman/Curl)

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "password123"
  }'
```

**Login User:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Get Specialists:**
```bash
curl http://localhost:5000/api/specialists
```

---

### 🔄 Reset Everything

```bash
# Stop both servers (Ctrl+C in each terminal)

# Remove database
dropdb mampro

# Clear node_modules
rm -rf frontend/node_modules backend/node_modules
rm frontend/package-lock.json backend/package-lock.json

# Start fresh from STEP 1
```

## 📱 Key Features

### 1. **Authentication** ✅
- User registration and login with JWT
- Secure password hashing with bcryptjs
- Profile management with avatar & bio

### 2. **Specialists Directory** ✅
- Browse licensed psychologists and therapists
- View profiles, ratings, and pricing
- Book appointments with modal form
- Availability scheduling

### 3. **Video Courses** ✅
- 5 curated course categories:
  - 👶 Parenting (8 courses)
  - 🧠 Psychology (7 courses)
  - 💝 Postpartum (5 courses)
  - 🧘 Stress Management (2 courses)
  - ❤️ Relationships (2 courses)
- YouTube video embedding
- Progress tracking by category
- Lesson-based learning

### 4. **Daily Tasks** ✅
- Customizable wellness tasks
- Visual progress bar (percentage tracker)
- Daily completion system
- Motivational messages

### 5. **Appointments System** ✅
- Schedule sessions with specialists
- Calendar date/time selection
- Appointment status tracking (scheduled/completed/cancelled)
- Notes and messaging

### 6. **Community Marketplace** ✅
- Buy/sell baby items and services
- Product listings with images and prices
- Search and filter capabilities
- User reviews (ready to extend)

### 7. **Subscription Plans** ✅
- Free: Basic access
- Basic: Specialist access
- Pro: All features + priority support
- Plan management dashboard

## 🎨 Color Palette

```
Primary Colors:
- Cream: #F9F6F3 (background)
- Beige: #F5E6D3 (subtle)
- Soft Pink: #F0D9D1 (light accents)
- Lavender: #E8D5F2 (light accents)
- Sage: #D4E5D9 (success state)

Accent Colors:
- Accent Pink: #D4A5A0 (CTA buttons)
- Accent Purple: #C9A8D8 (premium)
- Warm Gray: #8B8680 (secondary text)
- Dark Text: #5A5A5A (primary text)
```

## 🔧 Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom config
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Storage**: localStorage for state

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT tokens
- **Validation**: express-validator
- **Security**: bcryptjs for password hashing

## 📚 API Endpoints

### Authentication `/api/auth`
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /profile` - Get authenticated user profile

### Specialists `/api/specialists`
- `GET /` - List all specialists with availability
- `GET /:id` - Get specialist details
- `POST /` - Create specialist profile (auth required)

### Appointments `/api/appointments`
- `POST /` - Book new appointment
- `GET /` - Get user's appointments with specialist details
- `PUT /:id/status` - Update appointment status

### Courses `/api/courses`
- `GET /` - List all courses
- `GET /?category=parenting` - Filter courses by category
- `GET /:id` - Get course with all lessons

## 🎯 Frontend Pages & Components

### Public Pages
- `/` - Landing with hero, features, CTA
- `/login` - Login form with social options
- `/register` - Registration form with benefits

### Authenticated Pages (Dashboard)
- `/dashboard` - Stats, quick actions, subscription info
- `/specialists` - Search & filter specialists
- `/specialists/[id]` - Specialist profile (coming)
- `/appointments` - Manage appointments (tabs: upcoming/completed/cancelled)
- `/courses` - Browse courses with category filter
- `/courses/[id]` - Course player with lessons (coming)
- `/daily-tasks` - Daily wellness tasks with progress
- `/marketplace` - Buy/sell items grid
- `/profile` - User profile management

### Components
**Shared**: Header, Footer, Button (4 variants)
**Auth**: LoginForm, RegisterForm
**Specialists**: SpecialistCard, SpecialistList
**Appointments**: BookingModal, AppointmentCard
**Courses**: CourseCard, VideoPlayer, CourseCategoryFilter
**Tasks**: TaskItem, ProgressBar
**Marketplace**: ListingCard

## 📦 Database Schema

### Tables
- `users` - User accounts with subscription
- `specialists` - Psychologists/therapists
- `appointments` - Booking records
- `courses` - Video courses metadata
- `lessons` - Individual course lessons
- `daily_tasks` - User's daily tasks
- `listings` - Marketplace items
- `subscriptions` - Subscription records

## 🛠️ Development Workflow

### Database Setup
```bash
# Create database
createdb mampro

# Run migrations
psql -U postgres -d mampro -f backend/migrations/001_initial_schema.sql
```

### Development Servers
```bash
# Terminal 1 - Frontend
cd frontend && npm run dev    # http://localhost:3000

# Terminal 2 - Backend
cd backend && npm run dev     # http://localhost:5000
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
npm run start
```

**Backend:**
```bash
cd backend
npm run build
npm run start
```

## 📝 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/mampro
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🎨 UI/UX Features

✅ Responsive design (mobile-first) 
✅ Dark/light theme support (via Tailwind)
✅ Loading states with spinners
✅ Error handling with user-friendly messages
✅ Modal dialogs for booking
✅ Progress visualization
✅ Smooth animations & transitions
✅ Accessible form controls
✅ SEO optimized pages
✅ Lazy loading support

## 🔒 Security Features

✅ JWT-based authentication
✅ Password hashing with bcryptjs
✅ CORS protection
✅ Input validation & sanitization
✅ SQL injection prevention (parameterized queries)
✅ Protected routes with auth middleware
✅ Token refresh mechanism (ready to extend)

## 📱 Mobile Optimization

- Responsive grid layouts
- Touch-friendly buttons (48px minimum)
- Mobile menu navigation
- Optimized images
- Fast load times

## 🚀 Deployment Ready

- Docker configuration (coming)
- Environment-based configuration
- Production-ready error handling
- Database migration scripts
- API rate limiting (ready to add)

## 📄 License

MIT

## 💌 Contact & Support

- Email: hello@mampro.app
- GitHub Issues: For bug reports and feature requests

---

**Made with ❤️ for moms** 👶

## ✨ Future Enhancements

- [ ] Video call integration (Zoom/Google Meet)
- [ ] Real-time messaging
- [ ] Payment processing (Stripe)
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Admin dashboard
- [ ] Analytics & reporting
- [ ] Community forum
- [ ] Referral program
- [ ] AI-powered recommendations

---

## 📖 Documentation Files

- **[README.md](./README.md)** - This file, project overview
- **[SETUP.md](./SETUP.md)** - Detailed setup instructions ⭐ **START HERE**
- **[verify-setup.sh](./verify-setup.sh)** - Verification script (macOS/Linux)
- **[verify-setup.bat](./verify-setup.bat)** - Verification script (Windows)

---

## 📝 Files Created During Setup

### ✅ Frontend Files
```
frontend/
├── .env.local                    # Environment variables
├── .gitignore                    # Git ignore rules
├── src/
│   ├── app/layout.tsx            # Root layout
│   ├── app/page.tsx              # Landing page
│   ├── app/(auth)/
│   │   ├── layout.tsx            # Auth layout
│   │   ├── login/page.tsx        # Login
│   │   └── register/page.tsx     # Registration
│   ├── app/(dashboard)/
│   │   ├── layout.tsx            # Dashboard layout
│   │   ├── dashboard/page.tsx    # Dashboard
│   │   ├── specialists/page.tsx  # Specialists
│   │   ├── appointments/page.tsx # Appointments
│   │   ├── courses/page.tsx      # Courses
│   │   ├── daily-tasks/page.tsx  # Tasks
│   │   ├── marketplace/page.tsx  # Marketplace
│   │   └── profile/page.tsx      # Profile
│   ├── components/               # 20+ components
│   ├── hooks/                    # useAuth, useFetch
│   ├── lib/                      # Utilities
│   ├── styles/                   # Tailwind CSS
│   └── types/                    # TypeScript types
├── tailwind.config.ts            # Tailwind config
└── tsconfig.json
```

### ✅ Backend Files
```
backend/
├── .env                          # Environment (auto-created)
├── .gitignore                    # Git ignore rules
├── src/
│   ├── index.ts                  # Entry point
│   ├── config/
│   │   ├── database.ts           # Database connection
│   │   └── env.ts                # Environment config
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── specialistController.ts
│   │   ├── appointmentController.ts
│   │   ├── courseController.ts
│   │   ├── taskController.ts
│   │   └── marketplaceController.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── specialists.ts
│   │   ├── appointments.ts
│   │   ├── courses.ts
│   │   ├── tasks.ts
│   │   └── marketplace.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   ├── models/
│   │   └── User.ts
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       ├── jwt.ts
│       ├── password.ts
│       └── validators.ts
├── migrations/
│   └── 001_initial_schema.sql    # Database schema
└── tsconfig.json
```

---

## 🚀 Ports & URLs

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend API | 5000 | http://localhost:5000 |
| PostgreSQL | 5432 | postgres://localhost:5432/mampro |

---

## 🔒 Security Notes

⚠️ **IMPORTANT for Production:**
- Change `JWT_SECRET` in `.env`
- Use strong database password
- Add environment-specific configs
- Enable HTTPS
- Add rate limiting
- Add input sanitization
- Enable database SSL
- Add API versioning
- Add request logging

---

## 📞 Support & Questions

- 📧 Email: hello@mampro.app
- 🐛 Issues: GitHub Issues
- 💬 Discussions: GitHub Discussions
- 📚 Docs: See SETUP.md

---

**Made with ❤️ for moms**

Let's build a better world for mothers! 🎉👶