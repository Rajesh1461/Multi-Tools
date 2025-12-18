// Service Worker Configuration
window.SW_CONFIG = {
  // Disable during Lighthouse audits for deterministic results
  enabled: !navigator.userAgent.includes('Lighthouse'),
  
  // Cache configuration
  cacheName: 'multitools-v2', // Updated version
  
  // URLs to cache on install
  urlsToCache: [
    '/',
    '/index.html',
    '/About.html',
    '/Contact.html',
    '/Privacy-Policy.html',
    '/Terms-of-Service.html',
    '/assets/css/style.css',
    '/assets/css/style-minified.css',
    '/assets/css/non-critical.css',
    '/assets/js/main.js',
    '/assets/js/simple-tool-loader.js',
    '/assets/js/performance-optimizer.js',
    '/assets/js/error-handler.js',
    // Third-party CDN assets are intentionally not cached by SW
  ],
  
  // Cache strategies
  strategies: {
    // Cache-first for static assets
    static: [
      '/assets/'
    ],
    // Network-first for HTML pages
    dynamic: [
      '/',
      '.html$'
    ]
  },
  
  // Development mode - disabled for production
  debug: false,
  
  // Network timeout in milliseconds
  networkTimeout: 5000
};
