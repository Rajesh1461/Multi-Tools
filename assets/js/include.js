document.addEventListener('DOMContentLoaded', function() {
  // Determine the correct path prefix based on current location
  const pathPrefix = window.location.pathname.includes('/tools/') ? '../components/' : 'components/';

  fetch(pathPrefix + 'header.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('header').innerHTML = data;
      
      // Fix header links based on current location
      const headerLinks = document.querySelectorAll('#header a[href="index.html"]');
      const isInTools = window.location.pathname.includes('/tools/');
      
      headerLinks.forEach(link => {
        link.href = isInTools ? '../index.html' : 'index.html';
      });
    });
  fetch(pathPrefix + 'footer.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('footer').innerHTML = data;
    });
});

// Add video background to all pages
function addVideoBackground() {
  // Check if video background already exists
  if (!document.getElementById('videoBackground')) {
    const video = document.createElement('video');
    video.id = 'videoBackground';
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.style.cssText = 'position: fixed; right: 0; bottom: 0; min-width: 100%; min-height: 100%; width: auto; height: auto; z-index: -3; object-fit: cover;';
    
    const source = document.createElement('source');
    // Determine correct path based on current location
    const videoPath = window.location.pathname.includes('/tools/') ? '../Wallpaper.mp4' : 'Wallpaper.mp4';
    source.src = videoPath;
    source.type = 'video/mp4';
    
    video.appendChild(source);
    video.innerHTML += 'Your browser does not support the video tag.';
    
    // Insert video as the first child of body
    document.body.insertBefore(video, document.body.firstChild);
  }
}

// Dynamic sticky side ad positioning
function positionStickyAds() {
  const container = document.querySelector('.container.py-4');
  const leftAd = document.querySelector('.sticky-side-ad.left');
  const rightAd = document.querySelector('.sticky-side-ad.right');
  
  if (container && leftAd && rightAd) {
    // Check if we are on the index page (not in /tools/)
    if (!window.location.pathname.includes('/tools/')) {
      console.log('positionStickyAds: On index page, setting ads to 20vh');
      // On index page: move ads 20% down from the top of the viewport
      leftAd.style.top = '20vh';
      rightAd.style.top = '20vh';
      leftAd.style.transform = 'none';
      rightAd.style.transform = 'none';
    } else {
      console.log('positionStickyAds: On tools page, using container-centered positioning');
      // On other pages: keep the current behavior (centered on container)
      const containerRect = container.getBoundingClientRect();
      const containerTop = containerRect.top;
      const containerHeight = containerRect.height;
      // Move up by another 5%: now at 5% from top
      const targetY = containerTop + (containerHeight * 0.05);
      leftAd.style.top = targetY + 'px';
      rightAd.style.top = targetY + 'px';
      leftAd.style.transform = 'translateY(-50%)';
      rightAd.style.transform = 'translateY(-50%)';
    }
  } else {
    console.log('positionStickyAds: One or more ad/container elements not found');
  }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', function() {
  addVideoBackground();
  
  // Position ads after a short delay to ensure DOM is ready
  setTimeout(positionStickyAds, 100);
  
  // Reposition ads on window resize
  window.addEventListener('resize', function() {
    setTimeout(positionStickyAds, 100);
  });
  
  // Reposition ads on scroll for better responsiveness
  window.addEventListener('scroll', function() {
    requestAnimationFrame(positionStickyAds);
  });
}); 