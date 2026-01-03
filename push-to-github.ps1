# Check if git is installed
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "Git is not installed. Please install Git for Windows first."
    exit 1
}

Write-Host "Initializing Git Repository..." -ForegroundColor Cyan
git init -b main

$remoteUrl = "https://github.com/sharmapiyu/Ecommerce.git"

# Check if remote exists
if (git remote | Select-String "origin") {
    Write-Host "Setting remote URL..." -ForegroundColor Yellow
    git remote set-url origin $remoteUrl
} else {
    Write-Host "Adding remote origin..." -ForegroundColor Yellow
    git remote add origin $remoteUrl
}

Write-Host "Pulling existing README from GitHub (Rebase)..." -ForegroundColor Cyan
# This might fail if history is unrelated, allowing unrelated histories just in case
git pull origin main --rebase --allow-unrelated-histories

Write-Host "Adding files to staging..." -ForegroundColor Cyan
git add .

Write-Host "Committing files..." -ForegroundColor Cyan
git commit -m "Initial commit of Full Stack E-Commerce Platform"

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git push -u origin main

Write-Host "------------------------------------------------" -ForegroundColor Green
Write-Host "Success! Your code is now on GitHub." -ForegroundColor Green
Write-Host "View it here: $remoteUrl" -ForegroundColor Green
