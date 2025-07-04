document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('toolSearch');
  const searchBtn = document.getElementById('searchBtn');
  const clearBtn = document.getElementById('clearBtn');
  const toolBtns = document.querySelectorAll('.tool-btn');
  const leftAd = document.querySelector('.sticky-side-ad.left');
  const rightAd = document.querySelector('.sticky-side-ad.right');

  // Side ads scroll movement functionality
  let scrollY = 0;
  let ticking = false;

  function updateAdPosition() {
    if (leftAd && rightAd) {
      // Calculate new position based on scroll
      const scrollOffset = scrollY * 0.3; // Adjust speed here (0.3 = 30% of scroll speed)
      
      // Apply transform to move ads up and down
      // leftAd.style.transform = `translateY(${scrollOffset}px)`;
      // rightAd.style.transform = `translateY(${scrollOffset}px)`;
    }
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateAdPosition);
      ticking = true;
    }
  }

  // Listen for scroll events
  window.addEventListener('scroll', function() {
    scrollY = window.pageYOffset;
    requestTick();
  });

  // Mouse wheel event for smoother movement
  window.addEventListener('wheel', function(e) {
    scrollY = window.pageYOffset;
    requestTick();
  });

  function filterTools() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (query === '') {
      // Show all tools when search is empty
      toolBtns.forEach(btn => {
        btn.style.display = '';
      });
      return;
    }
    
    toolBtns.forEach(btn => {
      // Extract just the tool name from the button text
      const toolName = btn.textContent.trim();
      
      // Check if the tool name contains the search query
      if (toolName.toLowerCase().includes(query)) {
        btn.style.display = '';
      } else {
        btn.style.display = 'none';
      }
    });
  }

  function clearSearch() {
    searchInput.value = '';
    toolBtns.forEach(btn => {
      btn.style.display = '';
    });
    searchInput.focus();
  }

  if (searchBtn) searchBtn.addEventListener('click', filterTools);
  if (clearBtn) clearBtn.addEventListener('click', clearSearch);
  if (searchInput) searchInput.addEventListener('keyup', function(e) {
    if (e.key === 'Enter') {
      filterTools();
    } else {
      // Filter in real-time as user types
      filterTools();
    }
  });

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