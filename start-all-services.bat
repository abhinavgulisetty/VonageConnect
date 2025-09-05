@echo off
title Multi-Channel Customer Service Bot - All Services

echo.
echo 🎭 Multi-Channel Customer Service Bot
echo =====================================
echo Starting all services in the correct order...
echo.

:: Check if Node.js is available
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found! Please install Node.js first.
    pause
    exit /b 1
)

:: Check if Python is available
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python not found! Please install Python first.
    pause
    exit /b 1
)

echo ✅ Prerequisites checked successfully
echo.

:: Install Node.js dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing Node.js dependencies...
    call npm install
    echo.
)

:: Check RASA setup
if not exist "rasa_customer_care chatbot\.venv" (
    echo 🔧 Setting up RASA environment...
    cd "rasa_customer_care chatbot"
    python -m venv .venv
    call .venv\Scripts\activate
    pip install -r requirements.txt
    cd ..
    echo.
)

:: Start services in background
echo 🚀 Starting services...
echo.

:: Start RASA Actions Server
echo 🎭 Starting RASA Actions Server...
start "RASA Actions Server" cmd /k "cd /d "%~dp0" && npm run rasa:actions"

:: Wait a bit for actions server to start
timeout /t 3 /nobreak >nul

:: Start RASA Core Server  
echo 🤖 Starting RASA Core Server...
start "RASA Core Server" cmd /k "cd /d "%~dp0" && npm run rasa:server"

:: Wait for RASA server to be ready
echo ⏳ Waiting for RASA server to start...
timeout /t 10 /nobreak >nul

:: Start Node.js Server
echo 🌐 Starting Node.js Server...
start "Node.js Server" cmd /k "cd /d "%~dp0" && npm run start"

:: Wait a moment for server to start
timeout /t 3 /nobreak >nul

echo.
echo ✅ All services started successfully!
echo.
echo 📱 Open your browser and go to: http://localhost:3000
echo.
echo 🎯 Demo Tips:
echo   - Try: "Hello", "track order #12345", "Where is my order?"
echo   - Use "Simulate inbound" for WhatsApp/SMS testing
echo   - Check the Channel Activity panel for real-time monitoring
echo.
echo 📚 For more details, check DEMO_GUIDE.md
echo.
echo Press any key to open the demo in your browser...
pause >nul

:: Open browser
start http://localhost:3000

echo.
echo 🎉 Demo is ready! All terminal windows will remain open.
echo Close this window when you're done with the demo.
echo.
pause
