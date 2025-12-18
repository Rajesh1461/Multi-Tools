// Optimized include.js - Removed unused code and optimized for performance
const vParam = `?v=${Date.now()}`;

document.addEventListener('DOMContentLoaded', function() {
  // Mark tools pages with a common class for consistent styling
  if (window.location.pathname.includes('/tools/')) {
    document.body.classList.add('tool-page');
  }

  // Determine the correct path prefix
  const pathPrefix = window.location.pathname.includes('/tools/') || window.location.pathname.includes('/blog/') ? '../components/' : 'components/';

  // Load header component
  fetch(pathPrefix + 'header.html' + vParam)
    .then(res => res.text())
    .then(data => {
      document.getElementById('header').innerHTML = data;
      
      // Fix header links for production
      const isLocalEnv = ['localhost', '127.0.0.1'].includes(window.location.hostname);
      if (!isLocalEnv) {
        const headerLinks = document.querySelectorAll('#header a[href="index.html"]');
        headerLinks.forEach(link => {
          link.href = 'https://multitoolszone.fun/';
        });

        // Normalize index.html links
        const allIndexLinks = document.querySelectorAll('a[href$="index.html"], a[href="/index.html"], a[href="../index.html"]');
        allIndexLinks.forEach(function(a){ a.href = 'https://multitoolszone.fun/'; });
      }
    })
    .catch(error => console.log('Error loading header:', error));

  // Load footer component
  fetch(pathPrefix + 'footer.html' + vParam)
    .then(res => res.text())
    .then(data => {
      document.getElementById('footer').innerHTML = data;
      
      // Enable image lazy-loading after components load
      const images = document.querySelectorAll('img[data-src]');
      if (images.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              observer.unobserve(img);
            }
          });
        });

        images.forEach(img => imageObserver.observe(img));
      }
    })
    .catch(error => console.log('Error loading footer:', error));

  // Optimized ad loading - only load if ads containers exist
  const adContainers = document.querySelectorAll('.ad-container, .sticky-side-ad');
  if (adContainers.length > 0) {
    // Load ads only if containers exist
    console.log('Ad containers found, loading ads...');
  } else {
    console.log('No ad containers found');
  }
});
