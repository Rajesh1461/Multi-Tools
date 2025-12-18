// Simple Tool Loader - Mobile Optimized
// Production mode: console.log removed for performance
const DEBUG = false;
const log = DEBUG ? console.log.bind(console) : () => { };

// Lightweight icon mapper - replaces Font Awesome with emoji (saves ~100 KiB)
const iconMap = {
  'fas fa-compress': '🗜️', 'fas fa-expand-arrows-alt': '↔️', 'fas fa-crop': '✂️',
  'fas fa-exchange-alt': '🔄', 'fas fa-magic': '✨', 'fas fa-file-image': '🖼️',
  'fas fa-code': '💻', 'fas fa-play-circle': '▶️', 'fas fa-file-pdf': '📄',
  'fas fa-tags': '🏷️', 'fas fa-search': '🔍', 'fas fa-sitemap': '🗺️',
  'fas fa-robot': '🤖', 'fas fa-tachometer-alt': '⚡', 'fas fa-mobile-alt': '📱',
  'fas fa-shield-alt': '🛡️', 'fas fa-link': '🔗', 'fas fa-chart-line': '📈',
  'fas fa-check-circle': '✅', 'fas fa-redo': '↩️', 'fas fa-font': '🔤',
  'fas fa-hashtag': '#️⃣', 'fas fa-spell-check': '✏️', 'fas fa-text-width': '📏',
  'fas fa-text-height': '📐', 'fas fa-random': '🎲', 'fas fa-book': '📖',
  'fas fa-copy': '📋', 'fas fa-volume-up': '🔊', 'fas fa-microphone': '🎤',
  'fas fa-file-code': '📝', 'fas fa-database': '💾', 'fas fa-calculator': '🔢',
  'fas fa-percentage': '%', 'fas fa-weight': '⚖️', 'fas fa-utensils': '🍴',
  'fas fa-birthday-cake': '🎂', 'fas fa-home': '🏠', 'fas fa-tag': '🏷️',
  'fas fa-square': '⬜', 'fas fa-cube': '⬛', 'fas fa-angle-right': '▶️',
  'fas fa-ruler': '📏', 'fas fa-weight-hanging': '⚖️', 'fas fa-thermometer-half': '🌡️',
  'fas fa-dollar-sign': '$', 'fas fa-wine-bottle': '🍾', 'fas fa-clock': '🕐',
  'fas fa-bolt': '⚡', 'fas fa-compress-arrows-alt': '↕️', 'fas fa-hdd': '💿',
  'fas fa-car': '🚗', 'fas fa-key': '🔑', 'fas fa-fingerprint': '👆',
  'fas fa-lock': '🔒', 'fas fa-unlock-alt': '🔓', 'fas fa-file-alt': '📄',
  'fas fa-check-double': '✅', 'fas fa-signature': '✍️', 'fas fa-certificate': '📜',
  'fas fa-share-alt': '📤', 'fab fa-youtube': '▶️', 'fas fa-chart-bar': '📊',
  'fas fa-calendar-alt': '📅', 'fab fa-facebook': '📘', 'fab fa-twitter': '🐦',
  'fab fa-tiktok': '🎵', 'fab fa-instagram': '📷', 'fas fa-qrcode': '📱',
  'fas fa-dice': '🎲', 'fas fa-coins': '🪙', 'fas fa-ticket-alt': '🎫',
  'fas fa-palette': '🎨', 'fas fa-eye-dropper': '🎨', 'fas fa-barcode': '📊',
  'fas fa-laugh': '😄', 'fas fa-building': '🏢', 'fas fa-star': '⭐',
  'fas fa-calendar-day': '📅', 'fas fa-file-invoice': '🧾', 'fas fa-heart': '❤️',
  'fas fa-smile': '😊', 'fas fa-map-marker-alt': '📍', 'fas fa-search-location': '🔍'
};

function getIcon(faClass) {
  return iconMap[faClass] || '🔧';
}

// Mobile detection - more conservative approach
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && window.innerWidth < 768;

