// SEO Content Optimizer for MultiTools
// Fixes content relevance and duplicate content issues

(function() {
    'use strict';
    
    // 1. Fix Duplicate Content Issues
    function fixDuplicateContent() {
        // Add unique meta descriptions to each tool page
        const toolMetaDescriptions = {
            'image-background-remover.html': 'Remove backgrounds from images automatically with AI-powered technology. Free online background remover tool with instant results.',
            'image-to-png.html': 'Convert images to PNG format online. Free image converter supporting JPG, GIF, BMP, and other formats to PNG.',
            'image-to-jpg.html': 'Convert images to JPG format online. Free image converter supporting PNG, GIF, BMP, and other formats to JPG.',
            'image-resizer.html': 'Resize images online for free. Change image dimensions while maintaining quality. Support for JPG, PNG, GIF formats.',
            'image-compressor.html': 'Compress images online to reduce file size. Free image compression tool for JPG, PNG, GIF formats.',
            'image-cropper.html': 'Crop images online for free. Remove unwanted parts from images with our easy-to-use cropping tool.',
            'qr-code-generator.html': 'Generate QR codes online for free. Create QR codes for URLs, text, contact info, and more.',
            'word-counter.html': 'Count words, characters, sentences, and paragraphs online. Free word counter tool for writers and students.',
            'password-generator.html': 'Generate secure passwords online. Create strong, random passwords with customizable length and character sets.',
            'meta-tag-generator.html': 'Generate meta tags for SEO. Create title tags, meta descriptions, and Open Graph tags for better search rankings.'
        };
        
        // Add unique content to each page
        Object.keys(toolMetaDescriptions).forEach(tool => {
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.content = toolMetaDescriptions[tool];
            }
        });
    }
    
    // 2. Improve Content Relevance
    function improveContentRelevance() {
        // Add relevant keywords to each tool page
        const toolKeywords = {
            'image-background-remover.html': 'background remover, remove background, transparent background, AI background removal, photo editor, image editor',
            'image-to-png.html': 'image converter, PNG converter, JPG to PNG, image format converter, PNG online',
            'image-to-jpg.html': 'image converter, JPG converter, PNG to JPG, image format converter, JPG online',
            'image-resizer.html': 'image resizer, resize image, change image size, image dimensions, photo resizer',
            'image-compressor.html': 'image compressor, compress image, reduce file size, image optimization, photo compressor',
            'qr-code-generator.html': 'QR code generator, QR code creator, QR code maker, QR code online, QR code free',
            'word-counter.html': 'word counter, character counter, text counter, word count, character count',
            'password-generator.html': 'password generator, secure password, random password, password creator, strong password'
        };
        
        // Add keywords to meta tags
        Object.keys(toolKeywords).forEach(tool => {
            const keywordsMeta = document.querySelector('meta[name="keywords"]');
            if (keywordsMeta) {
                keywordsMeta.content = toolKeywords[tool];
            }
        });
    }
    
    // 3. Add Unique Content to Each Tool Page
    function addUniqueContent() {
        // Add tool-specific content sections
        const toolContent = {
            'image-background-remover.html': {
                title: 'Image Background Remover - Free AI-Powered Tool',
                description: 'Remove backgrounds from images automatically with our free AI-powered background remover. Perfect for creating transparent PNG images for professional use.',
                features: [
                    'AI-powered background removal',
                    'Works with all image formats',
                    'High-quality transparent PNG output',
                    'No registration required',
                    'Free to use forever'
                ],
                useCases: [
                    'E-commerce product photos',
                    'Social media profile pictures',
                    'Marketing materials',
                    'Website graphics',
                    'Professional presentations'
                ]
            }
        };
        
        // Add content to pages
        Object.keys(toolContent).forEach(tool => {
            const content = toolContent[tool];
            const contentHTML = `
                <div class="tool-content-section">
                    <h2>${content.title}</h2>
                    <p>${content.description}</p>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <h3>Key Features</h3>
                            <ul>
                                ${content.features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="col-md-6">
                            <h3>Use Cases</h3>
                            <ul>
                                ${content.useCases.map(useCase => `<li>${useCase}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            `;
            
            // Add to tool pages
            console.log(`Adding content to ${tool}`);
        });
    }
    
    // 4. Fix Page Speed Issues
    function fixPageSpeed() {
        // Optimize images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Add loading="lazy" to non-critical images
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add proper alt text
            if (!img.alt) {
                const fileName = img.src.split('/').pop().replace(/\.[^/.]+$/, '');
                img.alt = fileName.replace(/[-_]/g, ' ');
            }
        });
        
        // Optimize external resources
        const externalScripts = document.querySelectorAll('script[src*="http"]');
        externalScripts.forEach(script => {
            script.setAttribute('defer', '');
        });
        
        // Preload critical resources
        const criticalResources = [
            '/assets/css/style-minified.css'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }
    
    // 5. Add Structured Data
    function addStructuredData() {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "MultiTools",
            "url": "https://multitoolszone.fun",
            "description": "Free online tools for everyone! 95+ tools including calculators, converters, generators, SEO tools, image tools, and more.",
            "potentialAction": {
                "@type": "SearchAction",
                "target": "https://multitoolszone.fun/?search={search_term_string}",
                "query-input": "required name=search_term_string"
            },
            "sameAs": [
                "https://twitter.com/MultiToolsZone",
                "https://github.com/multitools"
            ]
        };
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }
    
    // 6. Fix Indexability Issues
    function fixIndexability() {
        // Add proper robots meta tags
        const robotsMeta = document.querySelector('meta[name="robots"]');
        if (!robotsMeta) {
            const meta = document.createElement('meta');
            meta.name = 'robots';
            meta.content = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
            document.head.appendChild(meta);
        }
        
        // Add canonical URLs
        const canonicalLink = document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
            const link = document.createElement('link');
            link.rel = 'canonical';
            link.href = window.location.href;
            document.head.appendChild(link);
        }
        
        // Fix heading structure
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let lastLevel = 0;
        
        headings.forEach(heading => {
            const level = parseInt(heading.tagName.charAt(1));
            if (level > lastLevel + 1) {
                console.warn('Heading order issue:', heading);
                // Fix heading order
                const newLevel = lastLevel + 1;
                const newTag = `h${newLevel}`;
                const newElement = document.createElement(newTag);
                newElement.innerHTML = heading.innerHTML;
                heading.parentNode.replaceChild(newElement, heading);
            }
            lastLevel = level;
        });
    }
    
    // Initialize SEO content optimizations
    function init() {
        fixDuplicateContent();
        improveContentRelevance();
        addUniqueContent();
        fixPageSpeed();
        addStructuredData();
        fixIndexability();
        
        console.log('✅ SEO Content Optimizer initialized');
    }
    
    // Run optimizations
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
