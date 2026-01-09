$ErrorActionPreference = "Stop"
$root = "c:\Users\minal\ws\upwork"
$api = "$root\analytics-dashboard-api"
$ui = "$root\analytics-dashboard"

Write-Host "Starting Analytics Solution..."

# 1. Start Infrastructure
Write-Host "Starting Docker Infrastructure..."
Set-Location $api
docker-compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Error "Docker Compose failed to start."
    exit 1
}
Write-Host "Infrastructure started. Waiting 10s for initialization..."
Start-Sleep -Seconds 10

# 2. Start Backend Services
$services = @("eureka-server", "producer-api", "categorizer-service", "collector-service", "publisher-api", "news-client")
foreach ($svc in $services) {
    Write-Host "Launching $svc..."
    $svcPath = "$api\$svc"
    # Use Start-Process to open in new window
    Start-Process -FilePath "cmd" -ArgumentList "/c title $svc && $api\mvnw.cmd spring-boot:run" -WorkingDirectory $svcPath
}

# 3. Start Frontend
Write-Host "Launching Frontend..."
Start-Process -FilePath "cmd" -ArgumentList "/c title analytics-dashboard && npm run dev" -WorkingDirectory $ui

Write-Host "All components launched! Please check the opened terminal windows for status."
Write-Host "Dashboard: http://localhost:5175"
