const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const access = promisify(fs.access);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Configuration
const BASE_DIR = __dirname;
const HTML_FILES = ['index.html', 'About.html', 'Contact.html', 'blog/index.html', 'Privacy-Policy.html', 'Terms-of-Service.html'];

// Cache for directory listings
const dirCache = new Map();

// Get case-sensitive file name
async function getCaseSensitivePath(filePath) {
  const dir = path.dirname(filePath);
  const fileName = path.basename(filePath);
  
  // Check if directory is in cache
  if (!dirCache.has(dir)) {
    try {
      const files = await readdir(dir);
      dirCache.set(dir, files);
    } catch (error) {
      console.error(`❌ Error reading directory ${dir}:`, error.message);
      return null;
    }
  }
  
  const files = dirCache.get(dir);
  const lowerFileName = fileName.toLowerCase();
  
  // Find matching file (case-insensitive)
  const matchingFile = files.find(f => f.toLowerCase() === lowerFileName);
  
  if (matchingFile) {
    return path.join(dir, matchingFile);
  }
  
  return null;
}

// Check if file exists (case-sensitive)
async function fileExists(filePath) {
  try {
    await access(filePath, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

// Fix links in HTML content
async function fixLinks(html, filePath) {
  const cheerio = require('cheerio');
  const $ = cheerio.load(html);
  let modified = false;
  
  // Process all links and resources
  $('a[href], link[href], script[src], img[src]').each(function() {
    const $el = $(this);
    const attr = $el.attr('href') ? 'href' : 'src';
    let url = $el.attr(attr);
    
    // Skip external URLs and special protocols
    if (!url || 
        url.startsWith('http') || 
        url.startsWith('//') ||
        url.startsWith('data:') ||
        url.startsWith('mailto:') ||
        url.startsWith('tel:')) {
      return;
    }
    
    // Handle root-relative paths
    if (url.startsWith('/')) {
      url = url.substring(1);
      url = path.join(BASE_DIR, url);
    } else {
      url = path.resolve(path.dirname(filePath), url);
    }
    
    // Remove query parameters and hashes for file checking
    const cleanUrl = url.split('?')[0].split('#')[0];
    
    // Check if file exists with exact case
    const exists = fs.existsSync(cleanUrl);
    
    if (!exists) {
      // Try to find the correct case
      const caseSensitivePath = getCaseSensitivePath(cleanUrl);
      
      if (caseSensitivePath) {
        // Calculate the new relative path
        const relativePath = path.relative(path.dirname(filePath), caseSensitivePath).replace(/\\/g, '/');
        
        // Preserve query parameters and hash
        const urlObj = new URL(`http://example.com/${$el.attr(attr)}`);
        const newUrl = relativePath + (urlObj.search || '') + (urlObj.hash || '');
        
        // Update the attribute
        $el.attr(attr, newUrl);
        modified = true;
        console.log(`✅ Fixed: ${$el.attr(attr)} → ${newUrl}`);
      } else {
        console.log(`⚠️  Could not find: ${cleanUrl}`);
      }
    }
  });
  
  if (modified) {
    return $.html();
  }
  return null;
}

// Process all HTML files
async function processFiles() {
  console.log('🔍 Checking and fixing file paths...');
  
  for (const file of HTML_FILES) {
    const filePath = path.join(BASE_DIR, file);
    
    try {
      // Check if file exists
      const exists = await fileExists(filePath);
      if (!exists) {
        console.log(`⚠️  File not found: ${filePath}`);
        continue;
      }
      
      console.log(`\n📄 Processing: ${file}`);
      const content = await readFile(filePath, 'utf8');
      const fixedContent = await fixLinks(content, filePath);
      
      if (fixedContent) {
        await writeFile(filePath, fixedContent, 'utf8');
        console.log(`💾 Saved changes to ${file}`);
      } else {
        console.log(`✅ No broken links found in ${file}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }
  
  console.log('\n✨ File path check complete!');
}

// Create missing directories and files
async function createMissingFiles() {
  console.log('\n🔧 Creating missing files and directories...');
  
  const filesToCreate = [
    'assets/css/non-critical.css',
    'assets/css/style-minified.css',
    'sw-config.js',
    'assets/js/simple-tool-loader.js',
    'assets/js/performance-optimizer.js'
  ];
  
  for (const file of filesToCreate) {
    const filePath = path.join(BASE_DIR, file);
    const dir = path.dirname(filePath);
    
    try {
      // Create directory if it doesn't exist
      if (!fs.existsSync(dir)) {
        await fs.promises.mkdir(dir, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
      }
      
      // Create file if it doesn't exist
      if (!fs.existsSync(filePath)) {
        let content = '';
        
        if (file.endsWith('.css')) {
          content = '/* ' + path.basename(file) + ' */\n';
        } else if (file.endsWith('.js')) {
          content = '// ' + path.basename(file) + '\n';
          content += 'console.log("' + path.basename(file, '.js') + ' loaded");\n';
        }
        
        await writeFile(filePath, content, 'utf8');
        console.log(`✅ Created file: ${file}`);
      }
    } catch (error) {
      console.error(`❌ Error creating ${file}:`, error.message);
    }
  }
  
  console.log('\n✨ File creation complete!');
}

// Run the scripts
async function main() {
  await processFiles();
  await createMissingFiles();
  
  console.log('\n🎉 All done! Run `node check-links.js` to verify the fixes.');
}

main().catch(console.error);
