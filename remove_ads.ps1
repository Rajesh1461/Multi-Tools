# PowerShell script to remove all 'Ad Space Middle' and 'Ad Space Bottom' lines from all HTML files
# Run this script from the root directory of the project

$toolsDir = "tools"
$files = Get-ChildItem -Path $toolsDir -Filter "*.html" -Recurse

foreach ($file in $files) {
    Write-Host "Processing: $($file.Name)"
    $lines = Get-Content -Path $file.FullName -Encoding UTF8
    $filtered = $lines | Where-Object { $_ -notmatch 'Ad Space Middle' -and $_ -notmatch 'Ad Space Bottom' -and $_.Trim() -notmatch 'Ad Space Bottom' }
    Set-Content -Path $file.FullName -Value $filtered -Encoding UTF8
    Write-Host "Completed: $($file.Name)" -ForegroundColor Green
}

Write-Host "All files processed successfully!" -ForegroundColor Green 