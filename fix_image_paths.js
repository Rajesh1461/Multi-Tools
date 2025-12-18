const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, 'blog');

// Read all HTML files in the blog directory
fs.readdir(blogDir, (err, files) => {
  if (err) {
    console.error('Error reading blog directory:', err);
    return;
  }

  const htmlFiles = files.filter(file => file.endsWith('.html') && file !== 'index.html');
  
  htmlFiles.forEach(file => {
    const filePath = path.join(blogDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix the duplicate assets/img path
    const fixedContent = content.replace(
      /src="\.\.\/assets\/img\/assets\/img\/optimized\/([^"]+)"/g,
      'src="../assets/img/optimized/$1"'
    );
    
    // Write the fixed content back to the file
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    console.log(`Fixed image paths in ${file}`);
  });
  
  console.log('All blog post image paths have been fixed!');
});
