const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname);
const includePattern = /<script[^>]*src=["'][^"']*include\.js(?:\?v=\d+)?["'][^>]*>/gi;

function checkForDuplicateIncludes() {
  console.log('🔍 Checking for multiple include.js inclusions...\n');
  
  // Get all HTML files in the project
  const htmlFiles = [];
  
  // Function to recursively find HTML files
  function findHtmlFiles(directory) {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
      const fullPath = path.join(directory, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !['node_modules', '.git', 'assets', 'components'].includes(file)) {
        findHtmlFiles(fullPath);
      } else if (file.endsWith('.html')) {
        htmlFiles.push(fullPath);
      }
    });
  }
  
  // Start searching from the root directory
  findHtmlFiles(rootDir);
  
  let issuesFound = false;
  
  // Check each HTML file
  htmlFiles.forEach(filePath => {
    const relativePath = path.relative(rootDir, filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    const matches = content.match(includePattern);
    
    if (matches && matches.length > 1) {
      console.log(`❌ Found ${matches.length} includes in ${relativePath}:`);
      matches.forEach((match, index) => {
        const lineNumber = content.substr(0, content.indexOf(match)).split('\n').length;
        console.log(`   ${index + 1}. Line ${lineNumber}: ${match.trim()}`);
      });
      console.log('');
      issuesFound = true;
    }
  });
  
  if (!issuesFound) {
    console.log('✅ No duplicate include.js files found!');
  } else {
    console.log('\n💡 Recommendation: Ensure include.js is only included once per page.');
    console.log('   Remove any additional script tags that load include.js.');
  }
  
  return issuesFound;
}

// Run the check
checkForDuplicateIncludes();
