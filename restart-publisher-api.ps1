# Script to restart the Publisher API service
# This restarts the service to load the new analytics endpoints

$ErrorActionPreference = "Continue"
$root = "c:\Users\minal\ws\upwork"
$api = "$root\analytics-dashboard-api"
$publisherApi = "$api\publisher-api"

Write-Host "Restarting Publisher API..." -ForegroundColor Cyan

# Find and stop any running publisher-api Java process
Write-Host "Stopping existing Publisher API processes..." -ForegroundColor Yellow
Get-Process | Where-Object { $_.ProcessName -eq "java" -and $_.CommandLine -like "*publisher-api*" } | Stop-Process -Force -ErrorAction SilentlyContinue

# Alternative: Kill by port if process name doesn't match
$port = 9081
$processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($processes) {
    foreach ($pid in $processes) {
        Write-Host "Stopping process on port $port (PID: $pid)..." -ForegroundColor Yellow
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
}

# Start the Publisher API in a new window
Write-Host "Starting Publisher API..." -ForegroundColor Green
Set-Location $publisherApi
Start-Process -FilePath "cmd" -ArgumentList "/c title publisher-api && $api\mvnw.cmd spring-boot:run" -WorkingDirectory $publisherApi

Write-Host "Publisher API restart initiated. Please wait ~30 seconds for the service to start." -ForegroundColor Cyan
Write-Host "Check the new terminal window for startup status." -ForegroundColor Cyan
