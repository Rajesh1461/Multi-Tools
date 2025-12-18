// AdSense Loader - Mobile Optimized
(function() {
    'use strict';
    
    // Mobile detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Track initialized ads to prevent duplicates
    const initializedAds = new Set();
    
    // Delay ad loading on mobile for better performance
    const adDelay = isMobile ? 2000 : 500;
    
    // Function to initialize AdSense ads safely
    let retryCount = 0;
    const maxRetries = 50; // Max 5 seconds (50 * 100ms)
    
    function initializeAdSense() {
        // Check if AdSense is available
        if (typeof adsbygoogle === 'undefined') {
            retryCount++;
            if (retryCount < maxRetries) {
                setTimeout(initializeAdSense, 100);
            }
            // Silent retry - no console log to reduce noise
            return;
        }
        
        // Find all uninitialized ad containers
        const adContainers = document.querySelectorAll('ins.adsbygoogle:not([data-adsbygoogle-status])');
        
        if (adContainers.length === 0) {
            // Silent - no console log needed
            return;
        }
        
        // Silent initialization - no console log to reduce noise
        
        // Initialize each ad container only once
        adContainers.forEach((container, index) => {
            const adSlot = container.getAttribute('data-ad-slot');
            const adClient = container.getAttribute('data-ad-client');
            
            // Create unique identifier for this ad
            const adId = `${adClient}-${adSlot}-${index}`;
            
            // Skip if already initialized
            if (initializedAds.has(adId)) {
                console.log(`Ad ${adId} already initialized, skipping`);
                return;
            }
            
            try {
                // Mark as initialized before pushing
                initializedAds.add(adId);
                container.setAttribute('data-adsbygoogle-status', 'initialized');
                
                // Push to AdSense
                (adsbygoogle = window.adsbygoogle || []).push({});
                
                console.log(`AdSense ad initialized: ${adId}`);
            } catch (error) {
                console.error(`Error initializing AdSense ad ${adId}:`, error);
                // Remove from initialized set on error so it can be retried
                initializedAds.delete(adId);
                container.removeAttribute('data-adsbygoogle-status');
            }
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAdSense);
    } else {
        initializeAdSense();
    }
    
    // Re-initialize when new ad containers are added dynamically
    const observer = new MutationObserver(function(mutations) {
        let shouldReinitialize = false;
        
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        if (node.classList && node.classList.contains('adsbygoogle')) {
                            shouldReinitialize = true;
                        } else if (node.querySelector && node.querySelector('.adsbygoogle')) {
                            shouldReinitialize = true;
                        }
                    }
                });
            }
        });
        
        if (shouldReinitialize) {
            setTimeout(initializeAdSense, 100);
        }
    });
    
    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Mobile-optimized initialization
    function initAds() {
        if (isMobile) {
            // Delay on mobile for better performance
            setTimeout(initializeAdSense, adDelay);
        } else {
            initializeAdSense();
        }
    }
    
    // Initialize with mobile optimization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAds);
    } else {
        initAds();
    }
    
    // Export for manual initialization if needed
    window.initializeAdSense = initializeAdSense;
})();
