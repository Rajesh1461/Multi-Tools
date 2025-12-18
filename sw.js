// sw.js - MultiTools Service Worker
const CACHE_NAME = 'multitools-cache-v10';
const OFFLINE_URL = '/offline.html';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/assets/css/style-minified.css',
  '/assets/js/include.js',
  '/assets/img/web-app-manifest-192x192.png',
  '/assets/img/web-app-manifest-512x512.png',
  '/assets/img/logo.png'
];

// List of domains to exclude from Service Worker handling
const EXTERNAL_DOMAINS = [
  'www.googletagmanager.com',
  'www.google-analytics.com',
  'pagead2.googlesyndication.com',
  'securepubads.g.doubleclick.net',
  'tpc.googlesyndication.com',
  'googleads.g.doubleclick.net',
  'www.googletagservices.com',
  'google-analytics.com',
  'stats.g.doubleclick.net',
  'www.google.com',
  'www.googleadservices.com'
];

// Function to check if a URL should be handled by the Service Worker
function shouldHandleRequest(url) {
  // Skip non-GET requests and non-HTTP(S) requests
  if (url.method !== 'GET') return false;
  if (!url.url.startsWith('http')) return false;
  
  const parsedUrl = new URL(url.url);
  
  // Skip external domains and known ad/analytics domains
  const isExternalDomain = EXTERNAL_DOMAINS.some(domain => 
    parsedUrl.hostname.endsWith(domain) || 
    parsedUrl.hostname.endsWith('.' + domain)
  );
  
  // Skip component files and other non-essential paths
  const skipPaths = [
    '/components/',
    '/ads/',
    'adsbygoogle.js',
    'gtag/js',
    'analytics.js',
    'googletagmanager.com',
    'doubleclick.net',
    'googlesyndication.com'
  ];
  
  const shouldSkipPath = skipPaths.some(path => parsedUrl.pathname.includes(path));
  
  // Only handle same-origin requests that aren't in the skip list
  return parsedUrl.origin === self.location.origin && !isExternalDomain && !shouldSkipPath;
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching app shell');
        // Add each URL individually to prevent one failed request from breaking the entire cache
        return Promise.all(
          PRECACHE_URLS.map(url => {
            return fetch(url, { cache: 'no-store' })
              .then(response => {
                if (response.ok) {
                  return cache.put(url, response);
                }
                console.warn(`[ServiceWorker] Failed to cache ${url}:`, response.status);
              })
              .catch(error => {
                console.warn(`[ServiceWorker] Error caching ${url}:`, error);
              });
          })
        );
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('[ServiceWorker] Removing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Fetch event handler with improved external resource handling
self.addEventListener('fetch', event => {
  // Skip requests that shouldn't be handled by the Service Worker
  if (!shouldHandleRequest(event.request)) {
    // For external resources, let the browser handle them directly
    if (event.request.mode === 'navigate') {
      // For navigation requests, we still want to handle them
      event.respondWith(handleNavigationRequest(event));
    }
    return;
  }
  
  // Handle all other requests with cache-first strategy
  event.respondWith(handleRequest(event.request));
});

// Handle navigation requests
function handleNavigationRequest(event) {
  return fetch(event.request)
    .then(response => {
      // If we got a valid response, cache it and return it
      if (response && response.status === 200) {
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => cache.put(event.request, responseToCache));
      }
      return response || caches.match(OFFLINE_URL);
    })
    .catch(error => {
      console.log('[ServiceWorker] Network request failed, serving offline page', error);
      return caches.match(OFFLINE_URL);
    });
}

// Handle regular requests with network-first strategy
function handleRequest(request) {
  return caches.match(request)
    .then(cachedResponse => {
      // Always make a network request to update the cache
      return fetch(request)
        .then(networkResponse => {
          // Cache the response if it's valid
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(request, responseToCache));
          }
          return networkResponse;
        })
        .catch(() => {
          // If network fails, return cached response if available
          if (cachedResponse) {
            return cachedResponse;
          }
          // For images, return a fallback
          if (request.headers.get('Accept').includes('image')) {
            return caches.match('/assets/img/placeholder.svg');
          }
          // For other requests, return null
          return null;
        });
    });
}
