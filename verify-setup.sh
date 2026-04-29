#!/bin/bash
# Setup verification script

echo "🔍 Checking MamPro Setup..."
echo ""

# Check Node.js
echo "📦 Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Install from https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js $(node --version)"

# Check npm
echo "📦 Checking npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found"
    exit 1
fi
echo "✅ npm $(npm --version)"

# Check PostgreSQL
echo "📦 Checking PostgreSQL..."
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL not found. Install from https://www.postgresql.org/download/"
    exit 1
fi
echo "✅ PostgreSQL $(psql --version)"

# Check database
echo "📦 Checking database..."
if psql -l | grep -q mampro; then
    echo "✅ Database 'mampro' exists"
else
    echo "⚠️  Database 'mampro' not found. Run: createdb mampro"
fi

# Check frontend
echo "📦 Checking frontend..."
if [ -d "frontend/node_modules" ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "⚠️  Frontend dependencies not installed. Run: cd frontend && npm install"
fi

# Check backend
echo "📦 Checking backend..."
if [ -d "backend/node_modules" ]; then
    echo "✅ Backend dependencies installed"
else
    echo "⚠️  Backend dependencies not installed. Run: cd backend && npm install"
fi

# Check env files
echo "📦 Checking environment files..."
if [ -f "backend/.env" ]; then
    echo "✅ backend/.env exists"
else
    echo "⚠️  backend/.env not found"
fi

if [ -f "frontend/.env.local" ]; then
    echo "✅ frontend/.env.local exists"
else
    echo "⚠️  frontend/.env.local not found"
fi

echo ""
echo "🎉 Setup check complete!"
echo ""
echo "Next steps:"
echo "1. cd backend && npm run dev      (Terminal 1)"
echo "2. cd frontend && npm run dev     (Terminal 2)"
echo "3. Open http://localhost:3000"
