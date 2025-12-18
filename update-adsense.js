const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, 'tools');
const adSenseCode = `    <!-- AdSense Script with Error Handling -->
    <script>
      // AdSense initialization with error handling
      (function() {
        var adScript = document.createElement('script');
        adScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3712069892669914';
        adScript.async = true;
        adScript.crossOrigin = 'anonymous';
        
        // Add error handling
        adScript.onerror = function() {
          console.warn('Failed to load AdSense script. This is normal if you have an ad blocker enabled.');
          // Fallback to a non-blocking error handler
          window.adsbygoogle = window.adsbygoogle || [];
          window.adsbygoogle.push({});
        };
        
        // Insert the script in the head
        document.head.appendChild(adScript);
      })();
    </script>`;

// Pattern to find the old AdSense script
const oldAdSensePattern = /<script\s+[^>]*src=["']https?:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js[^>]*>[\s\S]*?<\/script>/i;

function updateAdSenseInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file already has the new AdSense code
    if (content.includes('AdSense Script with Error Handling')) {
      console.log(`✅ Already up to date: ${path.relative(__dirname, filePath)}`);
      return false;
    }
    
    // Replace old AdSense code if it exists
    if (oldAdSensePattern.test(content)) {
      content = content.replace(oldAdSensePattern, adSenseCode);
      console.log(`🔄 Updated AdSense in: ${path.relative(__dirname, filePath)}`);
    } else {
      // Insert new AdSense code before the first </head> tag
      const headCloseIndex = content.indexOf('</head>');
      if (headCloseIndex !== -1) {
        content = content.slice(0, headCloseIndex) + 
                 '\n' + adSenseCode + '\n' + 
                 content.slice(headCloseIndex);
        console.log(`✨ Added AdSense to: ${path.relative(__dirname, filePath)}`);
      } else {
        console.warn(`⚠️  No </head> tag found in: ${path.relative(__dirname, filePath)}`);
        return false;
      }
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
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
        if (updateAdSenseInFile(fullPath)) {
          filesUpdated++;
        }
      }
    });
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error.message);
  }
  
  return filesUpdated;
}

console.log('🚀 Starting AdSense update process...\n');
const updatedCount = processDirectory(toolsDir);
console.log(`\n✨ Update complete! ${updatedCount} files were updated.`);
