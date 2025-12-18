const fs = require('fs');
const path = require('path');

const filesToFix = [
  'tools/image-cropper.html',
  'tools/wedding-invitation-generator.html'
];

function fixDuplicateIncludes(filePath) {
  const fullPath = path.join(__dirname, filePath);
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    const includePattern = /<script[^>]*src=["'][^"']*include\.js(?:\?v=\d+)?["'][^>]*>/gi;
    const matches = content.match(includePattern);
    
    if (matches && matches.length > 1) {
      console.log(`🔧 Fixing duplicate includes in ${filePath}`);
      
      // Keep only the first occurrence
      const firstInclude = matches[0];
      const otherIncludes = matches.slice(1);
      
      // Replace all occurrences with an empty string, then add back the first one
      let newContent = content.replace(includePattern, '');
      
      // Find the best position to insert the include (before the first script or at the end of head)
      const headEnd = newContent.indexOf('</head>');
      const firstScript = newContent.indexOf('<script');
      
      if (headEnd !== -1) {
        // Insert before the first script or at the end of head
        const insertPos = firstScript !== -1 ? firstScript : headEnd;
        newContent = newContent.slice(0, insertPos) + 
                    `\n  ${firstInclude}\n` + 
                    newContent.slice(insertPos);
      } else {
        // If no head tag, just prepend to body
        newContent = firstInclude + '\n' + newContent;
      }
      
      // Write the fixed content back to the file
      fs.writeFileSync(fullPath, newContent, 'utf8');
      console.log(`✅ Fixed ${filePath}`);
    } else {
      console.log(`✅ No duplicates found in ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Process each file
console.log('🚀 Starting to fix duplicate includes...\n');
filesToFix.forEach(fixDuplicateIncludes);
console.log('\n✨ All files processed!');
