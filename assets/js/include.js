// Global cache-busting query to avoid stale component HTML from SW/CDN caches
if (typeof window.vParam === 'undefined') {
  window.vParam = `?v=${Date.now()}`;
}
// Use window.vParam directly to avoid redeclaration issues

document.addEventListener('DOMContentLoaded', function () {
  // Mark tools pages with a common class for consistent styling
  try {
    if (window.location.pathname.includes('/tools/')) {
      document.body.classList.add('tool-page');
    }
  } catch (_) { }
  // Determine the correct path prefix based on current location
  const pathPrefix = window.location.pathname.includes('/tools/') || window.location.pathname.includes('/blog/') ? '../components/' : 'components/';
  // Cache-busting handled via global vParam

  // Load header component
  const headerEl = document.getElementById('header');
  if (headerEl) {
    if (headerEl.innerHTML.trim() === '') {
      fetch(pathPrefix + 'header.html' + window.vParam)
        .then(res => res.text())
        .then(data => {
          headerEl.innerHTML = data;
          processHeader();
        })
        .catch(error => console.log('Error loading header:', error));
    } else {
      processHeader();
    }
  }

  function processHeader() {
    // Fix header links based on environment (avoid forcing prod domain on localhost)
    const isLocalEnv = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    if (!isLocalEnv) {
      const headerLinks = document.querySelectorAll('#header a[href="index.html"]');

      headerLinks.forEach(link => {
        // Normalize all Home links to canonical root to avoid /index.html duplicates
        link.href = 'https://multitoolszone.fun/';
      });

      // Also normalize any other anchor that points to index.html
      try {
        var allIndexLinks = document.querySelectorAll('a[href$="index.html"], a[href="/index.html"], a[href="../index.html"]');
        allIndexLinks.forEach(function (a) { a.href = 'https://multitoolszone.fun/'; });
      } catch (e) { console.log('Index.html normalization failed:', e); }
    }
  }

  // Load footer component
  const footerEl = document.getElementById('footer');
  if (footerEl) {
    if (footerEl.innerHTML.trim() === '') {
      fetch(pathPrefix + 'footer.html' + window.vParam)
        .then(res => res.text())
        .then(data => {
          footerEl.innerHTML = data;
          processFooter();
        })
        .catch(error => console.log('Error loading footer:', error));
    } else {
      processFooter();
    }
  }

  function processFooter() {
    // After header/footer load, enable global image lazy-loading
    try {
      const images = document.querySelectorAll('img');
      images.forEach(function (img) {
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
        if (!img.hasAttribute('decoding')) {
          img.setAttribute('decoding', 'async');
        }
        // Prefer width/height attributes if available to avoid CLS
        if (!img.getAttribute('width') && img.naturalWidth) {
          img.setAttribute('width', img.naturalWidth);
        }
        if (!img.getAttribute('height') && img.naturalHeight) {
          img.setAttribute('height', img.naturalHeight);
        }
      });
    } catch (e) { console.log('Lazyload init failed:', e); }

    // Sanitize stray placeholder characters (e.g., '??' or '?' prefixes)
    try {
      const selectors = 'h1,h2,h3,h4,h5,h6,li,.h1,.h2,.h3,.h4,.h5,.h6';
      document.querySelectorAll(selectors).forEach(function (el) {
        if (el.firstChild && el.firstChild.nodeType === Node.TEXT_NODE) {
          el.firstChild.nodeValue = el.firstChild.nodeValue.replace(/^\?+\s*/g, '');
        }
      });
    } catch (e) { console.log('Sanitize placeholders failed:', e); }
  }

  // Load AdSense components based on page type
  const isHomePage = !window.location.pathname.includes('/tools/') && !window.location.pathname.includes('/blog/');
  const isToolsPage = window.location.pathname.includes('/tools/');

  if (isHomePage) {
    // Homepage: Load only top and multiplex ads (no in-content ad)
    loadAdComponent('ads-top', pathPrefix + 'ads-top.html' + vParam);
    loadAdComponent('ads-multiplex', pathPrefix + 'ads-multiplex.html' + vParam);
  } else if (isToolsPage) {
    // Tools pages: Load in-content and multiplex ads
    loadAdComponent('ads-incontent', pathPrefix + 'ads-incontent.html' + window.vParam);
    loadAdComponent('ads-multiplex', pathPrefix + 'ads-multiplex.html' + window.vParam);

    // Ensure breadcrumb exists and is loaded on all tools pages
    try {
      const mainContainer = document.querySelector('.container.py-4, .container.py-3, .container');
      if (mainContainer) {
        let breadcrumbEl = document.getElementById('breadcrumb');
        if (!breadcrumbEl) {
          breadcrumbEl = document.createElement('div');
          breadcrumbEl.id = 'breadcrumb';
          // Insert breadcrumb at the top of the main container
          mainContainer.insertBefore(breadcrumbEl, mainContainer.firstChild);
        }
        if (breadcrumbEl.innerHTML.trim() === '') {
          fetch(pathPrefix + 'breadcrumb.html' + window.vParam)
            .then(function (res) { return res.text(); })
            .then(function (html) {
              breadcrumbEl.innerHTML = html;
              processBreadcrumb(breadcrumbEl);
            })
            .catch(function (error) { console.log('Error loading breadcrumb:', error); });
        } else {
          processBreadcrumb(breadcrumbEl);
        }

        function processBreadcrumb(el) {
          try {
            // Set current tool name in breadcrumb
            var currentToolEl = el.querySelector('#current-tool');
            var pageTitleEl = document.querySelector('.container.py-4 h1, .container.py-3 h1, .container h1') || document.querySelector('h1');
            if (currentToolEl && pageTitleEl) {
              currentToolEl.textContent = pageTitleEl.textContent.trim();
            }
            // Update structured data with current page URL and name
            var ld = el.querySelector('script[type="application/ld+json"]');
            if (ld) {
              var data = JSON.parse(ld.textContent || '{}');
              if (data && Array.isArray(data.itemListElement) && data.itemListElement[2]) {
                data.itemListElement[2].item = window.location.href;
                data.itemListElement[2].name = pageTitleEl ? pageTitleEl.textContent.trim() : data.itemListElement[2].name;
                ld.textContent = JSON.stringify(data, null, 2);
              }
            }
          } catch (e2) {
            console.log('Breadcrumb post-processing failed:', e2);
          }
        }
      }
    } catch (e) {
      console.log('Breadcrumb initialization failed:', e);
    }

    // Check if content-enhancer-tabs component is already present
    const existingContentEnhancer = document.getElementById('content-enhancer-tabs');
    if (existingContentEnhancer && existingContentEnhancer.children.length > 0) {
      // Content enhancer tabs component is already loaded, don't override it
      console.log('Content enhancer tabs component detected, skipping include.js tab creation');
      return;
    }

    // Ensure Related Tools and Content Enhancer are placed inside one container
    setTimeout(function () {
      const mainContainer = document.querySelector('.container.py-4, .container.py-5, .container.py-3, .container');
      if (!mainContainer) return;

      // Create or get unified TABS container
      let tabsContainer = document.getElementById('tool-info-tabs');
      if (!tabsContainer) {
        tabsContainer = document.createElement('div');
        tabsContainer.id = 'tool-info-tabs';
        tabsContainer.className = 'mt-4';
        tabsContainer.innerHTML = `
           <div class="row justify-content-center">
             <div class="col-lg-10">
               <ul class="nav nav-tabs" role="tablist">
                 <li class="nav-item" role="presentation">
                   <button class="nav-link active" id="tab-about" data-bs-toggle="tab" data-bs-target="#pane-about" type="button" role="tab">About This Tool</button>
                 </li>
                 <li class="nav-item" role="presentation">
                   <button class="nav-link" id="tab-how" data-bs-toggle="tab" data-bs-target="#pane-how" type="button" role="tab">How to Use</button>
                 </li>
                 <li class="nav-item" role="presentation">
                   <button class="nav-link" id="tab-faq" data-bs-toggle="tab" data-bs-target="#pane-faq" type="button" role="tab">Frequently Asked Questions</button>
                 </li>
               </ul>
               <div class="tab-content">
                 <div class="tab-pane fade show active" id="pane-about" role="tabpanel" aria-labelledby="tab-about"></div>
                 <div class="tab-pane fade" id="pane-how" role="tabpanel" aria-labelledby="tab-how"></div>
                 <div class="tab-pane fade" id="pane-faq" role="tabpanel" aria-labelledby="tab-faq"></div>
               </div>
             </div>
           </div>`;

        // Position tabs container above footer instead of at the end of main container
        const footer = document.getElementById('footer');
        if (footer && footer.parentElement) {
          footer.parentElement.insertBefore(tabsContainer, footer);
        } else {
          // Fallback: append to main container if footer not found
          mainContainer.appendChild(tabsContainer);
        }
      }

      // Ensure Bootstrap JS for tabs
      (function ensureBootstrapJs() {
        var hasBundle = !!document.querySelector('script[src*="bootstrap.bundle"]');
        if (!hasBundle) {
          var bs = document.createElement('script');
          bs.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
          bs.defer = true;
          document.body.appendChild(bs);
        }
      })();

      // Remove legacy vertical content-enhancer block if present (we now render About/How/FAQ inside tabs)
      var legacyEnhancer = document.getElementById('content-enhancer');
      if (legacyEnhancer && legacyEnhancer.parentElement) {
        legacyEnhancer.parentElement.removeChild(legacyEnhancer);
      }

      // Keep Related Tools container in DOM; it's hidden via CSS and not displayed

      // Content population is now handled by the content-enhancer-tabs component
      // No need to create duplicate content here

      // Load and populate content enhancer content into the tabs
      loadContentEnhancerIntoTabs();

      // Position in-content ad strategically on tool pages
      const inContentAd = document.getElementById('ads-incontent');
      if (inContentAd) {
        // Find the main content area and insert the ad after the first few paragraphs
        const mainContent = mainContainer.querySelector('.card-body, .container, main');
        if (mainContent) {
          // Insert the ad after the main content area for better user experience
          mainContent.parentNode.insertBefore(inContentAd, mainContent.nextSibling);
        }
      }

      // Move multiplex ad to appear AFTER tabs container (which is now above footer)
      const muxAdEl = document.getElementById('ads-multiplex');
      if (muxAdEl) {
        if (muxAdEl.parentElement !== mainContainer) {
          muxAdEl.parentElement.removeChild(muxAdEl);
        }
        // Position multiplex ad after tabs container (above footer)
        const tabsContainer = document.getElementById('tool-info-tabs');
        if (tabsContainer && tabsContainer.parentElement) {
          tabsContainer.parentElement.insertBefore(muxAdEl, tabsContainer.nextSibling);
        } else {
          mainContainer.appendChild(muxAdEl);
        }
      }
    }, 0);
  }
});

