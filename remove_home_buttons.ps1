# PowerShell script to remove Home buttons from all HTML files
Write-Host "Removing Home buttons from all HTML files..." -ForegroundColor Green
Write-Host ""

# Change to the tools directory
Set-Location ".\tools"

# Get all HTML files
$htmlFiles = Get-ChildItem -Filter "*.html"

$updatedCount = 0

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Remove various patterns of Home buttons
    $content = $content -replace '<a[^>]*class="[^"]*btn[^"]*btn-danger[^"]*home-btn-font[^"]*"[^>]*>Home</a>', ''
    $content = $content -replace '<a[^>]*class="[^"]*home-btn-font[^"]*"[^>]*>Home</a>', ''
    $content = $content -replace '<a[^>]*class="[^"]*btn-danger[^"]*"[^>]*>Home</a>', ''
    $content = $content -replace '<a[^>]*href="[^"]*index\.html[^"]*"[^>]*>Home</a>', ''
    $content = $content -replace '<a[^>]*>Home</a>', ''
    
    # Remove button elements with Home text
    $content = $content -replace '<button[^>]*>Home</button>', ''
    
    # Remove any div containing only Home text
    $content = $content -replace '<div[^>]*class="[^"]*col-4[^"]*text-center[^"]*"[^>]*>\s*<a[^>]*>Home</a>\s*</div>', ''
    
    if ($content -ne $originalContent) {
        Set-Content $file.FullName $content -Encoding UTF8
        Write-Host "Updated: $($file.Name)" -ForegroundColor Yellow
        $updatedCount++
    } else {
        Write-Host "No changes needed: $($file.Name)" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Home button removal completed!" -ForegroundColor Green
Write-Host "Total files updated: $updatedCount" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 