// QR Code Library Loader with Fallback
(function() {
    'use strict';
    
    // Try to load QRCode library from CDN with fallback to local
    const cdnUrls = [
        'https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js',
        'https://unpkg.com/qrcode@1.5.3/build/qrcode.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
    ];
    
    let currentUrlIndex = 0;
    
    function loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = () => resolve(url);
            script.onerror = () => reject(new Error(`Failed to load: ${url}`));
            document.head.appendChild(script);
        });
    }
    
    function tryLoadQRCode() {
        if (currentUrlIndex >= cdnUrls.length) {
            // All CDN attempts failed, try local copy
            return loadScript('/assets/js/vendor/qrcode.min.js')
                .catch(() => {
                    const errorMsg = 'Failed to load QR Code library. Please check your connection, or add a local copy at /assets/js/vendor/qrcode.min.js';
                    console.error(errorMsg);
                    alert(errorMsg);
                    throw new Error(errorMsg);
                });
        }
        
        return loadScript(cdnUrls[currentUrlIndex])
            .catch(() => {
                currentUrlIndex++;
                return tryLoadQRCode();
            });
    }
    
    // Check if QRCode is already loaded
    if (typeof QRCode === 'undefined') {
        tryLoadQRCode().then((url) => {
            console.log(`QR Code library loaded successfully from: ${url}`);
        }).catch((error) => {
            console.error('QR Code library loading failed:', error);
        });
    }
})();