// Helper function to load ad components
function loadAdComponent(elementId, componentPath) {
  const element = document.getElementById(elementId);
  if (element) {
    fetch(componentPath)
      .then(res => res.text())
      .then(html => {
        element.innerHTML = html;
        console.log(`AdSense component loaded: ${elementId}`);
      })
      .catch(error => console.log(`Error loading ${elementId}:`, error));
  } else {
    console.log(`Component element not found: ${elementId}`);
  }
}

// Function to load content enhancer content into the tabs
function loadContentEnhancerIntoTabs() {
  // First, try to load the content enhancer component to get the content
  fetch('../components/content-enhancer.html' + vParam)
    .then(response => response.text())
    .then(html => {
      // Create a temporary div to extract the content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      // Extract the script content to get the tool content database
      const scripts = tempDiv.querySelectorAll('script');
      let toolContent = {};
      let getDefaultContent = null;

      scripts.forEach(script => {
        if (script.textContent.includes('toolContent')) {
          try {
            // Execute the script to get the content
            const scriptContent = script.textContent;
            // Extract toolContent and getDefaultContent from the script
            if (scriptContent.includes('const toolContent =')) {
              // Create a function to extract the content
              const extractContent = new Function(`
                ${scriptContent}
                return { toolContent, getDefaultContent };
              `);
              const result = extractContent();
              toolContent = result.toolContent || {};
              getDefaultContent = result.getDefaultContent || null;
            }
          } catch (e) {
            console.log('Error extracting content:', e);
          }
        }
      });

      // Now populate the tabs with the content
      populateTabsWithContent(toolContent, getDefaultContent);
    })
    .catch(error => {
      console.log('Error loading content enhancer:', error);
      // Fallback to default content
      populateTabsWithDefaultContent();
    });
}

