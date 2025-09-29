# Setup Demo Branch for Vonage Connect

Write-Host "Setting up Demo branch with Postman support..." -ForegroundColor Cyan

# Check if git is installed
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git not found! Please install Git first." -ForegroundColor Red
    exit 1
}

# Check if we're in a git repo
if (-not (Test-Path .git)) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit"
}

# Create and switch to Demo branch
Write-Host "Creating and switching to Demo branch..." -ForegroundColor Yellow
git checkout -b Demo

Write-Host "Demo branch created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Now you can use Postman to test the API endpoints!" -ForegroundColor Cyan
Write-Host "1. Import the collection from ./postman/VonageConnect.postman_collection.json" -ForegroundColor White
Write-Host "2. Set a variable 'baseUrl' to 'http://localhost:3000'" -ForegroundColor White
Write-Host "3. Try the various API endpoints" -ForegroundColor White
Write-Host ""
Write-Host "See POSTMAN_GUIDE.md for detailed instructions." -ForegroundColor Cyan
