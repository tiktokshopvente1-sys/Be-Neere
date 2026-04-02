Write-Host "Demarrage de l'IA Multilingue..." -ForegroundColor Cyan

# Backend
Start-Process powershell -ArgumentList '-NoExit', '-Command', "cd '$PSScriptRoot\backend'; .\venv\Scripts\uvicorn.exe main:app --reload --port 8000" -WindowStyle Normal

Start-Sleep -Seconds 2

# Frontend
Start-Process powershell -ArgumentList '-NoExit', '-Command', "cd '$PSScriptRoot\frontend'; npx vite --host 0.0.0.0 --port 5173" -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Application disponible sur : http://localhost:5173" -ForegroundColor Green
Write-Host "Backend API sur            : http://localhost:8000" -ForegroundColor Green
Write-Host ""

Start-Process "http://localhost:5173"