// Function to populate tabs with content
function populateTabsWithContent(toolContent, getDefaultContent) {
  const currentPath = window.location.pathname;
  const fileName = currentPath.split('/').pop();

  let content;
  if (toolContent[fileName]) {
    content = toolContent[fileName];
  } else if (getDefaultContent) {
    content = getDefaultContent();
  } else {
    content = getDefaultFallbackContent();
  }

  // Populate About tab
  const aboutTab = document.getElementById('pane-about');
  if (aboutTab && content.description) {
    aboutTab.innerHTML = content.description;
  }

  // Populate How to Use tab
  const howTab = document.getElementById('pane-how');
  if (howTab && content.usage) {
    howTab.innerHTML = content.usage;
  }

  // Populate FAQ tab
  const faqTab = document.getElementById('pane-faq');
  if (faqTab && content.faq) {
    let faqHTML = '';
    content.faq.forEach((item, index) => {
      faqHTML += `
        <div class="mb-4">
          <h5 class="text-danger mb-2">${item.question}</h5>
          <p class="text-light mb-0">${item.answer}</p>
        </div>
      `;
    });
    faqTab.innerHTML = faqHTML;
  }

  console.log('Tabs populated with content for:', fileName);
}

// Function to populate tabs with default fallback content
function populateTabsWithDefaultContent() {
  const defaultContent = getDefaultFallbackContent();

  // Populate About tab
  const aboutTab = document.getElementById('pane-about');
  if (aboutTab) {
    aboutTab.innerHTML = defaultContent.description;
  }

  // Populate How to Use tab
  const howTab = document.getElementById('pane-how');
  if (howTab) {
    howTab.innerHTML = defaultContent.usage;
  }

  // Populate FAQ tab
  const faqTab = document.getElementById('pane-faq');
  if (faqTab) {
    let faqHTML = '';
    defaultContent.faq.forEach((item, index) => {
      faqHTML += `
        <div class="mb-4">
          <h5 class="text-danger mb-2">${item.question}</h5>
          <p class="text-light mb-0">${item.answer}</p>
        </div>
      `;
    });
    faqTab.innerHTML = faqHTML;
  }

  console.log('Tabs populated with default fallback content');
}

