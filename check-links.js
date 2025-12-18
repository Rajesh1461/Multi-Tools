const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { URL } = require('url');

const SITE_ROOT = __dirname;
const IGNORE_EXTENSIONS = ['.css', '.js', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
const IGNORE_LINKS = ['#', 'javascript:void(0)'];

let processedFiles = new Set();
let brokenLinks = [];

async function checkFile(filePath) {
  if (processedFiles.has(filePath)) return;
  processedFiles.add(filePath);

  console.log(`Checking: ${path.relative(SITE_ROOT, filePath)}`);
  
  try {
    const content = await fs.promises.readFile(filePath, 'utf8');
    const dom = new JSDOM(content);
    const document = dom.window.document;
    
    // Check all links
    const links = document.querySelectorAll('a[href]');
    for (const link of links) {
      const href = link.getAttribute('href');
      
      // Skip ignored links
      if (IGNORE_LINKS.includes(href) || !href.trim()) continue;
      
      // Handle relative URLs
      let targetPath;
      try {
        const url = new URL(href, 'file://' + path.resolve(filePath));
        if (url.protocol === 'file:') {
          targetPath = url.pathname.replace(/^\/([a-z]:\/)/i, '$1');
          
          // Check if file exists
          if (!fs.existsSync(targetPath)) {
            brokenLinks.push({
              source: path.relative(SITE_ROOT, filePath),
              link: href,
              target: targetPath,
              type: 'broken'
            });
          } else if (path.extname(targetPath) === '.html' && !processedFiles.has(targetPath)) {
            // Recursively check HTML files
            await checkFile(targetPath);
          }
        }
      } catch (e) {
        console.error(`Error processing link ${href} in ${filePath}:`, e.message);
      }
    }
    
    // Check script and link tags
    const resources = [
      ...document.querySelectorAll('script[src], link[rel="stylesheet"][href]')
    ];
    
    for (const resource of resources) {
      const src = resource.getAttribute('src') || resource.getAttribute('href');
      if (!src || IGNORE_LINKS.includes(src)) continue;
      
      try {
        const url = new URL(src, 'file://' + path.resolve(filePath));
        if (url.protocol === 'file:') {
          const resourcePath = url.pathname.replace(/^\/([a-z]:\/)/i, '$1');
          if (!fs.existsSync(resourcePath)) {
            brokenLinks.push({
              source: path.relative(SITE_ROOT, filePath),
              link: src,
              target: resourcePath,
              type: 'missing_resource'
            });
          }
        }
      } catch (e) {
        console.error(`Error processing resource ${src} in ${filePath}:`, e.message);
      }
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

async function main() {
  // Install JSDOM if not already installed
  try {
    require.resolve('jsdom');
  } catch (e) {
    console.log('Installing jsdom...');
    const { execSync } = require('child_process');
    execSync('npm install jsdom', { stdio: 'inherit' });
  }

  // Start checking from index.html
  await checkFile(path.join(SITE_ROOT, 'index.html'));
  
  // Generate report
  if (brokenLinks.length > 0) {
    console.log('\n=== Broken Links Report ===');
    console.log(`Found ${brokenLinks.length} issues:\n`);
    
    const report = {
      generated: new Date().toISOString(),
      brokenLinks: brokenLinks.map(link => ({
        source: link.source,
        link: link.link,
        target: link.target,
        type: link.type
      }))
    };
    
    // Save report
    const reportPath = path.join(SITE_ROOT, 'broken-links-report.json');
    await fs.promises.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`Report saved to: ${path.relative(SITE_ROOT, reportPath)}`);
    console.log('\nBroken Links:');
    brokenLinks.forEach((link, index) => {
      console.log(`\n${index + 1}. Source: ${link.source}`);
      console.log(`   Link: ${link.link}`);
      console.log(`   Target: ${link.target}`);
      console.log(`   Type: ${link.type}`);
    });
  } else {
    console.log('\nNo broken links found!');
  }
}

main().catch(console.error);
