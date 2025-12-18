// Development Tools for MultiTools
// This script provides helpful functions for development and debugging

window.DevTools = {
  // Toggle service worker on/off
  toggleServiceWorker: function() {
    if (window.SW_CONFIG) {
      window.SW_CONFIG.enabled = !window.SW_CONFIG.enabled;
      console.log('Service Worker enabled:', window.SW_CONFIG.enabled);
      
      if (window.SW_CONFIG.enabled) {
        // Reload page to enable service worker
        location.reload();
      } else {
        // Unregister service worker
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then(registrations => {
            for (let registration of registrations) {
              registration.unregister();
            }
            console.log('Service Worker unregistered');
          });
        }
      }
    }
  },
  
  // Toggle debug mode
  toggleDebug: function() {
    if (window.SW_CONFIG) {
      window.SW_CONFIG.debug = !window.SW_CONFIG.debug;
      console.log('Debug mode:', window.SW_CONFIG.debug);
    }
  },
  
  // Clear all caches
  clearCaches: function() {
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            console.log('Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }).then(() => {
        console.log('All caches cleared');
      });
    }
  },
  
  // Show service worker status
  showStatus: function() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        console.log('Service Worker Registrations:', registrations);
        console.log('Service Worker Controller:', navigator.serviceWorker.controller);
        console.log('Service Worker Ready State:', navigator.serviceWorker.ready);
      });
    }
    
    if (window.SW_CONFIG) {
      console.log('Service Worker Config:', window.SW_CONFIG);
    }
  },
  
  // Force service worker update
  forceUpdate: function() {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({type: 'SKIP_WAITING'});
      console.log('Force update message sent to Service Worker');
    }
  }
};

// Add keyboard shortcuts for development
document.addEventListener('keydown', function(e) {
  // Ctrl+Shift+D: Toggle debug mode
  if (e.ctrlKey && e.shiftKey && e.key === 'D') {
    e.preventDefault();
    DevTools.toggleDebug();
  }
  
  // Ctrl+Shift+S: Toggle service worker
  if (e.ctrlKey && e.shiftKey && e.key === 'S') {
    e.preventDefault();
    DevTools.toggleServiceWorker();
  }
  
  // Ctrl+Shift+C: Clear caches
  if (e.ctrlKey && e.shiftKey && e.key === 'C') {
    e.preventDefault();
    DevTools.clearCaches();
  }
  
  // Ctrl+Shift+U: Force update
  if (e.ctrlKey && e.shiftKey && e.key === 'U') {
    e.preventDefault();
    DevTools.forceUpdate();
  }
});

// Log available shortcuts
console.log('Development Tools loaded. Available shortcuts:');
console.log('Ctrl+Shift+D: Toggle debug mode');
console.log('Ctrl+Shift+S: Toggle service worker');
console.log('Ctrl+Shift+C: Clear caches');
console.log('Ctrl+Shift+U: Force update');
console.log('Or use DevTools.showStatus() to see current status');
