// Age Calculator Tool
let currentAge = null;
let nextBirthday = null;
let countdownInterval = null;

// Calculate age when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Set default dates
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Set target date to today by default
    document.getElementById('targetDate').value = todayStr;
    
    // Set birth date to 25 years ago as example
    const exampleBirthDate = new Date();
    exampleBirthDate.setFullYear(today.getFullYear() - 25);
    document.getElementById('birthDate').value = exampleBirthDate.toISOString().split('T')[0];
    
    // Calculate initial age
    calculateAge();
    
    // Show welcome message
    showNotification('Welcome to Age Calculator! Your age has been calculated automatically.', 'info');
});

// Main age calculation function
function calculateAge() {
    const birthDateInput = document.getElementById('birthDate');
    const targetDateInput = document.getElementById('targetDate');
    
    if (!birthDateInput.value) {
        showNotification('Please select a birth date!', 'error');
        return;
    }
    
    const birthDate = new Date(birthDateInput.value);
    const targetDate = targetDateInput.value ? new Date(targetDateInput.value) : new Date();
    
    // Validate dates
    if (birthDate > targetDate) {
        showNotification('Birth date cannot be in the future!', 'error');
        return;
    }
    
    // Calculate age
    currentAge = calculateAgeDifference(birthDate, targetDate);
    nextBirthday = calculateNextBirthday(birthDate, targetDate);
    
    // Display results
    displayAgeResults();
    
    // Start countdown if next birthday is enabled
    if (document.getElementById('showNextBirthday').checked && nextBirthday) {
        startBirthdayCountdown();
    }
    
    // Show success message
    showNotification('Age calculated successfully!', 'success');
}

// Calculate age difference between two dates
function calculateAgeDifference(birthDate, targetDate) {
    const diffTime = targetDate.getTime() - birthDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate years, months, and days
    let years = targetDate.getFullYear() - birthDate.getFullYear();
    let months = targetDate.getMonth() - birthDate.getMonth();
    let days = targetDate.getDate() - birthDate.getDate();
    
    // Adjust for negative months or days
    if (days < 0) {
        months--;
        const lastMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
        days += lastMonth.getDate();
    }
    
    if (months < 0) {
        years--;
        months += 12;
    }
    
    // Calculate total values
    const totalMonths = years * 12 + months;
    const totalWeeks = Math.floor(diffDays / 7);
    const totalHours = diffDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;
    
    return {
        years: years,
        months: months,
        days: days,
        totalDays: diffDays,
        totalWeeks: totalWeeks,
        totalMonths: totalMonths,
        totalHours: totalHours,
        totalMinutes: totalMinutes,
        totalSeconds: totalSeconds
    };
}

// Calculate next birthday
function calculateNextBirthday(birthDate, targetDate) {
    const currentYear = targetDate.getFullYear();
    const nextBirthdayDate = new Date(birthDate);
    nextBirthdayDate.setFullYear(currentYear);
    
    // If birthday has passed this year, set to next year
    if (nextBirthdayDate < targetDate) {
        nextBirthdayDate.setFullYear(currentYear + 1);
    }
    
    return nextBirthdayDate;
}

// Display age results
function displayAgeResults() {
    if (!currentAge) return;
    
    // Update main results
    document.getElementById('yearsResult').textContent = currentAge.years;
    document.getElementById('monthsResult').textContent = currentAge.months;
    document.getElementById('daysResult').textContent = currentAge.days;
    
    // Update detailed breakdown
    document.getElementById('totalDays').textContent = currentAge.totalDays.toLocaleString();
    document.getElementById('totalWeeks').textContent = currentAge.totalWeeks.toLocaleString();
    document.getElementById('totalMonths').textContent = currentAge.totalMonths.toLocaleString();
    document.getElementById('totalHours').textContent = currentAge.totalHours.toLocaleString();
    document.getElementById('totalMinutes').textContent = currentAge.totalMinutes.toLocaleString();
    document.getElementById('totalSeconds').textContent = currentAge.totalSeconds.toLocaleString();
    
    // Show/hide sections based on options
    const showMonths = document.getElementById('showMonths').checked;
    const showHours = document.getElementById('showHours').checked;
    const showWeeks = document.getElementById('showWeeks').checked;
    const showNextBirthday = document.getElementById('showNextBirthday').checked;
    
    // Update detailed breakdown visibility
    const detailedBreakdown = document.getElementById('detailedBreakdown');
    detailedBreakdown.style.display = (showMonths || showHours || showWeeks) ? 'block' : 'none';
    
    // Update next birthday section
    const nextBirthdaySection = document.getElementById('nextBirthdaySection');
    if (showNextBirthday && nextBirthday) {
        nextBirthdaySection.style.display = 'block';
        updateNextBirthdayDisplay();
    } else {
        nextBirthdaySection.style.display = 'none';
    }
    
    // Generate fun facts
    generateFunFacts();
    
    // Show results
    document.getElementById('ageResults').style.display = 'block';
}

// Update next birthday countdown display
function updateNextBirthdayDisplay() {
    if (!nextBirthday) return;
    
    const now = new Date();
    const timeDiff = nextBirthday.getTime() - now.getTime();
    
    if (timeDiff <= 0) {
        // Birthday is today
        document.getElementById('nextBirthdayDays').textContent = '0';
        document.getElementById('nextBirthdayHours').textContent = '0';
        document.getElementById('nextBirthdayMinutes').textContent = '0';
        document.getElementById('nextBirthdaySeconds').textContent = '0';
        document.getElementById('nextBirthdayDate').textContent = 'Today! 🎉';
        return;
    }
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    document.getElementById('nextBirthdayDays').textContent = days;
    document.getElementById('nextBirthdayHours').textContent = hours;
    document.getElementById('nextBirthdayMinutes').textContent = minutes;
    document.getElementById('nextBirthdaySeconds').textContent = seconds;
    document.getElementById('nextBirthdayDate').textContent = nextBirthday.toLocaleDateString();
}

