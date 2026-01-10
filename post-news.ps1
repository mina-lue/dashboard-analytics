# Script to post news data to Producer API
# Usage: .\post-news.ps1 -Title "Your Title" -Text "Your text content"

param(
    [string]$Title = "Breaking News: Major Event Happens",
    [string]$Text = "This is a test news article to verify the data pipeline is working correctly."
)

$url = "http://localhost:9080/api/news"
$body = @{
    title = $Title
    text = $Text
} | ConvertTo-Json

Write-Host "Posting news to Producer API..." -ForegroundColor Cyan
Write-Host "Title: $Title" -ForegroundColor Yellow
Write-Host "Text: $Text" -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json"
    Write-Host "✓ News posted successfully!" -ForegroundColor Green
    Write-Host "News ID: $($response.id)" -ForegroundColor Green
    Write-Host "Title: $($response.title)" -ForegroundColor Green
    Write-Host ""
    Write-Host "The news should appear in the dashboard within a few seconds." -ForegroundColor Cyan
} catch {
    Write-Host "✗ Error posting news:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Make sure the Producer API is running on port 9080" -ForegroundColor Yellow
}
