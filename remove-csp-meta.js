const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Configuration
const CONFIG = {
    // Directly process HTML files in the tools directory
    toolsDir: path.join(__dirname, 'tools'),
    createBackup: true,
    backupDir: 'csp_cleanup_backup',
    cspPattern: /<meta\s+http-equiv=["']Content-Security-Policy["'][^>]*>/gi
};

// Create backup directory
function ensureBackupDir() {
    if (!CONFIG.createBackup) return null;
    
    const backupPath = path.join(process.cwd(), CONFIG.backupDir);
    if (!fs.existsSync(backupPath)) {
        fs.mkdirSync(backupPath, { recursive: true });
    }
    return backupPath;
}

// Create a backup of the file
function backupFile(filePath, backupPath) {
    if (!CONFIG.createBackup) return;
    
    const relativePath = path.relative(process.cwd(), filePath);
    const backupFilePath = path.join(backupPath, relativePath);
    const backupDir = path.dirname(backupFilePath);
    
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }
    
    fs.copyFileSync(filePath, backupFilePath);
}

// Process files
async function main() {
    console.log('🚀 Starting CSP Meta Tag Cleanup');
    console.log('--------------------------------');
    
    // Get all HTML files in the tools directory
    if (!fs.existsSync(CONFIG.toolsDir)) {
        console.log(`❌ Tools directory not found: ${CONFIG.toolsDir}`);
        return;
    }
    
    const htmlFiles = fs.readdirSync(CONFIG.toolsDir)
        .filter(file => file.endsWith('.html'))
        .map(file => path.join(CONFIG.toolsDir, file));
    
    if (htmlFiles.length === 0) {
        console.log('❌ No HTML files found in the tools directory.');
        return;
    }
    
    // Find files with CSP tags
    const filesWithCSP = [];
    for (const filePath of htmlFiles) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (CONFIG.cspPattern.test(content)) {
            filesWithCSP.push(filePath);
            CONFIG.cspPattern.lastIndex = 0; // Reset regex
        }
    }
    
    if (filesWithCSP.length === 0) {
        console.log('✅ No files with CSP meta tags found. Nothing to do!');
        return;
    }
    
    console.log(`🔍 Found ${filesWithCSP.length} files with CSP meta tags`);
    
    // Create backup directory
    const backupPath = ensureBackupDir();
    if (CONFIG.createBackup) {
        console.log(`📦 Creating backups in: ${path.join(process.cwd(), CONFIG.backupDir)}`);
    }
    
    // Process files
    console.log('\n🔄 Processing files...');
    const results = {
        total: filesWithCSP.length,
        modified: 0,
        errors: 0,
        modifiedFiles: []
    };
    
    for (const filePath of filesWithCSP) {
        try {
            const relativePath = path.relative(process.cwd(), filePath);
            let content = fs.readFileSync(filePath, 'utf8');
            const originalContent = content;
            
            // Remove the CSP meta tag
            content = content.replace(CONFIG.cspPattern, '');
            
            if (content !== originalContent) {
                if (CONFIG.createBackup) {
                    backupFile(filePath, backupPath);
                }
                
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`✅ Modified: ${relativePath}`);
                results.modified++;
                results.modifiedFiles.push(relativePath);
            }
        } catch (error) {
            console.error(`❌ Error processing ${filePath}:`, error.message);
            results.errors++;
        }
    }
    
    // Print summary
    console.log('\n📊 Summary:');
    console.log('--------------------------------');
    console.log(`✅ Total files with CSP: ${results.total}`);
    console.log(`✅ Files modified: ${results.modified}`);
    console.log(`❌ Errors: ${results.errors}`);
    
    if (results.modified > 0 && CONFIG.createBackup) {
        console.log(`\n💾 Backups were created in: ${path.join(process.cwd(), CONFIG.backupDir)}`);
    }
    
    console.log('\n✨ CSP Meta Tag Cleanup Complete!');
}

// Run the script
main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
