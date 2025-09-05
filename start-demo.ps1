# 🎭 Multi-Channel Customer Service Bot Demo Startup Script
# This script helps you start all services for the demo

Write-Host " Multi-Channel Customer Service Bot Demo Startup" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Check if Node.js is installed
Write-Host "Checking Node.js..." -ForegroundColor Yellow
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if Python is installed
Write-Host "Checking Python..." -ForegroundColor Yellow
if (Get-Command python -ErrorAction SilentlyContinue) {
    $pythonVersion = python --version
    Write-Host "Python found: $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "Python not found. Please install Python 3.8-3.10 first." -ForegroundColor Red
    exit 1
}

# Install Node.js dependencies if needed
Write-Host "Installing Node.js dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "Node modules already installed" -ForegroundColor Green
} else {
    npm install
    Write-Host "Node.js dependencies installed" -ForegroundColor Green
}

# Check RASA setup
Write-Host "Checking RASA setup..." -ForegroundColor Yellow
Set-Location "rasa_customer_care chatbot"

if (Test-Path ".venv") {
    Write-Host "Virtual environment found" -ForegroundColor Green
} else {
    Write-Host "🔧 Creating virtual environment..." -ForegroundColor Yellow
    python -m venv .venv
    Write-Host "Virtual environment created" -ForegroundColor Green
}

# Activate virtual environment and install dependencies
Write-Host "Setting up RASA environment..." -ForegroundColor Yellow
& ".venv\Scripts\activate"
pip install -r requirements.txt

# Check if model exists
if (Test-Path "models\*.tar.gz") {
    Write-Host "RASA model found" -ForegroundColor Green
} else {
    Write-Host "Training RASA model..." -ForegroundColor Yellow
    rasa train
    Write-Host "RASA model trained" -ForegroundColor Green
}

Set-Location ".."

Write-Host ""
Write-Host "Setup Complete! Ready to start demo services." -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Open 3 separate PowerShell terminals" -ForegroundColor White
Write-Host "2. Run these commands in separate terminals:" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 1 (Node.js Server):" -ForegroundColor Yellow
Write-Host "   npm run start" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 2 (RASA Actions):" -ForegroundColor Yellow  
Write-Host "   npm run rasa:actions" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 3 (RASA Server):" -ForegroundColor Yellow
Write-Host "   npm run rasa:server" -ForegroundColor White
Write-Host ""
Write-Host "3. Open http://localhost:3000 to start the demo" -ForegroundColor Green
Write-Host ""
Write-Host "Check DEMO_GUIDE.md for detailed instructions and test scenarios." -ForegroundColor Cyan

# Offer to open terminals automatically (Windows 10/11)
Write-Host ""
$openTerminals = Read-Host "Would you like me to open the 3 terminal windows for you? (y/n)"
if ($openTerminals -eq "y" -or $openTerminals -eq "Y") {
    Write-Host "Opening terminals..." -ForegroundColor Green
    
    # Terminal 1 - Node.js Server
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host 'Node.js Server Terminal' -ForegroundColor Green; Write-Host 'Run: npm run start' -ForegroundColor Yellow"
    
    # Terminal 2 - RASA Actions
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host 'RASA Actions Terminal' -ForegroundColor Green; Write-Host 'Run: npm run rasa:actions' -ForegroundColor Yellow"
    
    # Terminal 3 - RASA Server
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host 'RASA Server Terminal' -ForegroundColor Green; Write-Host 'Run: npm run rasa:server' -ForegroundColor Yellow"
    
    Write-Host "Terminals opened! Run the suggested commands in each terminal." -ForegroundColor Green
}