// Default fallback content function
function getDefaultFallbackContent() {
  return {
    description: `<p>This tool provides essential functionality for your online needs. It's designed to be user-friendly, fast, and reliable.</p><p><strong>Features:</strong></p><ul><li>Easy to use interface</li><li>Fast processing</li><li>No registration required</li><li>Free to use</li><li>Works on all devices</li></ul>`,
    usage: `<ol><li>Enter your data in the input fields</li><li>Configure any settings as needed</li><li>Click the process button</li><li>View your results</li><li>Download or copy the output</li></ol>`,
    faq: [
      { question: "Is this tool free to use?", answer: "Yes, all our tools are completely free to use with no registration required." },
      { question: "Do you store my data?", answer: "No, we don't store any of your data. All processing happens in your browser for maximum privacy." },
      { question: "What browsers are supported?", answer: "Our tools work on all modern browsers including Chrome, Firefox, Safari, and Edge." },
      { question: "Can I use this on mobile devices?", answer: "Yes, all our tools are mobile-friendly and work perfectly on smartphones and tablets." }
    ]
  };
}

// Video background removed for performance optimization
// function addVideoBackground() {
//   // This function has been disabled to improve page load performance
//   // The 8.75MB Wallpaper.mp4 was causing significant performance issues
// }

// Dynamic sticky side ad positioning with scroll tracking
function positionStickyAds() {
  const leftAd = document.querySelector('.vertical-ad.left-ad');
  const rightAd = document.querySelector('.vertical-ad.right-ad');

  if (leftAd && rightAd) {
    const viewportHeight = window.innerHeight;
    const scrollTop = window.pageYOffset;
    const documentHeight = document.documentElement.scrollHeight;

    // Calculate the maximum scroll range
    const maxScroll = Math.max(documentHeight - viewportHeight, 1);

    // Calculate ad position based on scroll percentage
    const scrollPercentage = Math.min(scrollTop / maxScroll, 1);
    const adTop = 20 + (scrollPercentage * 60); // Move between 20% and 80% of viewport

    leftAd.style.top = adTop + 'vh';
    rightAd.style.top = adTop + 'vh';

    console.log('positionStickyAds: Scroll position updated - Top:', adTop + 'vh', 'Scroll %:', (scrollPercentage * 100).toFixed(1) + '%');
  } else {
    // Only log if we're on a page that should have sticky ads (index page)
    if (document.body.classList.contains('index-page')) {
      console.log('positionStickyAds: Sticky side ads not found');
    }
  }
}

