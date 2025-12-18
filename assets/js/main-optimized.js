// Optimized Main.js for MultiTools - Performance Focused
(function() {
    'use strict';
    
    // Performance optimizations
    const searchInput = document.getElementById('toolSearch');
    const searchBtn = document.getElementById('searchBtn');
    const clearBtn = document.getElementById('clearBtn');
    const toolBtns = document.querySelectorAll('.tool-btn');
    const leftAd = document.querySelector('.sticky-side-ad.left');
    const rightAd = document.querySelector('.sticky-side-ad.right');

    // Optimized scroll handling with throttling
    let scrollY = 0;
    let ticking = false;
    let lastScrollTime = 0;
    const SCROLL_THROTTLE = 16; // ~60fps

    function updateAdPosition() {
        if (!leftAd || !rightAd) return;
        
        const viewportHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight;
        
        const maxScroll = documentHeight - viewportHeight;
        const scrollPercentage = Math.min(scrollTop / maxScroll, 1);
        const adTop = 50 + (scrollPercentage * 40);
        
        leftAd.style.top = adTop + '%';
        rightAd.style.top = adTop + '%';
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateAdPosition);
            ticking = true;
        }
    }

    // Throttled scroll event
    function handleScroll() {
        const now = performance.now();
        if (now - lastScrollTime >= SCROLL_THROTTLE) {
            scrollY = window.pageYOffset;
            requestTick();
            lastScrollTime = now;
        }
    }

    // Optimized search with debouncing
    let searchTimeout;
    function filterTools() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = searchInput.value.toLowerCase().trim();
            
            if (query === '') {
                toolBtns.forEach(btn => {
                    btn.style.display = '';
                    btn.parentElement.style.display = '';
                });
                return;
            }
            
            let visibleCount = 0;
            toolBtns.forEach(btn => {
                const toolName = btn.textContent.toLowerCase();
                const toolDesc = btn.getAttribute('data-description')?.toLowerCase() || '';
                const isMatch = toolName.includes(query) || toolDesc.includes(query);
                
                btn.style.display = isMatch ? '' : 'none';
                btn.parentElement.style.display = isMatch ? '' : 'none';
                
                if (isMatch) visibleCount++;
            });
            
            // Show/hide category headers based on visible tools
            const categories = document.querySelectorAll('.tool-category');
            categories.forEach(category => {
                const visibleTools = category.querySelectorAll('.tool-btn[style*="block"], .tool-btn:not([style*="none"])');
                category.style.display = visibleTools.length > 0 ? 'block' : 'none';
            });
        }, 150); // 150ms debounce
    }

    // Optimized event listeners
    function initEventListeners() {
        if (searchInput) {
            searchInput.addEventListener('input', filterTools, { passive: true });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', filterTools);
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                filterTools();
                searchInput.focus();
            });
        }
        
        // Throttled scroll listener
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'k' || e.key === 'K') {
                    e.preventDefault();
                    searchInput?.focus();
                }
            }
        });
    }

    // Lazy load non-critical features
    function lazyLoadFeatures() {
        // Load AdSense after page is interactive
        if (document.querySelector('.adsbygoogle')) {
            const adScript = document.createElement('script');
            adScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
            adScript.async = true;
            adScript.defer = true;
            document.head.appendChild(adScript);
        }
    }

    // Initialize when DOM is ready
    function init() {
        initEventListeners();
        lazyLoadFeatures();
        
        // Initial search state
        if (searchInput) {
            filterTools();
        }
        
        console.log('✅ Optimized main.js loaded');
    }

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();