// Start birthday countdown timer
function startBirthdayCountdown() {
    // Clear existing interval
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    // Update every second
    countdownInterval = setInterval(updateNextBirthdayDisplay, 1000);
}

// Generate fun facts based on age
function generateFunFacts() {
    const age = currentAge.years;
    const milestones = [];
    const stats = [];
    
    // Milestones
    if (age >= 18) milestones.push('✅ You can vote and drive!');
    if (age >= 21) milestones.push('✅ You can legally drink in most countries!');
    if (age >= 25) milestones.push('✅ Your brain is fully developed!');
    if (age >= 30) milestones.push('✅ You\'re in your prime!');
    if (age >= 40) milestones.push('✅ You\'re wiser and more experienced!');
    if (age >= 50) milestones.push('✅ You\'re a seasoned professional!');
    if (age >= 65) milestones.push('✅ You can retire and enjoy life!');
    
    // Add upcoming milestones
    if (age < 18) milestones.push('🎯 Next milestone: Turning 18 (in ' + (18 - age) + ' years)');
    if (age < 21) milestones.push('🎯 Next milestone: Turning 21 (in ' + (21 - age) + ' years)');
    if (age < 25) milestones.push('🎯 Next milestone: Brain fully developed (in ' + (25 - age) + ' years)');
    
    // Stats
    const heartbeats = Math.floor(currentAge.totalDays * 24 * 60 * 80); // Average 80 BPM
    const breaths = Math.floor(currentAge.totalDays * 24 * 60 * 16); // Average 16 breaths per minute
    const blinks = Math.floor(currentAge.totalDays * 24 * 60 * 20); // Average 20 blinks per minute
    
    stats.push(`💓 Your heart has beaten ~${heartbeats.toLocaleString()} times`);
    stats.push(`🫁 You've taken ~${breaths.toLocaleString()} breaths`);
    stats.push(`👁️ You've blinked ~${blinks.toLocaleString()} times`);
    
    // Display milestones
    const milestonesList = document.getElementById('milestone1');
    const milestone2 = document.getElementById('milestone2');
    const milestone3 = document.getElementById('milestone3');
    
    if (milestones.length > 0) milestonesList.textContent = milestones[0];
    if (milestones.length > 1) milestone2.textContent = milestones[1];
    if (milestones.length > 2) milestone3.textContent = milestones[2];
    
    // Display stats
    const stat1 = document.getElementById('stat1');
    const stat2 = document.getElementById('stat2');
    const stat3 = document.getElementById('stat3');
    
    if (stats.length > 0) stat1.textContent = stats[0];
    if (stats.length > 1) stat2.textContent = stats[1];
    if (stats.length > 2) stat3.textContent = stats[2];
}

// Set target date to today
function setToday() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    document.getElementById('targetDate').value = todayStr;
    calculateAge();
}

// Reset calculator
function resetCalculator() {
    // Clear dates
    document.getElementById('birthDate').value = '';
    document.getElementById('targetDate').value = '';
    
    // Hide results
    document.getElementById('ageResults').style.display = 'none';
    
    // Clear countdown
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
    
    // Reset variables
    currentAge = null;
    nextBirthday = null;
    
    showNotification('Calculator reset successfully!', 'info');
}

// Copy results to clipboard
function copyResults() {
    if (!currentAge) return;
    
    const results = `Age: ${currentAge.years} years, ${currentAge.months} months, ${currentAge.days} days
Total Days: ${currentAge.totalDays.toLocaleString()}
Total Weeks: ${currentAge.totalWeeks.toLocaleString()}
Total Months: ${currentAge.totalMonths.toLocaleString()}
Total Hours: ${currentAge.totalHours.toLocaleString()}
Total Minutes: ${currentAge.totalMinutes.toLocaleString()}
Total Seconds: ${currentAge.totalSeconds.toLocaleString()}`;
    
    navigator.clipboard.writeText(results).then(() => {
        showNotification('Results copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = results;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Results copied to clipboard!', 'success');
    });
}

// Download results as text file
function downloadResults() {
    if (!currentAge) return;
    
    const content = `Age Calculator Results
====================

Birth Date: ${document.getElementById('birthDate').value}
Target Date: ${document.getElementById('targetDate').value || 'Today'}

Age: ${currentAge.years} years, ${currentAge.months} months, ${currentAge.days} days

Detailed Breakdown:
- Total Days: ${currentAge.totalDays.toLocaleString()}
- Total Weeks: ${currentAge.totalWeeks.toLocaleString()}
- Total Months: ${currentAge.totalMonths.toLocaleString()}
- Total Hours: ${currentAge.totalHours.toLocaleString()}
- Total Minutes: ${currentAge.totalMinutes.toLocaleString()}
- Total Seconds: ${currentAge.totalSeconds.toLocaleString()}

Generated on: ${new Date().toLocaleString()}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'age_calculation_results.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('Results downloaded successfully!', 'success');
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
                calculateAge();
                break;
            case 't':
                e.preventDefault();
                setToday();
                break;
            case 'r':
                e.preventDefault();
                resetCalculator();
                break;
        }
    }
});

// Handle option changes
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for option changes
    const options = ['showMonths', 'showHours', 'showWeeks', 'showNextBirthday'];
    options.forEach(optionId => {
        const element = document.getElementById(optionId);
        if (element) {
            element.addEventListener('change', function() {
                if (currentAge) {
                    displayAgeResults();
                }
            });
        }
    });
});