// Initialize vertical ads with proper positioning
function initializeVerticalAds() {
  const leftAd = document.querySelector('.vertical-ad.left-ad');
  const rightAd = document.querySelector('.vertical-ad.right-ad');

  if (!leftAd || !rightAd) {
    // Only log if we're on a page that should have vertical ads (index page)
    if (document.body.classList.contains('index-page')) {
      console.log('Vertical ads not found');
    }
    return;
  }

  // Set initial positions
  leftAd.style.top = '50px';
  rightAd.style.top = '50px';

  // Ensure ads are visible on large screens
  if (window.innerWidth >= 1200) {
    leftAd.style.display = 'block';
    rightAd.style.display = 'block';
    leftAd.style.visibility = 'visible';
    rightAd.style.visibility = 'visible';
    leftAd.style.opacity = '1';
    rightAd.style.opacity = '1';
  } else {
    leftAd.style.display = 'none';
    rightAd.style.display = 'none';
    leftAd.style.visibility = 'hidden';
    rightAd.style.visibility = 'hidden';
    leftAd.style.opacity = '0';
    rightAd.style.opacity = '0';
  }

  console.log('Vertical ads initialized');
}

// Enhanced mouse tracking for sticky side ads
function initializeMouseTracking() {
  const leftAd = document.querySelector('.vertical-ad.left-ad');
  const rightAd = document.querySelector('.vertical-ad.right-ad');

  if (!leftAd || !rightAd) {
    // Only log if we're on a page that should have sticky ads (index page)
    if (document.body.classList.contains('index-page')) {
      console.log('Mouse tracking: Sticky side ads not found');
    }
    return;
  }

  let mouseY = 0;
  let isMouseMoving = false;
  let mouseTimeout;
  let animationFrameId;

  // Smooth mouse tracking with easing
  function smoothMouseTracking() {
    if (!isMouseMoving) return;

    // Calculate target positions with smooth easing
    const leftTargetY = mouseY - (leftAd.offsetHeight / 2);
    const rightTargetY = mouseY - (rightAd.offsetHeight / 2);

    // Smooth movement with easing (0.1 = smooth, 0.3 = responsive)
    const easing = 0.15;

    // Get current positions - use getBoundingClientRect for accurate positioning
    const leftCurrentY = leftAd.getBoundingClientRect().top;
    const rightCurrentY = rightAd.getBoundingClientRect().top;

    // Calculate new positions with easing
    const leftNewY = leftCurrentY + (leftTargetY - leftCurrentY) * easing;
    const rightNewY = rightCurrentY + (rightTargetY - rightCurrentY) * easing;

    // Debug logging
    console.log('Tracking - Mouse Y:', mouseY, 'Left Current:', leftCurrentY, 'Left Target:', leftTargetY, 'Left New:', leftNewY);

    // Apply new positions - convert to viewport-relative positioning
    leftAd.style.top = leftNewY + 'px';
    rightAd.style.top = rightNewY + 'px';

    // Continue animation
    animationFrameId = requestAnimationFrame(smoothMouseTracking);
  }

  // Mouse move handler with throttling
  function handleMouseMove(e) {
    mouseY = e.clientY;
    isMouseMoving = true;

    // Debug logging
    console.log('Mouse moved to Y:', mouseY);

    // Add tracking class for visual feedback
    leftAd.classList.add('tracking');
    rightAd.classList.add('tracking');

    // Clear existing timeout
    if (mouseTimeout) {
      clearTimeout(mouseTimeout);
    }

    // Start smooth tracking
    if (!animationFrameId) {
      console.log('Starting mouse tracking animation');
      smoothMouseTracking();
    }

    // Stop tracking after mouse stops moving
    mouseTimeout = setTimeout(() => {
      isMouseMoving = false;
      console.log('Mouse tracking stopped');
      // Remove tracking class
      leftAd.classList.remove('tracking');
      rightAd.classList.remove('tracking');
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }, 100); // Stop tracking 100ms after mouse stops moving
  }

  // Touch move handler for mobile devices
  function handleTouchMove(e) {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      mouseY = touch.clientY;
      isMouseMoving = true;

      // Add tracking class for visual feedback
      leftAd.classList.add('tracking');
      rightAd.classList.add('tracking');

      if (mouseTimeout) {
        clearTimeout(mouseTimeout);
      }

      if (!animationFrameId) {
        smoothMouseTracking();
      }

      mouseTimeout = setTimeout(() => {
        isMouseMoving = false;
        // Remove tracking class
        leftAd.classList.remove('tracking');
        rightAd.classList.remove('tracking');
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      }, 150); // Slightly longer timeout for touch
    }
  }

  // Add event listeners
  document.addEventListener('mousemove', handleMouseMove, { passive: true });
  document.addEventListener('touchmove', handleTouchMove, { passive: true });

  // Cleanup function
  function cleanupMouseTracking() {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('touchmove', handleTouchMove);
    if (mouseTimeout) {
      clearTimeout(mouseTimeout);
    }
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  }

  // Return cleanup function for potential use
  return cleanupMouseTracking;
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', function () {
  // addVideoBackground(); // Removed for performance optimization

  console.log('DOM loaded, initializing components...');

  // Initialize vertical ads first
  initializeVerticalAds();

  // Initialize mouse tracking for sticky side ads
  const cleanupMouseTracking = initializeMouseTracking();

  if (cleanupMouseTracking) {
    console.log('Mouse tracking initialized successfully');
  } else {
    // Only log if we're on a page that should have mouse tracking (index page)
    if (document.body.classList.contains('index-page')) {
      console.log('Mouse tracking initialization failed');
    }
  }

  // Position ads after a short delay to ensure DOM is ready
  setTimeout(positionStickyAds, 100);

  // Reposition ads on window resize
  window.addEventListener('resize', function () {
    initializeVerticalAds(); // Re-initialize on resize
    setTimeout(positionStickyAds, 100);
  });

  // Reposition ads on scroll for better responsiveness
  window.addEventListener('scroll', function () {
    requestAnimationFrame(positionStickyAds);
  }, { passive: true });

  // Cleanup on page unload
  window.addEventListener('beforeunload', function () {
    if (cleanupMouseTracking) {
      cleanupMouseTracking();
    }
  });

  // Load ad components with error handling
  setTimeout(() => {
    loadAdComponent('ads-incontent', '../components/ads-incontent.html');
    loadAdComponent('ads-multiplex', '../components/ads-multiplex.html');
  }, 500);

  // Normalize tool page title alignment
  try {
    const mainContainer = document.querySelector('.container.py-4, .container.py-3, .container');
    if (mainContainer) {
      // Prefer H1 inside the common flex header, fallback to first H1 in container
      let pageTitleEl = mainContainer.querySelector('.d-flex.justify-content-between.align-items-center > h1');
      if (!pageTitleEl) {
        pageTitleEl = mainContainer.querySelector('h1');
      }
      if (pageTitleEl) {
        pageTitleEl.classList.add('text-center');
        const parent = pageTitleEl.parentElement;
        if (parent && parent.classList.contains('d-flex') && parent.classList.contains('justify-content-between')) {
          pageTitleEl.classList.add('flex-grow-1');
        }
      }
    }
  } catch (e) {
    console.log('Title alignment normalization failed:', e);
  }

  // Remove Related Tools containers globally (even if individual pages try to load them)
  try {
    // Immediate removal if present
    var rt = document.getElementById('related-tools');
    if (rt && rt.parentElement) {
      rt.parentElement.removeChild(rt);
    }
    // Observe future additions and remove them
    var observer = new MutationObserver(function (mutations) {
      var el = document.getElementById('related-tools');
      if (el && el.parentElement) {
        el.parentElement.removeChild(el);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  } catch (e) {
    console.log('Failed to remove related-tools globally:', e);
  }

  // Auto-bind common action buttons if present on tool pages
  try {
    var genBtn = document.getElementById('btnGenerate');
    if (genBtn && typeof window.generateBarcode === 'function') {
      genBtn.addEventListener('click', window.generateBarcode);
    }
    var clrBtn = document.getElementById('btnClear');
    if (clrBtn && typeof window.clearBarcode === 'function') {
      clrBtn.addEventListener('click', window.clearBarcode);
    }
  } catch (e) {
    console.log('Global button binding failed:', e);
  }
}); 