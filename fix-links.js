const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const cheerio = require('cheerio');

// Configuration
const BASE_DIR = __dirname;

async function getAllHtmlFiles(dir) {
  let results = [];
  const list = await readdir(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stats = await stat(filePath);
    if (stats.isDirectory() && !['node_modules', '.git', 'assets', 'components'].includes(file)) {
      results = results.concat(await getAllHtmlFiles(filePath));
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  }
  return results;
}

async function fixLinks() {
  console.log('🔧 Starting to clean up internal links...');

  const allFiles = await getAllHtmlFiles(BASE_DIR);
  console.log(`Found ${allFiles.length} HTML files to process.`);

  for (const filePath of allFiles) {
    try {
      await processFile(filePath);
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  }

  console.log('✨ Link cleanup complete!');
  console.log('💡 You should now click "START NEW VALIDATION" in Google Search Console.');
}

async function processFile(filePath) {
  const content = await readFile(filePath, 'utf8');
  const $ = cheerio.load(content);
  let modified = false;
  const fileName = path.basename(filePath);

  // Process all links
  $('a[href]').each(function () {
    const $el = $(this);
    let href = $el.attr('href');

    if (!href) return;

    // Skip external links, mailto, etc.
    if (href.startsWith('http') || href.startsWith('//') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
      return;
    }

    let newHref = href;

    // 1. Root index.html -> /
    if (href === 'index.html' || href === './index.html') {
      newHref = '/';
    }
    // 2. ../index.html -> ../
    else if (href === '../index.html') {
      newHref = '../';
    }
    // 3. /index.html -> /
    else if (href === '/index.html') {
      newHref = '/';
    }
    // 4. Any other file ending in /index.html (e.g., tools/index.html if it existed)
    else if (href.endsWith('/index.html')) {
      newHref = href.replace(/\/index\.html$/, '/');
    }

    if (newHref !== href) {
      $el.attr('href', newHref);
      console.log(`✅ Fixed in ${fileName}: ${href} → ${newHref}`);
      modified = true;
    }
  });

  // Also fix the logo link if it points to /index.html
  $('#site-logo a[href="/index.html"]').attr('href', '/');

  // Save the file if it was modified
  if (modified) {
    await writeFile(filePath, $.html());
    console.log(`💾 Saved changes to ${fileName}`);
  }
}

// Run the script
fixLinks().catch(console.error);
