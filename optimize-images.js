const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Ensure output directory exists
const outputDir = path.join(__dirname, 'assets', 'img', 'optimized');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Image optimization function
async function optimizeImage(inputPath, outputPath, width = null, quality = 80) {
  try {
    let image = sharp(inputPath);
    
    // Resize if width is specified
    if (width) {
      image = image.resize({ width });
    }
    
    // Convert to WebP with specified quality
    await image.webp({ quality }).toFile(outputPath);
    
    const originalSize = fs.statSync(inputPath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);
    
    console.log(`Optimized: ${path.basename(inputPath)}`);
    console.log(`  Original: ${(originalSize / 1024).toFixed(2)}KB`);
    console.log(`  Optimized: ${(optimizedSize / 1024).toFixed(2)}KB (${savings}% savings)`);
    
    return {
      original: inputPath,
      optimized: outputPath,
      originalSize,
      optimizedSize,
      savings: parseFloat(savings)
    };
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error.message);
    return null;
  }
}

// Main function
async function main() {
  try {
    // Install sharp if not already installed
    try {
      require.resolve('sharp');
    } catch (e) {
      console.log('Installing sharp...');
      execSync('npm install sharp --save-dev', { stdio: 'inherit' });
    }

    const imgDir = path.join(__dirname, 'assets', 'img');
    const files = fs.readdirSync(imgDir);
    // Log all files for debugging
    console.log('All files in directory:', files);
    
    const imageFiles = files.filter(file => {
      const isImage = /\.(jpg|jpeg|png|JPG|JPEG|PNG)$/i.test(file);
      const isNotOptimized = !file.includes('optimized');
      console.log(`File: ${file}, isImage: ${isImage}, isNotOptimized: ${isNotOptimized}`);
      return isImage && isNotOptimized;
    });

    console.log(`Found ${imageFiles.length} images to optimize\n`);

    const results = [];
    
    for (const file of imageFiles) {
      const inputPath = path.join(imgDir, file);
      const outputPath = path.join(
        outputDir,
        `${path.parse(file).name}.webp`
      );
      
      const result = await optimizeImage(inputPath, outputPath, 1200);
      if (result) {
        results.push(result);
      }
    }

    // Generate summary
    if (results.length > 0) {
      const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
      const totalOptimized = results.reduce((sum, r) => sum + r.optimizedSize, 0);
      const totalSavings = ((totalOriginal - totalOptimized) / totalOriginal * 100).toFixed(2);
      
      console.log('\n--- Optimization Summary ---');
      console.log(`Total images optimized: ${results.length}`);
      console.log(`Total original size: ${(totalOriginal / 1024).toFixed(2)}KB`);
      console.log(`Total optimized size: ${(totalOptimized / 1024).toFixed(2)}KB`);
      console.log(`Total savings: ${(totalOriginal - totalOptimized) / 1024}KB (${totalSavings}%)`);
      
      // Generate a manifest file
      const manifest = {
        generated: new Date().toISOString(),
        totalImages: results.length,
        totalOriginalSize: totalOriginal,
        totalOptimizedSize: totalOptimized,
        totalSavings: totalSavings,
        images: results.map(r => ({
          original: path.relative(__dirname, r.original),
          optimized: path.relative(__dirname, r.optimized),
          originalSize: r.originalSize,
          optimizedSize: r.optimizedSize,
          savings: r.savings
        }))
      };
      
      fs.writeFileSync(
        path.join(outputDir, 'optimization-manifest.json'),
        JSON.stringify(manifest, null, 2)
      );
      
      console.log('\nOptimization complete! Run `node update-html.js` to update image references.');
    } else {
      console.log('No images were optimized.');
    }
  } catch (error) {
    console.error('Error during optimization:', error);
    process.exit(1);
  }
}

// Run the script
main();
