# Image Optimization for MultiTools

This guide explains how to optimize images for the MultiTools website to improve performance and load times.

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

## Optimizing Images

1. **Run the optimization script**:
   ```bash
   npm run optimize
   ```
   This will:
   - Find all JPG, JPEG, and PNG images in the `assets/img` directory
   - Convert them to WebP format with optimized quality
   - Save the optimized versions to `assets/img/optimized`
   - Generate an optimization manifest

2. **Update HTML files**:
   ```bash
   npm run update-html
   ```
   This will:
   - Scan all HTML files in the project
   - Update image references to use the optimized WebP versions
   - Add `loading="lazy"` to images for lazy loading
   - Add width and height attributes to prevent layout shifts

3. **Or run both steps at once**:
   ```bash
   npm run optimize-all
   ```

## Best Practices

1. **Image Formats**:
   - Use WebP format for all images (best balance of quality and size)
   - Keep original images as backup

2. **Image Sizes**:
   - The script automatically resizes images to a maximum width of 1200px
   - For very large images, consider creating multiple sizes for different screen resolutions

3. **Lazy Loading**:
   - The script adds `loading="lazy"` to all images below the fold
   - This defers loading of offscreen images until they're about to come into view

4. **Responsive Images**:
   - For critical images, consider using the `srcset` attribute to serve different sizes
   - Example:
     ```html
     <img 
       src="image.jpg" 
       srcset="image-400.jpg 400w, image-800.jpg 800w, image-1200.jpg 1200w"
       sizes="(max-width: 600px) 100vw, 50vw"
       alt="Description"
       loading="lazy"
     >
     ```

## Verifying Optimization

1. Check the console output for optimization statistics
2. The `optimization-manifest.json` file contains details about all optimizations
3. Use browser DevTools to verify image loading and sizes

## Notes

- Original images are preserved in the `assets/img` directory
- Optimized images are saved in `assets/img/optimized`
- The script skips images that have already been optimized
