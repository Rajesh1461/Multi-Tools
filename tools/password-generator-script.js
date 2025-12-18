// Password Generator Tool
let generatedPasswords = [];
let currentEntropy = 0;

// Update length value display
function updateLengthValue() {
    const length = document.getElementById('passwordLength').value;
    document.getElementById('lengthValue').textContent = length;
    
    // Auto-adjust strength level based on length
    const strengthSelect = document.getElementById('passwordStrength');
    if (length <= 12) {
        strengthSelect.value = 'weak';
    } else if (length <= 16) {
        strengthSelect.value = 'medium';
    } else if (length <= 20) {
        strengthSelect.value = 'strong';
    } else {
        strengthSelect.value = 'very-strong';
    }
}

// Generate passwords based on selected options
function generatePasswords() {
    // Validate that at least one character type is selected
    const useUppercase = document.getElementById('useUppercase').checked;
    const useLowercase = document.getElementById('useLowercase').checked;
    const useNumbers = document.getElementById('useNumbers').checked;
    const useSymbols = document.getElementById('useSymbols').checked;
    
    if (!useUppercase && !useLowercase && !useNumbers && !useSymbols) {
        showNotification('Please select at least one character type!', 'error');
        return;
    }
    
    const length = parseInt(document.getElementById('passwordLength').value);
    const count = parseInt(document.getElementById('passwordCount').value);
    const useSimilar = document.getElementById('useSimilar').checked;
    const useAmbiguous = document.getElementById('useAmbiguous').checked;
    const customChars = document.getElementById('customChars').value;
    const excludeChars = document.getElementById('excludeChars').value;
    
    // Build character pool
    let charPool = '';
    
    if (useUppercase) charPool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLowercase) charPool += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumbers) charPool += '0123456789';
    if (useSymbols) charPool += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (customChars) charPool += customChars;
    
    // Remove excluded characters
    if (useSimilar) {
        charPool = charPool.replace(/[l1IO0]/g, '');
    }
    if (useAmbiguous) {
        charPool = charPool.replace(/[{}[\]|\\]/g, '');
    }
    if (excludeChars) {
        for (let char of excludeChars) {
            charPool = charPool.replace(new RegExp(char, 'g'), '');
        }
    }
    
    if (charPool.length === 0) {
        showNotification('No characters available after exclusions!', 'error');
        return;
    }
    
    // Generate passwords
    generatedPasswords = [];
    for (let i = 0; i < count; i++) {
        let password = '';
        let hasUppercase = false;
        let hasLowercase = false;
        let hasNumber = false;
        let hasSymbol = false;
        
        // Ensure at least one character from each selected type
        if (useUppercase) {
            const upperChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(Math.floor(Math.random() * 26));
            password += upperChar;
            hasUppercase = true;
        }
        if (useLowercase) {
            const lowerChar = 'abcdefghijklmnopqrstuvwxyz'.charAt(Math.floor(Math.random() * 26));
            password += lowerChar;
            hasLowercase = true;
        }
        if (useNumbers) {
            const numChar = '0123456789'.charAt(Math.floor(Math.random() * 10));
            password += numChar;
            hasNumber = true;
        }
        if (useSymbols) {
            const symbolChar = '!@#$%^&*()_+-=[]{}|;:,.<>?'.charAt(Math.floor(Math.random() * 30));
            password += symbolChar;
            hasSymbol = true;
        }
        
        // Fill remaining length with random characters
        while (password.length < length) {
            const randomChar = charPool.charAt(Math.floor(Math.random() * charPool.length));
            password += randomChar;
            
            // Update character type flags
            if (!hasUppercase && /[A-Z]/.test(randomChar)) hasUppercase = true;
            if (!hasLowercase && /[a-z]/.test(randomChar)) hasLowercase = true;
            if (!hasNumber && /[0-9]/.test(randomChar)) hasNumber = true;
            if (!hasSymbol && /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(randomChar)) hasSymbol = true;
        }
        
        // Shuffle the password
        password = shuffleString(password);
        generatedPasswords.push(password);
    }
    
    // Calculate entropy
    currentEntropy = calculateEntropy(charPool, length);
    
    // Display passwords
    displayPasswords();
    
    // Show success message
    showNotification(`${count} password${count > 1 ? 's' : ''} generated successfully!`, 'success');
}

