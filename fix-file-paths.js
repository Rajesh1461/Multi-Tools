const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const access = promisify(fs.access);
const readdir = promisify(fs.readdir);

// Configuration
const BASE_DIR = __dirname;
const HTML_FILES = ['index.html', 'About.html', 'Contact.html', 'blog/index.html', 'Privacy-Policy.html', 'Terms-of-Service.html'];

// Case-insensitive file search
async function findFileCaseInsensitive(dir, targetFile) {
  try {
    const files = await readdir(dir, { withFileTypes: true });
    const lowerTarget = targetFile.toLowerCase();
    
    for (const file of files) {
      if (file.name.toLowerCase() === lowerTarget) {
        return path.join(dir, file.name);
      }
    }
    return null;
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
    return null;
  }
}

// Check if a file exists (case-insensitive)
async function fileExists(filePath) {
  try {
    await access(filePath, fs.constants.F_OK);
    return true;
  } catch (error) {
    // If file doesn't exist, try case-insensitive search
    const dir = path.dirname(filePath);
    const fileName = path.basename(filePath);
    const foundPath = await findFileCaseInsensitive(dir, fileName);
    return foundPath || false;
  }
}

// Fix links in HTML content
async function fixLinks(html, filePath) {
  const cheerio = require('cheerio');
  const $ = cheerio.load(html);
  let modified = false;
  
  // Process all links and resources
  $('a[href], link[href], script[src], img[src]').each(async function() {
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
    
    // Remove query parameters and hashes for file checking
    const cleanUrl = url.split('?')[0].split('#')[0];
    const fullPath = path.resolve(path.dirname(filePath), cleanUrl);
    
    // Check if file exists (case-insensitive)
    const exists = await fileExists(fullPath);
    
    if (!exists) {
      console.log(`❌ Broken link found in ${path.basename(filePath)}: ${url}`);
      
      // Try to find the correct case-sensitive path
      const dir = path.dirname(fullPath);
      const fileName = path.basename(fullPath);
      const foundPath = await findFileCaseInsensitive(dir, fileName);
      
      if (foundPath) {
        // Calculate the new relative path
        const relativePath = path.relative(path.dirname(filePath), foundPath).replace(/\\/g, '/');
        
        // Preserve query parameters and hash
        const urlObj = new URL(`http://example.com/${url}`);
        const newUrl = relativePath + (urlObj.search || '') + (urlObj.hash || '');
        
        // Update the attribute
        $el.attr(attr, newUrl);
        modified = true;
        console.log(`✅ Fixed: ${url} → ${newUrl}`);
      } else {
        console.log(`⚠️  Could not find: ${url}`);
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
      // Check if file exists (case-sensitive)
      try {
        await access(filePath, fs.constants.F_OK);
      } catch (error) {
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

// Run the script
processFiles().catch(console.error);
