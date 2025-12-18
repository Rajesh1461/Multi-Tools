const fs = require('fs');
const path = require('path');

function fixDoctypeInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file already has a DOCTYPE
    if (!/^<!DOCTYPE\s+html>/i.test(content)) {
      // Add DOCTYPE at the beginning of the file
      content = '<!DOCTYPE html>\n' + content;
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Added DOCTYPE to: ${path.relative(process.cwd(), filePath)}`);
      return true;
    }
    
    // Check for incorrect DOCTYPE
    if (/<!DOCTYPE[^>]+>/i.test(content) && !/^<!DOCTYPE\s+html>/i.test(content)) {
      // Replace incorrect DOCTYPE
      content = content.replace(/<![^>]+>/, '<!DOCTYPE html>');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`🔄 Fixed DOCTYPE in: ${path.relative(process.cwd(), filePath)}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(directory) {
  let filesUpdated = 0;
  
  try {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
      const fullPath = path.join(directory, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and other non-essential directories
        if (!['node_modules', '.git', 'assets', 'components'].includes(file)) {
          filesUpdated += processDirectory(fullPath);
        }
      } else if (file.endsWith('.html')) {
        if (fixDoctypeInFile(fullPath)) {
          filesUpdated++;
        }
      }
    });
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error.message);
  }
  
  return filesUpdated;
}

console.log('🚀 Starting DOCTYPE check and fix...\n');
const updatedCount = processDirectory(process.cwd());
console.log(`\n✨ Fix complete! ${updatedCount} files were updated.`);
