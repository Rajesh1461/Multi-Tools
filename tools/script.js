// Image to PNG Converter Tool
let selectedFile = null;
let convertedImageData = null;
let originalImageData = null;

// File selection handler
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB.');
        return;
    }

    selectedFile = file;
    displayImagePreview(file);
    showConversionOptions();
    enableConvertButton();
}

// Display image preview
function displayImagePreview(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = document.getElementById('previewImg');
        img.src = e.target.result;
        
        // Get image dimensions
        img.onload = function() {
            const width = this.naturalWidth;
            const height = this.naturalHeight;
            const size = formatFileSize(file.size);
            
            document.getElementById('imageInfo').textContent = 
                `${width} × ${height} pixels • ${size}`;
            
            // Store original dimensions for resize calculations
            originalImageData = {
                width: width,
                height: height,
                size: file.size
            };
            
            // Set default resize values
            document.getElementById('maxWidth').value = Math.min(width, 800);
            document.getElementById('maxHeight').value = Math.min(height, 600);
        };
        
        document.getElementById('imagePreview').style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// Show conversion options
function showConversionOptions() {
    document.getElementById('conversionOptions').style.display = 'block';
}

// Enable convert button
function enableConvertButton() {
    document.getElementById('convertBtn').disabled = false;
}

// Update quality value display
function updateQualityValue() {
    const quality = document.getElementById('qualitySlider').value;
    document.getElementById('qualityValue').textContent = quality;
}

// Handle resize checkbox change
document.addEventListener('DOMContentLoaded', function() {
    const resizeCheckbox = document.getElementById('resizeImage');
    const resizeOptions = document.getElementById('resizeOptions');
    
    if (resizeCheckbox) {
        resizeCheckbox.addEventListener('change', function() {
            resizeOptions.style.display = this.checked ? 'block' : 'none';
        });
    }
});

// Convert image to PNG
function convertToPNG() {
    if (!selectedFile) {
        alert('Please select an image file first.');
        return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = document.getElementById('previewImg');
    
    // Get conversion options
    const quality = parseInt(document.getElementById('qualitySlider').value) / 100;
    const pngFormat = document.getElementById('pngFormat').value;
    const maintainAspect = document.getElementById('maintainAspect').checked;
    const resizeImage = document.getElementById('resizeImage').checked;
    
    let targetWidth = img.naturalWidth;
    let targetHeight = img.naturalHeight;
    
    // Handle resizing
    if (resizeImage) {
        const maxWidth = parseInt(document.getElementById('maxWidth').value);
        const maxHeight = parseInt(document.getElementById('maxHeight').value);
        
        if (maintainAspect) {
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            if (maxWidth / aspectRatio <= maxHeight) {
                targetWidth = maxWidth;
                targetHeight = maxWidth / aspectRatio;
            } else {
                targetHeight = maxHeight;
                targetWidth = maxHeight * aspectRatio;
            }
        } else {
            targetWidth = maxWidth;
            targetHeight = maxHeight;
        }
    }
    
    // Set canvas dimensions
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    
    // Draw image with resizing
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    
    // Convert to PNG
    try {
        // For PNG, quality doesn't affect file size much, but we can use it for other optimizations
        const pngDataUrl = canvas.toDataURL('image/png', quality);
        convertedImageData = pngDataUrl;
        
        // Calculate file sizes
        const originalSize = originalImageData.size;
        const pngSize = Math.round(pngDataUrl.length * 0.75); // Approximate PNG size
        
        // Display results
        document.getElementById('originalSize').textContent = formatFileSize(originalSize);
        document.getElementById('pngSize').textContent = formatFileSize(pngSize);
        
        const compressionRatio = ((originalSize - pngSize) / originalSize * 100).toFixed(1);
        document.getElementById('compressionRatio').textContent = `${compressionRatio}%`;
        
        // Show results and enable download
        document.getElementById('resultsSection').style.display = 'block';
        document.getElementById('downloadBtn').disabled = false;
        
        // Show success message
        showNotification('Image converted successfully!', 'success');
        
    } catch (error) {
        console.error('Conversion error:', error);
        showNotification('Error converting image. Please try again.', 'error');
    }
}

// Download converted PNG
function downloadPNG() {
    if (!convertedImageData) {
        alert('No converted image available.');
        return;
    }
    
    const link = document.createElement('a');
    link.download = `converted_${selectedFile.name.replace(/\.[^/.]+$/, '')}.png`;
    link.href = convertedImageData;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Reset tool
function resetTool() {
    // Clear file input
    document.getElementById('imageInput').value = '';
    
    // Hide preview and options
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('conversionOptions').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'none';
    
    // Reset form elements
    document.getElementById('qualitySlider').value = 90;
    document.getElementById('qualityValue').textContent = '90';
    document.getElementById('pngFormat').value = 'png24';
    document.getElementById('maintainAspect').checked = true;
    document.getElementById('resizeImage').checked = false;
    document.getElementById('resizeOptions').style.display = 'none';
    
    // Disable buttons
    document.getElementById('convertBtn').disabled = true;
    document.getElementById('downloadBtn').disabled = true;
    
    // Clear variables
    selectedFile = null;
    convertedImageData = null;
    originalImageData = null;
    
    showNotification('Tool reset successfully!', 'info');
}

// Utility function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Drag and drop functionality
document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.querySelector('.card-body');
    
    if (dropZone) {
        dropZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#dc3545';
            this.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
        });
        
        dropZone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = '#dc3545';
            this.style.backgroundColor = '';
        });
        
        dropZone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '#dc3545';
            this.style.backgroundColor = '';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const fileInput = document.getElementById('imageInput');
                fileInput.files = files;
                handleFileSelect({ target: { files: files } });
            }
        });
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'o':
                e.preventDefault();
                document.getElementById('imageInput').click();
                break;
            case 'Enter':
                e.preventDefault();
                if (!document.getElementById('convertBtn').disabled) {
                    convertToPNG();
                }
                break;
            case 's':
                e.preventDefault();
                if (!document.getElementById('downloadBtn').disabled) {
                    downloadPNG();
                }
                break;
        }
    }
});

// Initialize tool
document.addEventListener('DOMContentLoaded', function() {
    // Add drag and drop hint
    const dropZone = document.querySelector('.card-body');
    if (dropZone) {
        const hint = document.createElement('div');
        hint.className = 'text-center text-muted mt-3';
        hint.innerHTML = '<i class="fas fa-mouse-pointer me-2"></i>Drag and drop image here or click Browse';
        dropZone.appendChild(hint);
    }
    
    // Show welcome message
    showNotification('Welcome to Image to PNG Converter! Select an image to get started.', 'info');
});
