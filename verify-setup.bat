@echo off
REM Setup verification script for Windows

echo.
echo 🔍 Checking MamPro Setup...
echo.

REM Check Node.js
echo 📦 Checking Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Install from https://nodejs.org/
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do echo ✅ %%i

REM Check npm
echo 📦 Checking npm...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm not found
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do echo ✅ npm %%i

REM Check PostgreSQL
echo 📦 Checking PostgreSQL...
where psql >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ PostgreSQL not found. Install from https://www.postgresql.org/download/
    exit /b 1
)
for /f "tokens=*" %%i in ('psql --version') do echo ✅ %%i

REM Check frontend
echo 📦 Checking frontend...
if exist "frontend\node_modules" (
    echo ✅ Frontend dependencies installed
) else (
    echo ⚠️  Frontend dependencies not installed
)

REM Check backend
echo 📦 Checking backend...
if exist "backend\node_modules" (
    echo ✅ Backend dependencies installed
) else (
    echo ⚠️  Backend dependencies not installed
)

REM Check env files
echo 📦 Checking environment files...
if exist "backend\.env" (
    echo ✅ backend\.env exists
) else (
    echo ⚠️  backend\.env not found
)

if exist "frontend\.env.local" (
    echo ✅ frontend\.env.local exists
) else (
    echo ⚠️  frontend\.env.local not found
)

echo.
echo 🎉 Setup check complete!
echo.
echo Next steps:
echo 1. cd backend ^&^& npm run dev      (Terminal 1)
echo 2. cd frontend ^&^& npm run dev     (Terminal 2)
echo 3. Open http://localhost:3000
