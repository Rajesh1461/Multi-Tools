// Global variables for search functionality
let searchInput, searchBtn, clearBtn, toolBtns;
let searchActive = false;
let lastSearchTerm = '';

// Function to initialize search functionality
function initSearch() {
  searchInput = document.getElementById('toolSearch');
  searchBtn = document.getElementById('searchBtn');
  clearBtn = document.getElementById('clearBtn');
  
  if (!searchInput) return;
  
  // Clear existing event listeners to prevent duplicates
  searchInput.removeEventListener('input', handleSearch);
  searchInput.removeEventListener('keyup', handleSearch);
  if (searchBtn) searchBtn.removeEventListener('click', handleSearch);
  if (clearBtn) clearBtn.removeEventListener('click', clearSearch);
  
  // Add new event listeners
  searchInput.addEventListener('input', handleSearch);
  searchInput.addEventListener('keyup', handleSearch);
  if (searchBtn) searchBtn.addEventListener('click', handleSearch);
  if (clearBtn) clearBtn.addEventListener('click', clearSearch);
  
  // If we have a previous search term, re-apply it
  if (lastSearchTerm) {
    searchInput.value = lastSearchTerm;
    filterTools(lastSearchTerm);
  }
  
  // Position ads on page load
  positionStickyAds();
  
  // Reposition ads on window resize
  window.addEventListener('resize', function() {
    setTimeout(positionStickyAds, 100);
  });
  
  // Reposition ads on scroll (optional, for better responsiveness)
  window.addEventListener('scroll', function() {
    requestAnimationFrame(positionStickyAds);
  });
}

