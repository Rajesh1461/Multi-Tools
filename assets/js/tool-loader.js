// Tool Loader for MultiTools
// This script dynamically loads and displays tools on the main page

console.log('Tool loader script loaded');

// Function to initialize the tool loader when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, initializing tool loader...');
    initToolLoader();
  });
} else {
  console.log('DOM already loaded, initializing tool loader...');
  initToolLoader();
}

// Function to initialize the tool loader
function initToolLoader() {
  console.log('Initializing tool loader...');
  // Tool categories and their associated tools
  const toolCategories = {
    'Image Tools': [
      { name: 'Image Compressor', url: 'tools/image-compressor.html', icon: 'fas fa-compress', description: 'Compress images without losing quality' },
      { name: 'Image Resizer', url: 'tools/image-resizer.html', icon: 'fas fa-expand-arrows-alt', description: 'Resize images to any dimensions' },
      { name: 'Image to PNG', url: 'tools/image-to-png.html', icon: 'fas fa-file-image', description: 'Convert images to PNG format' },
      { name: 'Image to JPG', url: 'tools/image-to-jpg.html', icon: 'fas fa-file-image', description: 'Convert images to JPG format' },
      { name: 'Convert WebP to PNG', url: 'tools/convert-webp-to-png.html', icon: 'fas fa-exchange-alt', description: 'Convert WebP images to PNG' },
      { name: 'Image Cropper', url: 'tools/image-cropper.html', icon: 'fas fa-crop', description: 'Crop images to specific dimensions' },
      { name: 'Convert Image to Base64', url: 'tools/convert-image-to-base64.html', icon: 'fas fa-code', description: 'Convert images to Base64 encoding' },
      { name: 'GIF Maker', url: 'tools/gif-maker.html', icon: 'fas fa-play-circle', description: 'Create animated GIFs from images' }
    ],
    'SEO Tools': [
      { name: 'Meta Tag Generator', url: 'tools/meta-tag-generator.html', icon: 'fas fa-tags', description: 'Generate SEO meta tags' },
      { name: 'Keyword Density Checker', url: 'tools/keyword-density-checker.html', icon: 'fas fa-search', description: 'Check keyword density in content' },
      { name: 'Sitemap Generator', url: 'tools/sitemap-generator.html', icon: 'fas fa-sitemap', description: 'Generate XML sitemaps' },
      { name: 'Robots.txt Generator', url: 'tools/robots-txt-generator.html', icon: 'fas fa-robot', description: 'Generate robots.txt files' },
      { name: 'Page Speed Checker', url: 'tools/page-speed-checker.html', icon: 'fas fa-tachometer-alt', description: 'Check website loading speed' },
      { name: 'Mobile Friendly Test', url: 'tools/mobile-friendly-test.html', icon: 'fas fa-mobile-alt', description: 'Test mobile responsiveness' },
      { name: 'SSL Certificate Checker', url: 'tools/ssl-certificate-checker.html', icon: 'fas fa-shield-alt', description: 'Check SSL certificate status' },
      { name: 'Backlink Checker', url: 'tools/backlink-checker.html', icon: 'fas fa-link', description: 'Check backlinks to your website' },
      { name: 'Domain Authority Checker', url: 'tools/domain-authority-checker.html', icon: 'fas fa-chart-line', description: 'Check domain authority score' },
      { name: 'Google Index Checker', url: 'tools/google-index-checker.html', icon: 'fas fa-search', description: 'Check if pages are indexed by Google' }
    ],
    'Text Tools': [
      { name: 'Word Counter', url: 'tools/word-counter.html', icon: 'fas fa-font', description: 'Count words, characters, and sentences' },
      { name: 'Text Case Converter', url: 'tools/text-case-converter.html', icon: 'fas fa-text-height', description: 'Convert text between different cases' },
      { name: 'Character Counter', url: 'tools/character-counter.html', icon: 'fas fa-hashtag', description: 'Count characters in text' },
      { name: 'Grammar Checker', url: 'tools/grammar-checker.html', icon: 'fas fa-spell-check', description: 'Check grammar and spelling' },
      { name: 'Plagiarism Checker', url: 'tools/plagiarism-checker.html', icon: 'fas fa-copy', description: 'Check for duplicate content' },
      { name: 'Fancy Text Generator', url: 'tools/fancy-text-generator.html', icon: 'fas fa-magic', description: 'Generate fancy text styles' },
      { name: 'Random Text Generator', url: 'tools/random-text-generator.html', icon: 'fas fa-random', description: 'Generate random text content' },
      { name: 'Story Plot Generator', url: 'tools/story-plot-generator.html', icon: 'fas fa-book', description: 'Generate story plot ideas' },
      { name: 'Hashtag Generator', url: 'tools/hashtag-generator.html', icon: 'fas fa-hashtag', description: 'Generate relevant hashtags' },
      { name: 'Twitter Character Counter', url: 'tools/twitter-character-counter.html', icon: 'fab fa-twitter', description: 'Count characters for Twitter posts' }
    ],
    'Developer Tools': [
      { name: 'JSON Formatter', url: 'tools/json-formatter.html', icon: 'fas fa-code', description: 'Format and validate JSON' },
      { name: 'HTML to Markdown', url: 'tools/html-to-markdown.html', icon: 'fas fa-file-code', description: 'Convert HTML to Markdown' },
      { name: 'Markdown to HTML', url: 'tools/markdown-to-html.html', icon: 'fas fa-file-code', description: 'Convert Markdown to HTML' },
      { name: 'CSS Minifier', url: 'tools/css-minifier.html', icon: 'fas fa-compress', description: 'Minify CSS code' },
      { name: 'JavaScript Minifier', url: 'tools/javascript-minifier.html', icon: 'fas fa-compress', description: 'Minify JavaScript code' },
      { name: 'SQL Formatter', url: 'tools/sql-formatter.html', icon: 'fas fa-database', description: 'Format SQL queries' },
      { name: 'URL Encoder/Decoder', url: 'tools/url-encoder-decoder.html', icon: 'fas fa-link', description: 'Encode and decode URLs' },
      { name: 'Base64 Encoder/Decoder', url: 'tools/base64-encoder-decoder.html', icon: 'fas fa-code', description: 'Encode and decode Base64' },
      { name: 'XML Sitemap Validator', url: 'tools/xml-sitemap-validator.html', icon: 'fas fa-check-circle', description: 'Validate XML sitemaps' }
    ],
    'Math & Calculators': [
      { name: 'Age Calculator', url: 'tools/age-calculator.html', icon: 'fas fa-birthday-cake', description: 'Calculate exact age and time until birthday' },
      { name: 'BMI Calculator', url: 'tools/bmi-calculator.html', icon: 'fas fa-weight', description: 'Calculate Body Mass Index' },
      { name: 'Percentage Calculator', url: 'tools/percentage-calculator.html', icon: 'fas fa-percentage', description: 'Calculate percentages and changes' },
      { name: 'Tip Calculator', url: 'tools/tip-calculator.html', icon: 'fas fa-utensils', description: 'Calculate tips and split bills' },
      { name: 'Scientific Calculator', url: 'tools/scientific-calculator.html', icon: 'fas fa-calculator', description: 'Advanced scientific calculations' },
      { name: 'Compound Interest Calculator', url: 'tools/compound-interest-calculator.html', icon: 'fas fa-chart-line', description: 'Calculate compound interest' },
      { name: 'Loan EMI Calculator', url: 'tools/loan-emi-calculator.html', icon: 'fas fa-home', description: 'Calculate loan EMI payments' },
      { name: 'Discount Calculator', url: 'tools/discount-calculator.html', icon: 'fas fa-tag', description: 'Calculate discounts and savings' },
      { name: 'Area Calculator', url: 'tools/area-calculator.html', icon: 'fas fa-square', description: 'Calculate area of shapes' },
      { name: 'Volume Calculator', url: 'tools/volume-calculator.html', icon: 'fas fa-cube', description: 'Calculate volume of 3D shapes' }
    ],
    'Unit Converters': [
      { name: 'Unit Converter', url: 'tools/unit-converter.html', icon: 'fas fa-exchange-alt', description: 'Convert between different units' },
      { name: 'Currency Converter', url: 'tools/currency-converter.html', icon: 'fas fa-dollar-sign', description: 'Convert between currencies' },
      { name: 'Temperature Converter', url: 'tools/temperature-converter.html', icon: 'fas fa-thermometer-half', description: 'Convert temperature units' },
      { name: 'Length Converter', url: 'tools/length-converter.html', icon: 'fas fa-ruler', description: 'Convert length measurements' },
      { name: 'Weight Converter', url: 'tools/weight-converter.html', icon: 'fas fa-weight-hanging', description: 'Convert weight measurements' },
      { name: 'Volume Converter', url: 'tools/volume-converter.html', icon: 'fas fa-wine-bottle', description: 'Convert volume measurements' },
      { name: 'Speed Converter', url: 'tools/speed-converter.html', icon: 'fas fa-tachometer-alt', description: 'Convert speed units' },
      { name: 'Time Zone Converter', url: 'tools/time-zone-converter.html', icon: 'fas fa-clock', description: 'Convert between time zones' },
      { name: 'Energy Converter', url: 'tools/energy-converter.html', icon: 'fas fa-bolt', description: 'Convert energy units' },
      { name: 'Pressure Converter', url: 'tools/pressure-converter.html', icon: 'fas fa-compress-arrows-alt', description: 'Convert pressure units' }
    ],
    'Security & Encryption Tools': [
      { name: 'Password Generator', url: 'tools/password-generator.html', icon: 'fas fa-key', description: 'Generate secure passwords' },
      { name: 'Password Strength Checker', url: 'tools/password-strength-checker.html', icon: 'fas fa-shield-alt', description: 'Check password strength' },
      { name: 'Hash Generator', url: 'tools/hash-generator.html', icon: 'fas fa-fingerprint', description: 'Generate cryptographic hashes' },
      { name: 'SHA Hash Generator', url: 'tools/sha-hash-generator.html', icon: 'fas fa-lock', description: 'Generate SHA hashes' },
      { name: 'Password Hash Generator', url: 'tools/password-hash-generator.html', icon: 'fas fa-unlock-alt', description: 'Hash passwords securely' },
      { name: 'Encryption/Decryption', url: 'tools/encryption-decryption.html', icon: 'fas fa-lock', description: 'Encrypt and decrypt text' },
      { name: '2FA Generator', url: 'tools/2fa-generator.html', icon: 'fas fa-mobile-alt', description: 'Generate 2FA codes' },
      { name: 'Key Generator', url: 'tools/key-generator.html', icon: 'fas fa-key', description: 'Generate encryption keys' },
      { name: 'File Hash Calculator', url: 'tools/file-hash-calculator.html', icon: 'fas fa-file-alt', description: 'Calculate file hashes' },
      { name: 'Checksum Calculator', url: 'tools/checksum-calculator.html', icon: 'fas fa-check-double', description: 'Calculate file checksums' },
      { name: 'Digital Signature Generator', url: 'tools/digital-signature-generator.html', icon: 'fas fa-signature', description: 'Generate digital signatures' },
      { name: 'Certificate Generator', url: 'tools/certificate-generator.html', icon: 'fas fa-certificate', description: 'Generate SSL certificates' }
    ],
    'Social Media Tools': [
      { name: 'QR Code Generator', url: 'tools/qr-code-generator.html', icon: 'fas fa-qrcode', description: 'Generate QR codes for any content' },
      { name: 'Social Media Post Generator', url: 'tools/social-media-post-generator.html', icon: 'fas fa-share-alt', description: 'Generate social media posts' },
      { name: 'Social Media Analytics', url: 'tools/social-media-analytics.html', icon: 'fas fa-chart-bar', description: 'Analyze social media metrics' },
      { name: 'Social Media Scheduler', url: 'tools/social-media-scheduler.html', icon: 'fas fa-calendar-alt', description: 'Schedule social media posts' },
      { name: 'YouTube Video Downloader', url: 'tools/youtube-video-downloader.html', icon: 'fab fa-youtube', description: 'Download YouTube videos' },
      { name: 'YouTube Thumbnail Downloader', url: 'tools/youtube-thumbnail-downloader.html', icon: 'fab fa-youtube', description: 'Download YouTube thumbnails' },
      { name: 'YouTube Tags Extractor', url: 'tools/youtube-tags-extractor.html', icon: 'fab fa-youtube', description: 'Extract YouTube video tags' },
      { name: 'Facebook Video Downloader', url: 'tools/facebook-video-downloader.html', icon: 'fab fa-facebook', description: 'Download Facebook videos' },
      { name: 'Twitter Video Downloader', url: 'tools/twitter-video-downloader.html', icon: 'fab fa-twitter', description: 'Download Twitter videos' },
      { name: 'TikTok Video Downloader', url: 'tools/tiktok-video-downloader.html', icon: 'fab fa-tiktok', description: 'Download TikTok videos' },
      { name: 'Instagram Photo Downloader', url: 'tools/instagram-photo-downloader.html', icon: 'fab fa-instagram', description: 'Download Instagram photos' },
      { name: 'URL Shortener', url: 'tools/url-shortener.html', icon: 'fas fa-link', description: 'Shorten long URLs' }
    ],
    'Miscellaneous Tools': [
      { name: 'Random Number Generator', url: 'tools/random-number-generator.html', icon: 'fas fa-dice', description: 'Generate random numbers' },
      { name: 'Random String Generator', url: 'tools/random-string-generator.html', icon: 'fas fa-random', description: 'Generate random strings' },
      { name: 'Dice Roller', url: 'tools/dice-roller.html', icon: 'fas fa-dice', description: 'Roll virtual dice' },
      { name: 'Flip a Coin', url: 'tools/flip-a-coin.html', icon: 'fas fa-coins', description: 'Flip a virtual coin' },
      { name: 'Lottery Number Generator', url: 'tools/lottery-number-generator.html', icon: 'fas fa-ticket-alt', description: 'Generate lottery numbers' },
      { name: 'Color Picker', url: 'tools/color-picker.html', icon: 'fas fa-palette', description: 'Pick colors from images' },
      { name: 'Color Code Picker', url: 'tools/color-code-picker.html', icon: 'fas fa-eye-dropper', description: 'Get color codes' },
      { name: 'Barcode Generator', url: 'tools/barcode-generator.html', icon: 'fas fa-barcode', description: 'Generate barcodes' },
      { name: 'Meme Generator', url: 'tools/meme-generator.html', icon: 'fas fa-laugh', description: 'Create memes' },
      { name: 'Business Name Generator', url: 'tools/business-name-generator.html', icon: 'fas fa-building', description: 'Generate business names' },
      { name: 'Name to Numerology', url: 'tools/name-to-numerology.html', icon: 'fas fa-star', description: 'Convert names to numerology' },
      { name: 'Daily Planner', url: 'tools/daily-planner.html', icon: 'fas fa-calendar-day', description: 'Plan your daily activities' },
      { name: 'Resume Builder', url: 'tools/resume-builder.html', icon: 'fas fa-file-alt', description: 'Build professional resumes' },
      { name: 'Invoice Generator', url: 'tools/invoice-generator.html', icon: 'fas fa-file-invoice', description: 'Generate invoices' },
      { name: 'Ebook Creator', url: 'tools/ebook-creator.html', icon: 'fas fa-book', description: 'Create ebooks' }
    ]
  };

  // Function to create a tool button
  function createToolButton(tool) {
    const button = document.createElement('div');
    button.className = 'col-12 col-sm-6 col-md-4 col-lg-3 tool-btn';
    button.innerHTML = `
      <div class="card bg-dark border-danger h-100 tool-card" style="transition: all 0.3s ease; cursor: pointer;">
        <div class="card-body text-center">
          <i class="${tool.icon} text-danger fs-1 mb-3"></i>
          <h5 class="card-title text-light mb-2">${tool.name}</h5>
          <p class="card-text text-muted small">${tool.description}</p>
        </div>
      </div>
    `;
    
    // Add click event
    button.addEventListener('click', function(e) {
      // Check if Ctrl/Cmd key is pressed
      if (e.ctrlKey || e.metaKey) {
        // Open in new tab
        window.open(tool.url, '_blank');
      } else {
        // Open in same tab
        window.location.href = tool.url;
      }
    });
    
    // Add hover effects
    const card = button.querySelector('.tool-card');
    button.addEventListener('mouseenter', function() {
      card.style.transform = 'translateY(-5px)';
      card.style.boxShadow = '0 8px 25px rgba(220, 53, 69, 0.3)';
    });
    
    button.addEventListener('mouseleave', function() {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = 'none';
    });
    
    return button;
  }

    // Function to populate tools in a category
  function populateCategory(categoryName, tools) {
    console.log(`Populating category: ${categoryName}`);
    
    // Map category names to match the HTML
    const categoryMap = {
      'Image Tools': 'Image Tools',
      'SEO Tools': 'SEO Tools',
      'Text Tools': 'Text Tools',
      'Developer Tools': 'Developer Tools',
      'Math & Calculators': 'Math & Calculators',
      'Unit Converters': 'Unit Converters',
      'Security & Encryption Tools': 'Security Tools',
      'Social Media Tools': 'Social Media Tools',
      'Miscellaneous Tools': 'Other Tools'
    };
    
    // Get the display name for this category
    const displayName = categoryMap[categoryName] || categoryName;
    
    // Find the category section by looking for h2 elements
    const allHeadings = Array.from(document.querySelectorAll('h2'));
    const categoryHeading = allHeadings.find(heading => 
      heading.textContent.trim() === displayName
    );
    
    if (!categoryHeading) {
      console.warn(`Category heading not found: ${displayName}`);
      return;
    }
    
    // Find the container - it's the next sibling with class 'row'
    let container = categoryHeading.nextElementSibling;
    while (container && !container.classList.contains('row')) {
      container = container.nextElementSibling;
    }
    
    if (!container) {
      console.warn(`Container not found for category: ${displayName}`);
      return;
    }
    
    // Clear existing content
    container.innerHTML = '';
    
    // Add all tools
    tools.forEach(tool => {
      const toolButton = createToolButton(tool);
      container.appendChild(toolButton);
    });
    
    console.log(`Populated ${tools.length} tools for category: ${categoryName}`);
  }

  // Function to populate all tools
  function populateAllTools() {
    console.log('Available categories:', Object.keys(toolCategories));
    console.log('Total categories to populate:', Object.keys(toolCategories).length);
    
    try {
      Object.keys(toolCategories).forEach(categoryName => {
        try {
          console.log(`Populating category: ${categoryName} with ${toolCategories[categoryName].length} tools`);
          populateCategory(categoryName, toolCategories[categoryName]);
        } catch (error) {
          console.error(`Error populating category ${categoryName}:`, error);
        }
      });
      console.log('All tools populated successfully');
    } catch (error) {
      console.error('Error in populateAllTools:', error);
    }
    
    console.log('Tool population completed');
  }

  // Function to search tools
  function searchTools(query) {
    const allToolButtons = document.querySelectorAll('.tool-btn');
    const searchTerm = query.toLowerCase();
    
    allToolButtons.forEach(button => {
      const toolName = button.querySelector('.card-title').textContent.toLowerCase();
      const toolDescription = button.querySelector('.card-text').textContent.toLowerCase();
      
      if (toolName.includes(searchTerm) || toolDescription.includes(searchTerm)) {
        button.style.display = '';
      } else {
        button.style.display = 'none';
      }
    });
  }

  // Function to clear search
  function clearSearch() {
    const allToolButtons = document.querySelectorAll('.tool-btn');
    allToolButtons.forEach(button => {
      button.style.display = '';
    });
  }

  // Initialize search functionality
  const searchInput = document.getElementById('toolSearch');
  const searchButton = document.getElementById('searchBtn');
  const clearButton = document.getElementById('clearBtn');

  if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        searchTools(searchInput.value);
      }
    });
  }

  if (searchButton) {
    searchButton.addEventListener('click', () => searchTools(searchInput.value));
  }

  if (clearButton) {
    clearButton.addEventListener('click', clearSearch);
  }

  // Initialize tools when DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('DOM fully loaded, populating tools...');
      populateAllTools();
    });
  } else {
    console.log('DOM already loaded, populating tools...');
    populateAllTools();
  }

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const query = this.value.trim();
      if (query === '') {
        clearSearch();
      } else {
        searchTools(query);
      }
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', function() {
      const query = searchInput.value.trim();
      if (query === '') {
        clearSearch();
      } else {
        searchTools(query);
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      searchInput.value = '';
      clearSearch();
    });
  }

  // Add keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (searchInput) {
        searchInput.focus();
      }
    }
    
    // Escape to clear search
    if (e.key === 'Escape') {
      if (searchInput) {
        searchInput.value = '';
        clearSearch();
        searchInput.blur();
      }
    }
  });

  console.log('Tool loader initialized successfully');
}

// Initialize tool loader when the script loads
initToolLoader();

// Helper function to check if element contains text (for older browsers)
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

// Add contains method for older browsers
if (!Element.prototype.contains) {
  Element.prototype.contains = function(node) {
    if (!node) return false;
    return this === node || (this.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINS) !== 0;
  };
}
