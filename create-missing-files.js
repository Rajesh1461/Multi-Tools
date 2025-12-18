const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

async function createMissingFiles() {
  console.log('🔧 Creating missing files...');
  
  // Create directories if they don't exist
  const dirs = [
    'assets/css',
    'assets/js',
    'blog'
  ];
  
  for (const dir of dirs) {
    const fullPath = path.join(__dirname, dir);
    if (!fs.existsSync(fullPath)) {
      await mkdir(fullPath, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  }
  
  // Create missing files
  const files = [
    {
      path: 'assets/css/non-critical.css',
      content: '/* Non-critical CSS will be loaded here */'
    },
    {
      path: 'assets/css/style-minified.css',
      content: '/* Minified CSS will be generated here */'
    },
    {
      path: 'sw-config.js',
      content: '// Service Worker Configuration\nconsole.log("Service Worker config loaded");'
    },
    {
      path: 'assets/js/simple-tool-loader.js',
      content: '// Simple Tool Loader\nconsole.log("Simple Tool Loader initialized");'
    },
    {
      path: 'assets/js/performance-optimizer.js',
      content: '// Performance Optimizer\nconsole.log("Performance Optimizer initialized");'
    },
    {
      path: 'About.html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About Us - Multi-Tools</title>
  <link rel="stylesheet" href="assets/css/style-minified.css">
</head>
<body>
  <h1>About Us</h1>
  <p>Information about Multi-Tools will be added here.</p>
  <a href="index.html">Back to Home</a>
</body>
</html>`
    },
    {
      path: 'Contact.html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Us - Multi-Tools</title>
  <link rel="stylesheet" href="assets/css/style-minified.css">
</head>
<body>
  <h1>Contact Us</h1>
  <p>Contact information will be added here.</p>
  <a href="index.html">Back to Home</a>
</body>
</html>`
    },
    {
      path: 'blog/index.html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog - Multi-Tools</title>
  <link rel="stylesheet" href="../assets/css/style-minified.css">
</head>
<body>
  <h1>Blog</h1>
  <p>Blog posts will be listed here.</p>
  <a href="../index.html">Back to Home</a>
</body>
</html>`
    },
    {
      path: 'Privacy-Policy.html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Policy - Multi-Tools</title>
  <link rel="stylesheet" href="assets/css/style-minified.css">
</head>
<body>
  <h1>Privacy Policy</h1>
  <p>Our privacy policy will be detailed here.</p>
  <a href="index.html">Back to Home</a>
</body>
</html>`
    },
    {
      path: 'Terms-of-Service.html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Terms of Service - Multi-Tools</title>
  <link rel="stylesheet" href="assets/css/style-minified.css">
</head>
<body>
  <h1>Terms of Service</h1>
  <p>Our terms of service will be detailed here.</p>
  <a href="index.html">Back to Home</a>
</body>
</html>`
    }
  ];
  
  for (const file of files) {
    const fullPath = path.join(__dirname, file.path);
    if (!fs.existsSync(fullPath)) {
      await writeFile(fullPath, file.content, 'utf8');
      console.log(`✅ Created file: ${file.path}`);
    } else {
      console.log(`ℹ️ File already exists: ${file.path}`);
    }
  }
  
  console.log('✨ All missing files have been created!');
  console.log('💡 Run `node check-links.js` again to verify the fixes');
}

// Run the script
createMissingFiles().catch(console.error);