// Main initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const leftAd = document.querySelector('.sticky-side-ad.left');
  const rightAd = document.querySelector('.sticky-side-ad.right');
  
  // Get all tool buttons
  updateToolButtons();
  
  // Initialize search
  initSearch();
  
  // Set up a mutation observer to detect when new tools are loaded
  const observer = new MutationObserver(function(mutations) {
    let shouldUpdate = false;
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        shouldUpdate = true;
      }
    });
    
    if (shouldUpdate) {
      updateToolButtons();
      // If search was active, re-apply it
      if (searchActive && lastSearchTerm) {
        filterTools(lastSearchTerm);
      }
    }
  });
  
  // Start observing the document with the configured parameters
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Optimized scroll handling - reduced for performance
  let scrollY = 0;
  let ticking = false;

  function updateAdPosition() {
    // Update ad positions to follow scroll
    if (leftAd && rightAd) {
      const viewportHeight = window.innerHeight;
      const scrollTop = window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Calculate the maximum scroll range
      const maxScroll = documentHeight - viewportHeight;
      
      // Calculate ad position based on scroll percentage
      const scrollPercentage = Math.min(scrollTop / maxScroll, 1);
      const adTop = 50 + (scrollPercentage * 40); // Move between 50% and 90% of viewport
      
      leftAd.style.top = adTop + '%';
      rightAd.style.top = adTop + '%';
    }
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateAdPosition);
      ticking = true;
    }
  }

  // Throttled scroll event listener
  window.addEventListener('scroll', function() {
    scrollY = window.pageYOffset;
    requestTick();
  }, { passive: true });

  // Update the tool buttons collection
  function updateToolButtons() {
    toolBtns = document.querySelectorAll('.tool-btn');
  }
  
  // Filter tools based on search query
  function filterTools(query) {
    console.log('Filtering with query:', query);
    
    // Make sure we have tool buttons
    if (!toolBtns || toolBtns.length === 0) {
      updateToolButtons();
      if (!toolBtns || toolBtns.length === 0) {
        console.log('No tool buttons found');
        return;
      }
    }
    
    // Clean and validate the query
    query = String(query || '').toLowerCase().trim();
    lastSearchTerm = query;
    searchActive = query.length > 0;
    
    // Show all tools if query is empty
    if (!query) {
      console.log('Empty query, showing all tools');
      clearSearch();
      return;
    }
    
    console.log('Searching for:', query);
    let hasMatches = false;
    const categoryVisibility = {};
    
    // First, hide all tools
    toolBtns.forEach(btn => {
      btn.style.display = 'none';
    });
    
    // Then show only matching tools
    toolBtns.forEach(btn => {
      const cardTitle = btn.querySelector('.card-title');
      if (!cardTitle) return;
      
      const toolName = cardTitle.textContent.trim().toLowerCase();
      const toolMatches = toolName.includes(query);
      
      if (toolMatches) {
        btn.style.display = '';
        hasMatches = true;
        
        // Show the category for this tool
        const categorySection = btn.closest('.row')?.previousElementSibling;
        if (categorySection && categorySection.tagName === 'H2') {
          const categoryName = categorySection.textContent.trim();
          categoryVisibility[categoryName] = true;
        }
      }
    });
    
    // Update category visibility
    document.querySelectorAll('main h2').forEach(h2 => {
      const categoryName = h2.textContent.trim();
      const categoryRow = h2.nextElementSibling;
      
      if (categoryRow && categoryRow.classList.contains('row')) {
        if (categoryVisibility[categoryName]) {
          h2.style.display = '';
          categoryRow.style.display = '';
          
          // Show all tools in this category if they match the search
          const toolsInCategory = categoryRow.querySelectorAll('.tool-btn');
          toolsInCategory.forEach(tool => {
            const toolTitle = tool.querySelector('.card-title')?.textContent.trim().toLowerCase() || '';
            if (toolTitle.includes(query)) {
              tool.style.display = '';
            }
          });
        } else {
          h2.style.display = 'none';
          categoryRow.style.display = 'none';
        }
      }
    });
  }

  // Handle search input and button clicks
  function handleSearch(e) {
    // Handle Escape key
    if (e.key === 'Escape') {
      clearSearch();
      return;
    }
    
    // Prevent processing if this is a keyup event for non-text keys
    if (e.type === 'keyup' && [
      'Shift', 'Control', 'Alt', 'Meta', 'Tab', 'CapsLock',
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      'Escape', 'Enter', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6',
      'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
    ].includes(e.key)) {
      return;
    }
    
    // Get the current search query
    const query = searchInput ? searchInput.value : '';
    
    // Process the search
    if (query) {
      filterTools(query);
    } else {
      // If query is empty, clear the search
      clearSearch();
    }
  }
  
  // Clear search and show all tools
  function clearSearch() {
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }
    lastSearchTerm = '';
    searchActive = false;
    
    // Show all tool buttons
    if (toolBtns && toolBtns.length > 0) {
      toolBtns.forEach(btn => {
        btn.style.display = '';
      });
    }
    
    // Show all categories
    document.querySelectorAll('main h2, main .row').forEach(el => {
      el.style.display = '';
    });
    
    if (toolBtns) {
      toolBtns.forEach(btn => {
        btn.style.display = '';
      });
    }
    
    // Show all categories
    document.querySelectorAll('main h2, main .row').forEach(el => {
      el.style.display = '';
    });
  }

  // Initialize search functionality when DOM is loaded
  function initSearch() {
    if (!searchInput) return;
    
    // Clear any existing event listeners to prevent duplicates
    searchInput.removeEventListener('input', handleSearch);
    searchInput.removeEventListener('keyup', handleSearch);
    if (searchBtn) searchBtn.removeEventListener('click', handleSearch);
    if (clearBtn) clearBtn.removeEventListener('click', clearSearch);
    
    // Add new event listeners
    searchInput.addEventListener('input', handleSearch);
    searchInput.addEventListener('keyup', handleSearch);
    if (searchBtn) searchBtn.addEventListener('click', handleSearch);
    if (clearBtn) clearBtn.addEventListener('click', clearSearch);
    
    // If we have a previous search term, re-apply it
    if (lastSearchTerm) {
      searchInput.value = lastSearchTerm;
      filterTools(lastSearchTerm);
    }
  }

  // Dynamic sticky side ad positioning
  function positionStickyAds() {
    // Only run on tools pages
    if (!window.location.pathname.includes('/tools/')) {
      // On index page, do nothing so include.js can control ad position
      return;
    }
    const container = document.querySelector('.container.py-4');
    const leftAd = document.querySelector('.sticky-side-ad.left');
    const rightAd = document.querySelector('.sticky-side-ad.right');
    
    if (container && leftAd && rightAd) {
      const containerRect = container.getBoundingClientRect();
      const containerTop = containerRect.top;
      const containerHeight = containerRect.height;
      const containerCenter = containerTop + (containerHeight / 2);
      
      // Position ads at the center of the container
      leftAd.style.top = containerCenter + 'px';
      rightAd.style.top = containerCenter + 'px';
      
      // Remove transform since we're using absolute positioning
      // leftAd.style.transform = 'translateY(-50%)';
      // rightAd.style.transform = 'translateY(-50%)';
    }
  }

  // Initialize search functionality
  initSearch();
  
  // Re-initialize search after a short delay to catch dynamically loaded content
  setTimeout(initSearch, 500);
  
  // Also re-initialize when the window loads (in case of slow loading)
  window.addEventListener('load', function() {
    // Wait a bit more for dynamic content
    setTimeout(initSearch, 1000);
  });
  
  // Position ads on page load
  positionStickyAds();
  
  // Reposition ads on window resize
  window.addEventListener('resize', function() {
    setTimeout(positionStickyAds, 100);
  });
  
  // Reposition ads on scroll (optional, for better responsiveness)
  window.addEventListener('scroll', function() {
    requestAnimationFrame(positionStickyAds);
  });
});