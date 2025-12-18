const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Configuration
const IMG_DIR = path.join(__dirname, 'assets', 'img');
const OPTIMIZED_DIR = path.join(IMG_DIR, 'optimized');
const HTML_DIR = __dirname;

// Get all HTML files
async function getHtmlFiles(dir) {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
  const htmlFiles = [];
  
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    
    if (dirent.isDirectory() && !res.includes('node_modules') && !res.includes('.git')) {
      htmlFiles.push(...(await getHtmlFiles(res)));
    } else if (dirent.name.endsWith('.html')) {
      htmlFiles.push(res);
    }
  }
  
  return htmlFiles;
}

// Get optimized image mapping
function getOptimizedImages() {
  const manifestPath = path.join(OPTIMIZED_DIR, 'optimization-manifest.json');
  
  if (!fs.existsSync(manifestPath)) {
    console.error('Optimization manifest not found. Please run optimize-images.js first.');
    process.exit(1);
  }
  
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const imageMap = new Map();
  
  for (const img of manifest.images) {
    const originalName = path.basename(img.original);
    const optimizedName = path.basename(img.optimized);
    imageMap.set(originalName, optimizedName);
  }
  
  return imageMap;
}

// Update image references in HTML
async function updateHtmlFile(filePath, imageMap) {
  try {
    let content = await readFile(filePath, 'utf8');
    let updated = false;
    
    // Update img tags
    content = content.replace(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi, (match, src) => {
      const fileName = path.basename(src);
      
      if (imageMap.has(fileName)) {
        const newSrc = src.replace(fileName, `assets/img/optimized/${imageMap.get(fileName)}`);
        
        // Add loading="lazy" if not present
        if (!match.includes('loading=')) {
          match = match.replace('<img', '<img loading="lazy"');
        }
        
        // Add width and height if not present
        if (!match.includes('width=') && !match.includes('height=')) {
          // This is a simplified example - in a real scenario, you'd want to get actual image dimensions
          match = match.replace('<img', '<img width="800" height="600"');
        }
        
        updated = true;
        return match.replace(src, newSrc);
      }
      
      return match;
    });
    
    // Update CSS background images
    content = content.replace(/background(-image)?\s*:[^;]*url\(['"]?([^)'"]+)['"]?\)/gi, (match, prop, url) => {
      const fileName = path.basename(url);
      
      if (imageMap.has(fileName)) {
        const newUrl = url.replace(fileName, `assets/img/optimized/${imageMap.get(fileName)}`);
        updated = true;
        return match.replace(url, newUrl);
      }
      
      return match;
    });
    
    if (updated) {
      await writeFile(filePath, content, 'utf8');
      console.log(`Updated: ${path.relative(process.cwd(), filePath)}`);
    }
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
  }
}

// Main function
async function main() {
  try {
    const htmlFiles = await getHtmlFiles(HTML_DIR);
    const imageMap = getOptimizedImages();
    
    if (imageMap.size === 0) {
      console.log('No optimized images found. Please run optimize-images.js first.');
      return;
    }
    
    console.log(`Found ${htmlFiles.length} HTML files to process`);
    console.log(`Found ${imageMap.size} optimized images\n`);
    
    for (const file of htmlFiles) {
      await updateHtmlFile(file, imageMap);
    }
    
    console.log('\nUpdate complete!');
  } catch (error) {
    console.error('Error during update:', error);
    process.exit(1);
  }
}

// Run the script
main();