// Store pending search query if tools aren't loaded yet (global scope)
let pendingSearchQuery = null;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  log('DOM loaded, initializing simple tool loader...');
  log('isMobile:', isMobile);
  log('window.innerWidth:', window.innerWidth);
  const isIndexPage = !!(document.body && document.body.classList.contains('index-page'));
  log('isIndexPage:', isIndexPage);

  // Get search input reference early
  const searchInput = document.getElementById('toolSearch');

  // Progressive loading function with requestIdleCallback for better performance
  function loadToolsProgressive() {
    log('loadToolsProgressive called');

    // Start loading tools immediately, but use requestIdleCallback for batching
    log('Starting tool loading...');

    // Check if tools are already loaded to prevent duplicates
    const existingTools = document.querySelectorAll('.tool-btn');
    if (existingTools.length > 0) {
      log('Tools already loaded, skipping...');
      return;
    }

    // Group tools by category and populate each category
    const toolsByCategory = {};
    tools.forEach(tool => {
      if (!toolsByCategory[tool.category]) {
        toolsByCategory[tool.category] = [];
      }
      toolsByCategory[tool.category].push(tool);
    });

    log('Tools grouped by category:', Object.keys(toolsByCategory));

    // Populate categories in batches to avoid blocking main thread
    const categories = Object.keys(toolsByCategory);
    let categoryIndex = 0;

    // Use requestIdleCallback if available, otherwise setTimeout with short delay
    const scheduleWork = window.requestIdleCallback || ((cb) => setTimeout(cb, 50));

    function populateNextCategory() {
      if (categoryIndex >= categories.length) {
        // All categories loaded, apply pending search
        if (pendingSearchQuery) {
          log('Pending search query will be applied now');
          checkAndApplyPendingSearch();
        }
        return;
      }

      const categoryName = categories[categoryIndex];
      log(`Populating category: ${categoryName} with ${toolsByCategory[categoryName].length} tools`);
      populateCategory(categoryName, toolsByCategory[categoryName]);
      categoryIndex++;

      // Continue with next category - use requestIdleCallback if available, otherwise short timeout
      if (window.requestIdleCallback) {
        requestIdleCallback(populateNextCategory, { timeout: 100 });
      } else {
        setTimeout(populateNextCategory, 50);
      }
    }

    // Start populating immediately for first category, then batch the rest
    if (categories.length > 0) {
      const firstCategory = categories[0];
      log(`Populating first category: ${firstCategory} with ${toolsByCategory[firstCategory].length} tools`);
      populateCategory(firstCategory, toolsByCategory[firstCategory]);
      categoryIndex++;

      // Continue with remaining categories
      if (categories.length > 1) {
        scheduleWork(populateNextCategory);
      }
    }
  }

  // Load tools after DOM is ready but prioritize initial render
  if (isIndexPage) {
    log('Index page detected, loading tools...');
    // Use requestIdleCallback if available, but with short timeout to ensure tools load quickly
    if (window.requestIdleCallback) {
      requestIdleCallback(() => {
        loadToolsProgressive();
      }, { timeout: 500 }); // Short timeout to ensure tools appear quickly
    } else {
      // Fallback: load after a short delay to allow initial render
      setTimeout(() => {
        loadToolsProgressive();
      }, 100);
    }
  } else {
    log('Not an index page, skipping tool loading');
  }

  // Tool data - Optimized structure (moved after DOM check to reduce initial parse time)
  // Using compact format to reduce memory footprint
  const tools = [
    // Image Tools
    { name: 'Image Compressor', url: 'tools/image-compressor.html', category: 'Image Tools', icon: 'fas fa-compress' },
    { name: 'Image Resizer', url: 'tools/image-resizer.html', category: 'Image Tools', icon: 'fas fa-expand-arrows-alt' },
    { name: 'Image Cropper', url: 'tools/image-cropper.html', category: 'Image Tools', icon: 'fas fa-crop' },
    { name: 'Image Converter', url: 'tools/image-converter.html', category: 'Image Tools', icon: 'fas fa-exchange-alt' },
    { name: 'Image Background Remover', url: 'tools/image-background-remover.html', category: 'Image Tools', icon: 'fas fa-magic' },
    { name: 'Image to PNG', url: 'tools/image-to-png.html', category: 'Image Tools', icon: 'fas fa-file-image' },
    { name: 'Image to JPG', url: 'tools/image-to-jpg.html', category: 'Image Tools', icon: 'fas fa-file-image' },
    { name: 'Convert WebP to PNG', url: 'tools/convert-webp-to-png.html', category: 'Image Tools', icon: 'fas fa-exchange-alt' },
    { name: 'Convert Image to Base64', url: 'tools/convert-image-to-base64.html', category: 'Image Tools', icon: 'fas fa-code' },
    { name: 'GIF Maker', url: 'tools/gif-maker.html', category: 'Image Tools', icon: 'fas fa-play-circle' },
    { name: 'Screenshot to PDF', url: 'tools/screenshot-to-pdf.html', category: 'Image Tools', icon: 'fas fa-file-pdf' },

    // SEO Tools
    { name: 'Meta Tag Generator', url: 'tools/meta-tag-generator.html', category: 'SEO Tools', icon: 'fas fa-tags' },
    { name: 'Keyword Density Checker', url: 'tools/keyword-density-checker.html', category: 'SEO Tools', icon: 'fas fa-search' },
    { name: 'Sitemap Generator', url: 'tools/sitemap-generator.html', category: 'SEO Tools', icon: 'fas fa-sitemap' },
    { name: 'Robots.txt Generator', url: 'tools/robots-txt-generator.html', category: 'SEO Tools', icon: 'fas fa-robot' },
    { name: 'Page Speed Checker', url: 'tools/page-speed-checker.html', category: 'SEO Tools', icon: 'fas fa-tachometer-alt' },
    { name: 'Mobile Friendly Test', url: 'tools/mobile-friendly-test.html', category: 'SEO Tools', icon: 'fas fa-mobile-alt' },
    { name: 'SSL Certificate Checker', url: 'tools/ssl-certificate-checker.html', category: 'SEO Tools', icon: 'fas fa-shield-alt' },
    { name: 'Backlink Checker', url: 'tools/backlink-checker.html', category: 'SEO Tools', icon: 'fas fa-link' },
    { name: 'Domain Authority Checker', url: 'tools/domain-authority-checker.html', category: 'SEO Tools', icon: 'fas fa-chart-line' },
    { name: 'Google Index Checker', url: 'tools/google-index-checker.html', category: 'SEO Tools', icon: 'fas fa-search' },
    { name: 'XML Sitemap Validator', url: 'tools/xml-sitemap-validator.html', category: 'SEO Tools', icon: 'fas fa-check-circle' },
    { name: 'Htaccess Redirect Generator', url: 'tools/htaccess-redirect-generator.html', category: 'SEO Tools', icon: 'fas fa-redo' },

    // Text Tools
    { name: 'Word Counter', url: 'tools/word-counter.html', category: 'Text Tools', icon: 'fas fa-font' },
    { name: 'Character Counter', url: 'tools/character-counter.html', category: 'Text Tools', icon: 'fas fa-hashtag' },
    { name: 'Grammar Checker', url: 'tools/grammar-checker.html', category: 'Text Tools', icon: 'fas fa-spell-check' },
    { name: 'Case Converter', url: 'tools/case-converter.html', category: 'Text Tools', icon: 'fas fa-text-width' },
    { name: 'Text Case Converter', url: 'tools/text-case-converter.html', category: 'Text Tools', icon: 'fas fa-text-height' },
    { name: 'Fancy Text Generator', url: 'tools/fancy-text-generator.html', category: 'Text Tools', icon: 'fas fa-magic' },
    { name: 'Random Text Generator', url: 'tools/random-text-generator.html', category: 'Text Tools', icon: 'fas fa-random' },
    { name: 'Story Plot Generator', url: 'tools/story-plot-generator.html', category: 'Text Tools', icon: 'fas fa-book' },
    { name: 'Hashtag Generator', url: 'tools/hashtag-generator.html', category: 'Text Tools', icon: 'fas fa-hashtag' },
    { name: 'Twitter Character Counter', url: 'tools/twitter-character-counter.html', category: 'Text Tools', icon: 'fab fa-twitter' },
    { name: 'Plagiarism Checker', url: 'tools/plagiarism-checker.html', category: 'Text Tools', icon: 'fas fa-copy' },
    { name: 'Text to Speech', url: 'tools/text-to-speech.html', category: 'Text Tools', icon: 'fas fa-volume-up' },
    { name: 'Speech to Text', url: 'tools/speech-to-text.html', category: 'Text Tools', icon: 'fas fa-microphone' },

    // Developer Tools
    { name: 'JSON Formatter', url: 'tools/json-formatter.html', category: 'Developer Tools', icon: 'fas fa-code' },
    { name: 'HTML to Markdown', url: 'tools/html-to-markdown.html', category: 'Developer Tools', icon: 'fas fa-file-code' },
    { name: 'Markdown to HTML', url: 'tools/markdown-to-html.html', category: 'Developer Tools', icon: 'fas fa-file-code' },
    { name: 'CSS Minifier', url: 'tools/css-minifier.html', category: 'Developer Tools', icon: 'fas fa-compress' },
    { name: 'JavaScript Minifier', url: 'tools/javascript-minifier.html', category: 'Developer Tools', icon: 'fas fa-compress' },
    { name: 'SQL Formatter', url: 'tools/sql-formatter.html', category: 'Developer Tools', icon: 'fas fa-database' },
    { name: 'URL Encoder/Decoder', url: 'tools/url-encoder-decoder.html', category: 'Developer Tools', icon: 'fas fa-link' },
    { name: 'Base64 Encoder/Decoder', url: 'tools/base64-encoder-decoder.html', category: 'Developer Tools', icon: 'fas fa-code' },
    { name: 'Binary Decimal Converter', url: 'tools/binary-decimal-converter.html', category: 'Developer Tools', icon: 'fas fa-calculator' },
    { name: 'AI Chatbot Demo', url: 'tools/ai-chatbot-demo.html', category: 'Developer Tools', icon: 'fas fa-robot' },

    // Math & Calculators
    { name: 'Scientific Calculator', url: 'tools/scientific-calculator.html', category: 'Math & Calculators', icon: 'fas fa-calculator' },
    { name: 'Percentage Calculator', url: 'tools/percentage-calculator.html', category: 'Math & Calculators', icon: 'fas fa-percentage' },
    { name: 'BMI Calculator', url: 'tools/bmi-calculator.html', category: 'Math & Calculators', icon: 'fas fa-weight' },
    { name: 'Tip Calculator', url: 'tools/tip-calculator.html', category: 'Math & Calculators', icon: 'fas fa-utensils' },
    { name: 'Age Calculator', url: 'tools/age-calculator.html', category: 'Math & Calculators', icon: 'fas fa-birthday-cake' },
    { name: 'Compound Interest Calculator', url: 'tools/compound-interest-calculator.html', category: 'Math & Calculators', icon: 'fas fa-chart-line' },
    { name: 'Loan EMI Calculator', url: 'tools/loan-emi-calculator.html', category: 'Math & Calculators', icon: 'fas fa-home' },
    { name: 'Discount Calculator', url: 'tools/discount-calculator.html', category: 'Math & Calculators', icon: 'fas fa-tag' },
    { name: 'Area Calculator', url: 'tools/area-calculator.html', category: 'Math & Calculators', icon: 'fas fa-square' },
    { name: 'Volume Calculator', url: 'tools/volume-calculator.html', category: 'Math & Calculators', icon: 'fas fa-cube' },
    { name: 'Angle Converter', url: 'tools/angle-converter.html', category: 'Math & Calculators', icon: 'fas fa-angle-right' },

    // Unit Converters
    { name: 'Length Converter', url: 'tools/length-converter.html', category: 'Unit Converters', icon: 'fas fa-ruler' },
    { name: 'Weight Converter', url: 'tools/weight-converter.html', category: 'Unit Converters', icon: 'fas fa-weight-hanging' },
    { name: 'Temperature Converter', url: 'tools/temperature-converter.html', category: 'Unit Converters', icon: 'fas fa-thermometer-half' },
    { name: 'Currency Converter', url: 'tools/currency-converter.html', category: 'Unit Converters', icon: 'fas fa-dollar-sign' },
    { name: 'Unit Converter', url: 'tools/unit-converter.html', category: 'Unit Converters', icon: 'fas fa-exchange-alt' },
    { name: 'Volume Converter', url: 'tools/volume-converter.html', category: 'Unit Converters', icon: 'fas fa-wine-bottle' },
    { name: 'Speed Converter', url: 'tools/speed-converter.html', category: 'Unit Converters', icon: 'fas fa-tachometer-alt' },
    { name: 'Time Zone Converter', url: 'tools/time-zone-converter.html', category: 'Unit Converters', icon: 'fas fa-clock' },
    { name: 'Energy Converter', url: 'tools/energy-converter.html', category: 'Unit Converters', icon: 'fas fa-bolt' },
    { name: 'Pressure Converter', url: 'tools/pressure-converter.html', category: 'Unit Converters', icon: 'fas fa-compress-arrows-alt' },
    { name: 'Data Storage Converter', url: 'tools/data-storage-converter.html', category: 'Unit Converters', icon: 'fas fa-hdd' },
    { name: 'Fuel Efficiency Converter', url: 'tools/fuel-efficiency-converter.html', category: 'Unit Converters', icon: 'fas fa-car' },

    // Security & Encryption Tools
    { name: 'Password Generator', url: 'tools/password-generator.html', category: 'Security & Encryption Tools', icon: 'fas fa-key' },
    { name: 'Hash Generator', url: 'tools/hash-generator.html', category: 'Security & Encryption Tools', icon: 'fas fa-fingerprint' },
    { name: 'Base64 Encoder/Decoder', url: 'tools/base64-encoder-decoder.html', category: 'Security & Encryption Tools', icon: 'fas fa-lock' },
    { name: '2FA Generator', url: 'tools/2fa-generator.html', category: 'Security & Encryption Tools', icon: 'fas fa-mobile-alt' },
    { name: 'Password Strength Checker', url: 'tools/password-strength-checker.html', category: 'Security & Encryption Tools', icon: 'fas fa-shield-alt' },
    { name: 'SHA Hash Generator', url: 'tools/sha-hash-generator.html', category: 'Security & Encryption Tools', icon: 'fas fa-lock' },
    { name: 'Password/Email Breach Checker', url: 'tools/password-checker.html', category: 'Security & Encryption Tools', icon: 'fas fa-shield-alt' },
    { name: 'Password Hash Generator', url: 'tools/password-hash-generator.html', category: 'Security & Encryption Tools', icon: 'fas fa-unlock-alt' },
    { name: 'Encryption/Decryption', url: 'tools/encryption-decryption.html', category: 'Security & Encryption Tools', icon: 'fas fa-lock' },
    { name: 'Key Generator', url: 'tools/key-generator.html', category: 'Security & Encryption Tools', icon: 'fas fa-key' },
    { name: 'File Hash Calculator', url: 'tools/file-hash-calculator.html', category: 'Security & Encryption Tools', icon: 'fas fa-file-alt' },
    { name: 'Checksum Calculator', url: 'tools/checksum-calculator.html', category: 'Security & Encryption Tools', icon: 'fas fa-check-double' },
    { name: 'Digital Signature Generator', url: 'tools/digital-signature-generator.html', category: 'Security & Encryption Tools', icon: 'fas fa-signature' },
    { name: 'Certificate Generator', url: 'tools/certificate-generator.html', category: 'Security & Encryption Tools', icon: 'fas fa-certificate' },

    // Social Media Tools
    { name: 'Hashtag Generator', url: 'tools/hashtag-generator.html', category: 'Social Media Tools', icon: 'fas fa-hashtag' },
    { name: 'Social Media Post Generator', url: 'tools/social-media-post-generator.html', category: 'Social Media Tools', icon: 'fas fa-share-alt' },
    { name: 'YouTube Video Downloader', url: 'tools/youtube-video-downloader.html', category: 'Social Media Tools', icon: 'fab fa-youtube' },
    { name: 'Social Media Analytics', url: 'tools/social-media-analytics.html', category: 'Social Media Tools', icon: 'fas fa-chart-bar' },
    { name: 'Social Media Scheduler', url: 'tools/social-media-scheduler.html', category: 'Social Media Tools', icon: 'fas fa-calendar-alt' },
    { name: 'YouTube Thumbnail Downloader', url: 'tools/youtube-thumbnail-downloader.html', category: 'Social Media Tools', icon: 'fab fa-youtube' },
    { name: 'YouTube Tags Extractor', url: 'tools/youtube-tags-extractor.html', category: 'Social Media Tools', icon: 'fab fa-youtube' },
    { name: 'Facebook Video Downloader', url: 'tools/facebook-video-downloader.html', category: 'Social Media Tools', icon: 'fab fa-facebook' },
    { name: 'Twitter Video Downloader', url: 'tools/twitter-video-downloader.html', category: 'Social Media Tools', icon: 'fab fa-twitter' },
    { name: 'TikTok Video Downloader', url: 'tools/tiktok-video-downloader.html', category: 'Social Media Tools', icon: 'fab fa-tiktok' },
    { name: 'Instagram Photo Downloader', url: 'tools/instagram-photo-downloader.html', category: 'Social Media Tools', icon: 'fab fa-instagram' },
    { name: 'URL Shortener', url: 'tools/url-shortener.html', category: 'Social Media Tools', icon: 'fas fa-link' },

    // Miscellaneous Tools
    { name: 'QR Code Generator', url: 'tools/qr-code-generator.html', category: 'Miscellaneous Tools', icon: 'fas fa-qrcode' },
    { name: 'Random Number Generator', url: 'tools/random-number-generator.html', category: 'Miscellaneous Tools', icon: 'fas fa-dice' },
    { name: 'Time Zone Converter', url: 'tools/time-zone-converter.html', category: 'Miscellaneous Tools', icon: 'fas fa-clock' },
    { name: 'URL Shortener', url: 'tools/url-shortener.html', category: 'Miscellaneous Tools', icon: 'fas fa-link' },
    { name: 'Random String Generator', url: 'tools/random-string-generator.html', category: 'Miscellaneous Tools', icon: 'fas fa-random' },
    { name: 'Dice Roller', url: 'tools/dice-roller.html', category: 'Miscellaneous Tools', icon: 'fas fa-dice' },
    { name: 'Flip a Coin', url: 'tools/flip-a-coin.html', category: 'Miscellaneous Tools', icon: 'fas fa-coins' },
    { name: 'Lottery Number Generator', url: 'tools/lottery-number-generator.html', category: 'Miscellaneous Tools', icon: 'fas fa-ticket-alt' },
    { name: 'Color Picker', url: 'tools/color-picker.html', category: 'Miscellaneous Tools', icon: 'fas fa-palette' },
    { name: 'Color Code Picker', url: 'tools/color-code-picker.html', category: 'Miscellaneous Tools', icon: 'fas fa-eye-dropper' },
    { name: 'Barcode Generator', url: 'tools/barcode-generator.html', category: 'Miscellaneous Tools', icon: 'fas fa-barcode' },
    { name: 'Meme Generator', url: 'tools/meme-generator.html', category: 'Miscellaneous Tools', icon: 'fas fa-laugh' },
    { name: 'Business Name Generator', url: 'tools/business-name-generator.html', category: 'Miscellaneous Tools', icon: 'fas fa-building' },
    { name: 'Name to Numerology', url: 'tools/name-to-numerology.html', category: 'Miscellaneous Tools', icon: 'fas fa-star' },
    { name: 'Daily Planner', url: 'tools/daily-planner.html', category: 'Miscellaneous Tools', icon: 'fas fa-calendar-day' },
    { name: 'Resume Builder', url: 'tools/resume-builder.html', category: 'Miscellaneous Tools', icon: 'fas fa-file-alt' },
    { name: 'Invoice Generator', url: 'tools/invoice-generator.html', category: 'Miscellaneous Tools', icon: 'fas fa-file-invoice' },
    { name: 'Ebook Creator', url: 'tools/ebook-creator.html', category: 'Miscellaneous Tools', icon: 'fas fa-book' },
    { name: 'Wedding Invitation Generator', url: 'tools/wedding-invitation-generator.html', category: 'Miscellaneous Tools', icon: 'fas fa-heart' },
    { name: 'Emoji Keyboard', url: 'tools/emoji-keyboard.html', category: 'Miscellaneous Tools', icon: 'fas fa-smile' },
    { name: 'Internet Speed Test', url: 'tools/internet-speed-test.html', category: 'Miscellaneous Tools', icon: 'fas fa-tachometer-alt' },
    { name: 'IP Address Lookup', url: 'tools/ip-address-lookup.html', category: 'Miscellaneous Tools', icon: 'fas fa-map-marker-alt' },
    { name: 'IP Address Tracker', url: 'tools/ip-address-tracker.html', category: 'Miscellaneous Tools', icon: 'fas fa-search-location' }
  ];

  log(`Loaded ${tools.length} tools`);

  // Function to create a tool button (index page gets colorful card, others get compact dark card)
  function createToolButton(tool, styleIndex) {
    log(`Creating tool button for: ${tool.name}`);
    const button = document.createElement('div');
    button.className = 'col-12 col-sm-6 col-md-4 col-lg-3 tool-btn';

    if (isIndexPage) {
      const gradientClasses = ['bg-secondary border-secondary', 'bg-success border-success', 'bg-warning border-warning', 'bg-info border-info'];
      const gradientClass = gradientClasses[styleIndex % gradientClasses.length];
      const iconEmoji = getIcon(tool.icon);
      button.innerHTML = `
        <div class="card ${gradientClass} h-100 tool-card" style="transition: all 0.3s ease;">
          <div class="card-body text-center">
            <div style="font-size: 3rem; line-height: 1; margin-bottom: 0.3rem;">${iconEmoji}</div>
            <h3 class="card-title mb-2">${tool.name}</h3>
          </div>
        </div>
      `;
      // Make entire card clickable
      button.addEventListener('click', function (e) {
        // Check if Ctrl/Cmd key is pressed
        if (e.ctrlKey || e.metaKey) {
          // Open in new tab
          window.open(tool.url, '_blank');
        } else {
          // Open in same tab
          window.location.href = tool.url;
        }
      });
    } else {
      const iconEmoji = getIcon(tool.icon);
      button.innerHTML = `
        <div class="card bg-dark border-danger h-100 tool-card" style="transition: all 0.3s ease; cursor: pointer;">
          <div class="card-body text-center">
            <div style="font-size: 0.9rem; line-height: 1; margin-bottom: 0.3rem; color: #dc3545;">${iconEmoji}</div>
            <h3 class="card-title text-light mb-2">${tool.name}</h3>
          </div>
        </div>
      `;
      // Add click event for non-index pages
      button.addEventListener('click', function (e) {
        // Check if Ctrl/Cmd key is pressed
        if (e.ctrlKey || e.metaKey) {
          // Open in new tab
          window.open(tool.url, '_blank');
        } else {
          // Open in same tab
          window.location.href = tool.url;
        }
      });
      const card = button.querySelector('.tool-card');
      button.addEventListener('mouseenter', function () { card.style.transform = 'translateY(-5px)'; card.style.boxShadow = '0 8px 25px rgba(220, 53, 69, 0.3)'; });
      button.addEventListener('mouseleave', function () { card.style.transform = 'translateY(0)'; card.style.boxShadow = 'none'; });
    }

    return button;
  }

  // Intersection Observer for lazy loading tool buttons
  let toolObserver = null;

  // Initialize Intersection Observer for lazy loading
  function initToolObserver() {
    if (!('IntersectionObserver' in window)) {
      return null; // Fallback for browsers without IntersectionObserver
    }

    return new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const placeholder = entry.target;
          const toolData = placeholder.dataset;

          // Create actual tool button
          const toolButton = createToolButton({
            name: toolData.name,
            url: toolData.url,
            category: toolData.category,
            icon: toolData.icon || 'fas fa-tool' // Fallback icon
          }, parseInt(toolData.styleIndex));

          // Replace placeholder with actual button
          placeholder.parentNode.replaceChild(toolButton, placeholder);

          // Unobserve since we've replaced it
          toolObserver.unobserve(placeholder);
        }
      });
    }, {
      rootMargin: '100px' // Start loading 100px before entering viewport
    });
  }

  // Function to create a lazy loading placeholder
  function createToolPlaceholder(tool, styleIndex) {
    const placeholder = document.createElement('div');
    placeholder.className = 'col-12 col-sm-6 col-md-4 col-lg-3 tool-btn tool-placeholder';
    placeholder.style.minHeight = '200px'; // Reserve space to prevent CLS
    placeholder.dataset.name = tool.name;
    placeholder.dataset.url = tool.url;
    placeholder.dataset.category = tool.category;
    placeholder.dataset.icon = tool.icon;
    placeholder.dataset.styleIndex = styleIndex;

    // Add skeleton loading style
    placeholder.innerHTML = `
      <div class="card bg-secondary h-100 tool-card" style="opacity: 0.3; animation: pulse 1.5s ease-in-out infinite;">
        <div class="card-body text-center">
          <div style="width: 48px; height: 48px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 1rem;"></div>
          <div style="height: 20px; background: rgba(255,255,255,0.2); border-radius: 4px; margin: 0 auto; width: 80%;"></div>
        </div>
      </div>
    `;

    return placeholder;
  }

  // Function to populate tools in a category with lazy loading
  function populateCategory(categoryName, tools) {
    log(`Looking for category: ${categoryName}`);

    // Map category names to match the HTML headings (optimized lookup)
    const categoryMap = {
      'Image Tools': 'Image Tools',
      'SEO Tools': 'SEO Tools',
      'Text Tools': 'Text Tools',
      'Developer Tools': 'Developer Tools',
      'Math & Calculators': 'Math & Calculators',
      'Unit Converters': 'Unit Converters',
      'Security & Encryption Tools': 'Security & Encryption Tools',
      'Social Media Tools': 'Social Media Tools',
      'Miscellaneous Tools': 'Miscellaneous Tools'
    };

    const displayName = categoryMap[categoryName] || categoryName;

    // Cache h2 query result
    const allH2s = document.querySelectorAll('h2');
    log(`Found ${allH2s.length} h2 elements`);

    let categorySection = null;
    for (let h2 of allH2s) {
      if (h2.textContent.trim() === displayName) {
        categorySection = h2;
        log(`Found category section: ${displayName}`);
        break;
      }
    }

    if (!categorySection) {
      log(`Category section not found: ${displayName}`);
      return;
    }

    const categoryContainer = categorySection.nextElementSibling;
    if (!categoryContainer) {
      log(`Category container not found for: ${displayName}`);
      return;
    }

    log(`Found container for ${displayName}`);

    // Initialize observer if not already done
    if (!toolObserver) {
      toolObserver = initToolObserver();
    }

    // Use DocumentFragment to batch DOM operations
    const fragment = document.createDocumentFragment();

    // Determine if we should lazy load (only for below-the-fold categories)
    const isAboveFold = categorySection.getBoundingClientRect().top < window.innerHeight * 1.5;
    const shouldLazyLoad = !isAboveFold && toolObserver;

    let styleIndex = 0;
    tools.forEach(tool => {
      let element;

      if (shouldLazyLoad) {
        // Create placeholder for lazy loading
        element = createToolPlaceholder(tool, styleIndex);
        toolObserver.observe(element);
      } else {
        // Create actual button immediately for above-the-fold content
        element = createToolButton(tool, styleIndex);
      }

      fragment.appendChild(element);
      styleIndex++;
      log(`Appended ${shouldLazyLoad ? 'placeholder' : 'tool button'} for: ${tool.name}`);
    });

    // Clear and append fragment in one operation
    categoryContainer.innerHTML = '';
    categoryContainer.appendChild(fragment);

    log(`Successfully populated ${tools.length} tools for category: ${displayName} (${shouldLazyLoad ? 'lazy loaded' : 'immediate'})`);
  }


  // Add search functionality
  // Note: searchInput already declared above for use in loadToolsProgressive
  const searchBtn = document.getElementById('searchBtn');
  const clearBtn = document.getElementById('clearBtn');

  function searchTools(query) {
    if (!query || query.trim() === '') {
      clearSearch();
      return;
    }

    const allToolButtons = document.querySelectorAll('.tool-btn');

    // If no tools are loaded yet, store the query for later
    if (allToolButtons.length === 0) {
      log('Tools not loaded yet, storing search query:', query);
      pendingSearchQuery = query;
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    let hasMatches = false;
    const categoryVisibility = {};

    // Batch DOM reads first, then batch writes to reduce forced reflows
    const buttonData = Array.from(allToolButtons).map(button => {
      const cardTitle = button.querySelector('.card-title');
      if (!cardTitle) {
        return { button, visible: false, category: null };
      }

      const toolName = cardTitle.textContent.toLowerCase();
      const toolMatches = toolName.includes(searchTerm);
      const categorySection = button.closest('.row')?.previousElementSibling;
      const categoryName = (categorySection && categorySection.tagName === 'H2')
        ? categorySection.textContent.trim()
        : null;

      if (toolMatches && categoryName) {
        categoryVisibility[categoryName] = true;
      }

      return { button, visible: toolMatches, category: categoryName };
    });

    // Batch DOM writes using requestAnimationFrame to reduce reflows
    requestAnimationFrame(() => {
      buttonData.forEach(({ button, visible }) => {
        button.style.display = visible ? '' : 'none';
      });

      // Hide/show category headings based on visibility
      document.querySelectorAll('main h2').forEach(h2 => {
        const categoryName = h2.textContent.trim();
        const categoryRow = h2.nextElementSibling;
        if (categoryRow && categoryRow.classList.contains('row')) {
          const hasVisibleTools = Array.from(categoryRow.querySelectorAll('.tool-btn')).some(btn => {
            return btn.style.display !== 'none' && btn.offsetParent !== null;
          });

          if (hasVisibleTools || searchTerm === '') {
            h2.style.display = '';
            categoryRow.style.display = '';
          } else {
            h2.style.display = 'none';
            categoryRow.style.display = 'none';
          }
        }
      });

      hasMatches = buttonData.some(item => item.visible);
      log(`Search for "${query}" found ${hasMatches ? 'matches' : 'no matches'}`);
    });
  }

  function clearSearch() {
    const allToolButtons = document.querySelectorAll('.tool-btn');
    allToolButtons.forEach(button => {
      button.style.display = '';
    });

    // Show all category headings
    document.querySelectorAll('main h2, main .row').forEach(el => {
      el.style.display = '';
    });

    pendingSearchQuery = null;
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const query = this.value.trim();
      if (query === '') {
        clearSearch();
      } else {
        searchTools(query);
      }
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', function () {
      const query = searchInput.value.trim();
      if (query === '') {
        clearSearch();
      } else {
        searchTools(query);
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      searchInput.value = '';
      clearSearch();
    });
  }

  // Keyboard shortcuts: Ctrl+K to focus search, Escape to clear, Enter to search
  document.addEventListener('keydown', function (e) {
    if (!searchInput) return;
    // Ctrl/Cmd + K focuses search
    const isCtrlK = (e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K');
    if (isCtrlK) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
      return;
    }
    // Escape clears search and blurs input
    if (e.key === 'Escape') {
      if (document.activeElement === searchInput || searchInput.value) {
        e.preventDefault();
        searchInput.value = '';
        clearSearch();
        searchInput.blur();
      }
      return;
    }
    // Enter triggers search when focused
    if (e.key === 'Enter' && document.activeElement === searchInput) {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query === '') {
        clearSearch();
      } else {
        searchTools(query);
      }
    }
  });

  // Apply search from URL parameter ?search=
  // Wait for tools to load before applying URL search
  function applyURLSearch() {
    try {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('search');
      if (q && searchInput) {
        searchInput.value = q;
        // Check if tools are loaded
        const allToolButtons = document.querySelectorAll('.tool-btn');
        if (allToolButtons.length > 0) {
          searchTools(q);
        } else {
          // Store for later when tools load
          pendingSearchQuery = q;
          log('Tools not loaded yet, URL search will be applied after tools load');
        }
      }
    } catch (e) {
      if (DEBUG) console.error('Error applying URL search parameter', e);
    }
  }

  // Try to apply URL search immediately, and also after tools load
  applyURLSearch();

  // Retry URL search after tools should be loaded
  setTimeout(() => {
    if (pendingSearchQuery) {
      applyURLSearch();
    }
  }, 500);

  // Apply pending search query after tools are loaded (with additional delay)
  // This ensures tools are fully rendered before searching
  function checkAndApplyPendingSearch() {
    const allToolButtons = document.querySelectorAll('.tool-btn');
    if (pendingSearchQuery && allToolButtons.length > 0 && searchInput) {
      log('Applying pending search query after tools loaded:', pendingSearchQuery);
      searchInput.value = pendingSearchQuery;
      searchTools(pendingSearchQuery);
      pendingSearchQuery = null; // Clear after applying
    } else if (pendingSearchQuery && allToolButtons.length === 0) {
      // Tools not loaded yet, retry after a delay
      setTimeout(checkAndApplyPendingSearch, 200);
    }
  }

  // Check for pending search multiple times to catch different loading scenarios
  setTimeout(checkAndApplyPendingSearch, 300);
  setTimeout(checkAndApplyPendingSearch, 600);
  setTimeout(checkAndApplyPendingSearch, 1000);

  log('✅ Simple tool loader completed successfully');
});
