Get-ChildItem -Path 'tools\*.html' | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    # Remove the entire row mt-4 section with ad placeholder
    $content = $content -replace '<!-- Ad Placeholder -->\s*<div class="row mt-4">\s*<div class="col-12 text-center">\s*<div class="ad-placeholder bg-secondary p-3 rounded">Ad Space</div>\s*</div>\s*</div>', ''
    # Also remove any standalone row mt-4 with ad placeholder
    $content = $content -replace '<div class="row mt-4">\s*<div class="col-12 text-center">\s*<div class="ad-placeholder bg-secondary p-3 rounded">Ad Space</div>\s*</div>\s*</div>', ''
    Set-Content $_.FullName $content -NoNewline
    Write-Host "Processed: $($_.Name)"
} 