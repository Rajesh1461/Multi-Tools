// Image optimization for better performance
document.addEventListener('DOMContentLoaded', function() {
  // Lazy loading for images
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for older browsers
    images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }

  // Optimize image loading with WebP support
  function optimizeImage(img) {
    if (img.dataset.src) {
      // Check for WebP support
      const canvas = document.createElement('canvas');
      const webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      
      if (webpSupported && img.dataset.src.includes('.jpg')) {
        img.dataset.src = img.dataset.src.replace('.jpg', '.webp');
      }
    }
  }

  // Apply optimization to all images
  images.forEach(optimizeImage);
});
