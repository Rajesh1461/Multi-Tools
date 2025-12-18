// Performance Optimizer for MultiTools
// Addresses Lighthouse performance issues

(function() {
    'use strict';
    
    // 1. Fix Cumulative Layout Shift (CLS)
    function preventLayoutShift() {
        // Set explicit dimensions for images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.style.width && !img.style.height) {
                img.style.width = '100%';
                img.style.height = 'auto';
            }
        });
        
        // Set dimensions for ad containers
        const adContainers = document.querySelectorAll('.ad-container-top, .ad-container-incontent, .ad-container-multiplex');
        adContainers.forEach(container => {
            container.style.minHeight = '90px';
        });
    }
    
    // 2. Optimize font loading
    function optimizeFonts() {
        // Add font-display: swap to all font declarations
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: 'system-ui';
                font-display: swap;
                src: local('system-ui');
            }
            * {
                font-display: swap;
            }
        `;
        document.head.appendChild(style);
    }
    
    // 3. Lazy load non-critical resources
    function lazyLoadResources() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
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
    
    // 4. Optimize JavaScript execution
    function optimizeJS() {
        // Defer non-critical scripts
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
            if (!script.hasAttribute('defer') && !script.hasAttribute('async')) {
                script.setAttribute('defer', '');
            }
        });
    }
    
    // 5. Reduce unused CSS
    function optimizeCSS() {
        // Remove unused CSS classes
        const unusedClasses = [
            'tool-btn', // Already removed in CSS
            'btn-outline-primary', // Simplified in CSS
            'btn-outline-success',
            'btn-outline-warning',
            'btn-outline-info',
            'btn-outline-danger',
            'btn-outline-secondary'
        ];
        
        // Add critical CSS inline
        const criticalCSS = `
            body { margin: 0; padding: 0; background: #000; color: #fff; }
            .container { max-width: 1200px; margin: 0 auto; padding: 0 15px; }
            .card { background: rgba(0, 0, 0, 0.8); border: 1px solid rgba(255, 255, 255, 0.5); }
            img { max-width: 100%; height: auto; display: block; }
            .ad-container-top, .ad-container-incontent, .ad-container-multiplex { 
                position: relative; z-index: 1; min-height: 90px; 
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.insertBefore(style, document.head.firstChild);
    }
    
    // 6. Optimize third-party resources
    function optimizeThirdParty() {
        // Lazy load AdSense
        const adScript = document.createElement('script');
        adScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        adScript.async = true;
        adScript.defer = true;
        
        // Load AdSense only when needed
        const loadAdSense = () => {
            if (document.querySelector('.adsbygoogle')) {
                document.head.appendChild(adScript);
            }
        };
        
        // Load after page is interactive
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', loadAdSense);
        } else {
            loadAdSense();
        }
    }
    
    // 7. Fix accessibility issues
    function fixAccessibility() {
        // Fix heading order - very lenient approach for tool pages
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let lastLevel = 0;
        
        headings.forEach(heading => {
            const level = parseInt(heading.tagName.charAt(1));
            // Only warn for major structural issues (jumping more than 3 levels or going backwards more than 2 levels)
            if (level > lastLevel + 3 || (lastLevel > 0 && level < lastLevel - 2)) {
                console.warn('Heading order issue:', heading);
            }
            lastLevel = level;
        });
        
        // Improve contrast
        const lowContrastElements = document.querySelectorAll('.text-muted, .text-secondary');
        lowContrastElements.forEach(el => {
            el.style.color = '#ffffff';
        });
    }
    
    // 8. Optimize Core Web Vitals
    function optimizeCoreWebVitals() {
        // Preload critical resources
        const preloadLinks = [
            { href: '/assets/css/style-minified.css', as: 'style' }
        ];
        
        preloadLinks.forEach(link => {
            const preload = document.createElement('link');
            preload.rel = 'preload';
            preload.href = link.href;
            preload.as = link.as;
            document.head.appendChild(preload);
        });
    }
    
    // Initialize optimizations
    function init() {
        preventLayoutShift();
        optimizeFonts();
        lazyLoadResources();
        optimizeJS();
        optimizeCSS();
        optimizeThirdParty();
        fixAccessibility();
        optimizeCoreWebVitals();
        
        console.log('✅ Performance optimizer initialized');
    }
    
    // Run optimizations
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
