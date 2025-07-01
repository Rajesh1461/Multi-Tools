# PowerShell script to remove inline styles from sticky-side-ad divs in all HTML files
# JavaScript will handle dynamic positioning relative to container.py-4

$toolsDir = "tools"
$files = Get-ChildItem -Path $toolsDir -Filter "*.html" -Recurse

foreach ($file in $files) {
    Write-Host "Processing: $($file.Name)"
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    # Remove inline styles from left ad - let JavaScript handle positioning
    $content = $content -replace '<div class="sticky-side-ad left"[^>]*>', '<div class="sticky-side-ad left">'
    # Remove inline styles from right ad - let JavaScript handle positioning
    $content = $content -replace '<div class="sticky-side-ad right"[^>]*>', '<div class="sticky-side-ad right">'
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    Write-Host "Completed: $($file.Name)" -ForegroundColor Green
}

Write-Host "All files processed successfully!" -ForegroundColor Green 