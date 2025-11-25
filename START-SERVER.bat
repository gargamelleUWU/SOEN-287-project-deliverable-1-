@echo off
REM START-SERVER.bat - Easy server startup script for Windows

echo =========================================
echo   Campus Resource Booking System
echo =========================================
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js first:
    echo   Download from https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo Node.js is installed
node --version
npm --version
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Create database directory if it doesn't exist
if not exist "database" (
    echo Creating database directory...
    mkdir database
)

echo Starting server...
echo.
echo =========================================
echo   Server will start on http://localhost:3000
echo =========================================
echo.
echo How to use:
echo   1. Open your browser
echo   2. Go to: http://localhost:3000
echo   3. To stop server: Press Ctrl+C
echo.
echo Demo Accounts:
echo   Admin:   admin@concordia.ca / admin123
echo   Student: student@concordia.ca / student123
echo.
echo =========================================
echo.

REM Start the server
npm start