// Shuffle string characters
function shuffleString(str) {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
}

// Calculate password entropy
function calculateEntropy(charPool, length) {
    const poolSize = charPool.length;
    return Math.log2(Math.pow(poolSize, length));
}

// Display generated passwords
function displayPasswords() {
    const passwordsList = document.getElementById('passwordsList');
    const passwordsSection = document.getElementById('passwordsSection');
    const copyAllBtn = document.getElementById('copyAllBtn');
    
    let html = '';
    generatedPasswords.forEach((password, index) => {
        const strength = getPasswordStrength(password);
        const strengthClass = getStrengthClass(strength);
        
        html += `
            <div class="row mb-2 align-items-center">
                <div class="col-md-8">
                    <div class="input-group">
                        <input type="text" class="form-control bg-dark text-light border-danger" value="${password}" readonly>
                        <button class="btn btn-outline-danger" type="button" onclick="copyPassword(${index})">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </div>
                <div class="col-md-4">
                    <span class="badge ${strengthClass}">${strength}</span>
                    <button class="btn btn-sm btn-outline-info ms-2" onclick="analyzePassword('${password}')">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    passwordsList.innerHTML = html;
    passwordsSection.style.display = 'block';
    copyAllBtn.disabled = false;
    
    // Update badges
    document.getElementById('strengthBadge').textContent = getOverallStrength();
    document.getElementById('entropyBadge').textContent = `Entropy: ${currentEntropy.toFixed(1)}`;
}

// Get password strength
function getPasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (password.length >= 20) score++;
    
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) score++;
    
    if (password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password)) score++;
    
    if (score <= 3) return 'Weak';
    if (score <= 5) return 'Medium';
    if (score <= 7) return 'Strong';
    return 'Very Strong';
}

// Get strength class for styling
function getStrengthClass(strength) {
    switch (strength) {
        case 'Weak': return 'bg-danger';
        case 'Medium': return 'bg-warning';
        case 'Strong': return 'bg-info';
        case 'Very Strong': return 'bg-success';
        default: return 'bg-secondary';
    }
}

// Get overall strength
function getOverallStrength() {
    const strengths = generatedPasswords.map(p => getPasswordStrength(p));
    const strongCount = strengths.filter(s => s === 'Strong' || s === 'Very Strong').length;
    const total = strengths.length;
    
    if (strongCount === total) return 'All Strong';
    if (strongCount >= total * 0.8) return 'Mostly Strong';
    if (strongCount >= total * 0.6) return 'Mixed';
    if (strongCount >= total * 0.4) return 'Mostly Weak';
    return 'All Weak';
}

// Copy individual password
function copyPassword(index) {
    const password = generatedPasswords[index];
    navigator.clipboard.writeText(password).then(() => {
        showNotification('Password copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = password;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Password copied to clipboard!', 'success');
    });
}

// Copy all passwords
function copyAllPasswords() {
    const allPasswords = generatedPasswords.join('\n');
    navigator.clipboard.writeText(allPasswords).then(() => {
        showNotification('All passwords copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = allPasswords;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('All passwords copied to clipboard!', 'success');
    });
}

// Download passwords as text file
function downloadPasswords() {
    const content = generatedPasswords.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'generated_passwords.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('Passwords downloaded successfully!', 'success');
}

// Analyze password strength
function analyzePassword(password) {
    const strengthMeter = document.getElementById('strengthMeter');
    const strengthBar = document.getElementById('strengthBar');
    const strengthsList = document.getElementById('strengthsList');
    const suggestionsList = document.getElementById('suggestionsList');
    
    // Calculate strength score
    let score = 0;
    const strengths = [];
    const suggestions = [];
    
    // Length analysis
    if (password.length >= 8) {
        score += 20;
        strengths.push('Good length (8+ characters)');
    } else {
        suggestions.push('Increase password length to at least 8 characters');
    }
    
    if (password.length >= 12) {
        score += 20;
        strengths.push('Excellent length (12+ characters)');
    }
    
    if (password.length >= 16) {
        score += 20;
        strengths.push('Exceptional length (16+ characters)');
    }
    
    // Character variety analysis
    if (/[A-Z]/.test(password)) {
        score += 15;
        strengths.push('Contains uppercase letters');
    } else {
        suggestions.push('Add uppercase letters (A-Z)');
    }
    
    if (/[a-z]/.test(password)) {
        score += 15;
        strengths.push('Contains lowercase letters');
    } else {
        suggestions.push('Add lowercase letters (a-z)');
    }
    
    if (/[0-9]/.test(password)) {
        score += 15;
        strengths.push('Contains numbers');
    } else {
        suggestions.push('Add numbers (0-9)');
    }
    
    if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
        score += 15;
        strengths.push('Contains special characters');
    } else {
        suggestions.push('Add special characters (!@#$%^&*)');
    }
    
    // Pattern analysis
    if (/(.)\1{2,}/.test(password)) {
        score -= 10;
        suggestions.push('Avoid repeated characters');
    }
    
    if (/123|abc|qwe|password|admin/i.test(password)) {
        score -= 20;
        suggestions.push('Avoid common patterns and words');
    }
    
    // Ensure score is within bounds
    score = Math.max(0, Math.min(100, score));
    
    // Update strength bar
    strengthBar.style.width = score + '%';
    strengthBar.className = `progress-bar ${getStrengthBarClass(score)}`;
    
    // Update lists
    strengthsList.innerHTML = strengths.map(s => `<li class="text-success"><i class="fas fa-check me-2"></i>${s}</li>`).join('');
    suggestionsList.innerHTML = suggestions.map(s => `<li class="text-warning"><i class="fas fa-exclamation-triangle me-2"></i>${s}</li>`).join('');
    
    // Show strength meter
    strengthMeter.style.display = 'block';
}

// Get strength bar class
function getStrengthBarClass(score) {
    if (score < 40) return 'bg-danger';
    if (score < 60) return 'bg-warning';
    if (score < 80) return 'bg-info';
    return 'bg-success';
}

// Clear results
function clearResults() {
    generatedPasswords = [];
    currentEntropy = 0;
    
    document.getElementById('passwordsSection').style.display = 'none';
    document.getElementById('strengthMeter').style.display = 'none';
    document.getElementById('copyAllBtn').disabled = true;
    
    showNotification('Results cleared successfully!', 'info');
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'Enter':
                e.preventDefault();
                generatePasswords();
                break;
            case 'c':
                if (!document.getElementById('copyAllBtn').disabled) {
                    e.preventDefault();
                    copyAllPasswords();
                }
                break;
        }
    }
});

// Initialize tool
document.addEventListener('DOMContentLoaded', function() {
    // Set initial values
    updateLengthValue();
    
    // Show welcome message
    showNotification('Welcome to Password Generator! Configure your options and click Generate to create secure passwords.', 'info');
    
    // Add event listeners for strength level changes
    document.getElementById('passwordStrength').addEventListener('change', function() {
        const strength = this.value;
        const lengthSlider = document.getElementById('passwordLength');
        
        switch(strength) {
            case 'weak':
                lengthSlider.value = 10;
                break;
            case 'medium':
                lengthSlider.value = 16;
                break;
            case 'strong':
                lengthSlider.value = 18;
                break;
            case 'very-strong':
                lengthSlider.value = 24;
                break;
        }
        
        updateLengthValue();
    });
});
