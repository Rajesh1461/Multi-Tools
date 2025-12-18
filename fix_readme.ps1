# PowerShell script to fix README.md conflict markers

$content = Get-Content "README.md" -Raw

# Remove conflict markers and keep the clean version
$content = $content -replace "<<<<<<< HEAD\s*\r?\n.*?\r?\n=======\s*\r?\n.*?\r?\n>>>>>>> [a-f0-9]+", ""

# Clean up any remaining conflict markers
$content = $content -replace "<<<<<<< HEAD\s*\r?\n", ""
$content = $content -replace "=======\s*\r?\n", ""
$content = $content -replace ">>>>>>> [a-f0-9]+\s*\r?\n", ""

# Ensure we have the clean update message
$content = $content -replace "(\*\*Latest Update:\*\*.*?)(?=\n##)", "**Latest Update:** Image Resizer file browser functionality has been fixed and improved! ✅"

Set-Content "README.md" -Value $content -Encoding UTF8

Write-Host "README.md conflict markers have been removed."
