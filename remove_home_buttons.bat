@echo off
echo Removing Home buttons from all HTML files...
echo.

REM Change to the tools directory
cd /d "%~dp0tools"

REM Use PowerShell to remove Home buttons from all HTML files
powershell -Command "Get-ChildItem -Filter '*.html' | ForEach-Object { $content = Get-Content $_.FullName -Raw; $originalContent = $content; $content = $content -replace '<a[^>]*class=\"[^\"]*btn[^\"]*btn-danger[^\"]*home-btn-font[^\"]*\"[^>]*>Home</a>', ''; $content = $content -replace '<a[^>]*>Home</a>', ''; if ($content -ne $originalContent) { Set-Content $_.FullName $content; Write-Host \"Updated: $($_.Name)\" } else { Write-Host \"No changes needed: $($_.Name)\" } }"

echo.
echo Home button removal completed!
echo.
pause 