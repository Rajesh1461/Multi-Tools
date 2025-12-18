# PowerShell script to remove manual FAQ sections from files that have include.js
# This ensures FAQ tabs are handled by include.js instead of manual sections

$filesWithManualFAQ = @(
    "age-calculator.html",
    "base64-encoder-decoder.html", 
    "color-picker.html",
    "compound-interest-calculator.html",
    "discount-calculator.html",
    "flip-a-coin.html",
    "hash-generator.html",
    "image-resizer.html",
    "loan-emi-calculator.html",
    "percentage-calculator.html",
    "random-number-generator.html",
    "random-text-generator.html",
    "sql-formatter.html",
    "text-to-speech.html",
    "time-zone-converter.html",
    "url-shortener.html"
)

Write-Host "Starting FAQ section cleanup for $($filesWithManualFAQ.Count) files..."

foreach ($file in $filesWithManualFAQ) {
    if (Test-Path $file) {
        Write-Host "Processing: $file"
        
        # Read the file content
        $content = Get-Content $file -Raw
        
        # Pattern to match FAQ section (from <!-- FAQ Section --> to the closing </div>)
        $faqPattern = '(?s)<!-- FAQ Section -->.*?</div>\s*</div>\s*</div>\s*</div>\s*'
        
        # Remove the FAQ section
        $newContent = $content -replace $faqPattern, ''
        
        # Write the updated content back
        Set-Content -Path $file -Value $newContent -NoNewline
        
        Write-Host "✓ Cleaned FAQ section from $file"
    } else {
        Write-Host "✗ File not found: $file"
    }
}

Write-Host "FAQ section cleanup completed!"
Write-Host "All files should now use include.js for FAQ tabs instead of manual sections."
