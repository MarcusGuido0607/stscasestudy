// ===========================
// UI UTILITIES
// ===========================

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);

    // Auto-remove after timeout
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => {
            toast.remove();
        }, CONFIG.TIMEOUTS.ANIMATION);
    }, CONFIG.TIMEOUTS.TOAST);

    log(`Toast: ${message}`, 'info');
}

/**
 * Show voting page
 */
function showVoting() {
    APP_STATE.currentPage = 'voting';
    
    document.getElementById('resultsPanel').style.display = 'none';
    document.getElementById('votingTitle').textContent = '🗳️ Rank Social Media Platforms';
    document.getElementById('pageTitle').textContent = 'Building Disaster Preparedness Through Social Media';
    document.getElementById('pageSubtitle').textContent = 'Vote on the most effective social media platforms for disaster preparedness';
    
    updateActiveNav('voting');
    renderPlatforms();
    log('Switched to voting page', 'info');
}

/**
 * Show results page
 */
function showResults() {
    APP_STATE.currentPage = 'results';
    
    document.getElementById('resultsPanel').style.display = 'block';
    document.getElementById('votingTitle').textContent = '📈 Results Overview';
    document.getElementById('pageTitle').textContent = 'Voting Results';
    document.getElementById('pageSubtitle').textContent = 'Real-time statistics of platform preferences';
    
    updateActiveNav('results');
    updateResults();
    log('Switched to results page', 'info');
}

/**
 * Show guidelines page
 */
function showGuidelines() {
    APP_STATE.currentPage = 'guidelines';
    updateActiveNav('guidelines');
    
    alert(`📋 GUIDELINES FOR DISASTER PREPAREDNESS

Vote for platforms that are:
✓ Most accessible to the community
✓ Best for real-time updates
✓ Most effective for warning systems
✓ Strongest for community engagement
✓ Have good coverage in your area

💡 TIPS FOR DISASTER PREPAREDNESS:
• Follow official government accounts
• Check information accuracy before sharing
• Create family communication plans
• Prepare emergency supplies
• Know evacuation routes
• Share resources in the chat below
• Help spread awareness in your community

🔗 Feel free to share helpful links and resources in the community chat!`);
    
    log('Viewed guidelines', 'info');
}

/**
 * Show about page
 */
function showAbout() {
    APP_STATE.currentPage = 'about';
    updateActiveNav('about');
    
    alert(`ℹ️ ABOUT THIS CASE STUDY

Title: Building Disaster Preparedness Through Social Media
An STS Case Study by NU Cebu CS Students

Objective:
This platform aims to understand how different social media platforms 
can be leveraged for disaster preparedness and community resilience.

Participants:
✓ NU Cebu CS Students (Sections: CS251, CS252, CS253, CS254)
✓ CoMSai Students
✓ Guest Participants

Features:
• Vote on preferred disaster alert platforms
• Real-time polling results
• Community discussion and resource sharing
• Easy-to-use interface

Learn how social media can connect communities during emergencies 
and save lives through timely information dissemination.

For more information, contact the research team.`);
    
    log('Viewed about', 'info');
}

/**
 * Update active navigation item
 */
function updateActiveNav(pageName) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Add active class to clicked nav item
    const activeItem = document.querySelector(`[data-page="${pageName}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

/**
 * Format large numbers with commas
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Get current time string
 */
function getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Show loading state
 */
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.opacity = '0.5';
        element.style.pointerEvents = 'none';
    }
}

/**
 * Hide loading state
 */
function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.opacity = '1';
        element.style.pointerEvents = 'auto';
    }
}

/**
 * Get user color based on role
 */
function getUserColor(user) {
    if (user.isComsai) {
        return 'var(--success)';
    } else if (user.section === 'Guest') {
        return 'var(--secondary)';
    } else {
        return 'var(--primary)';
    }
}

/**
 * Initialize keyboard shortcuts
 */
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Enter to send message
        if (e.target.id === 'chatInput' && e.key === 'Enter') {
            sendMessage();
        }

        // Alt+V for voting
        if (e.altKey && e.key === 'v') {
            e.preventDefault();
            showVoting();
        }

        // Alt+R for results
        if (e.altKey && e.key === 'r') {
            e.preventDefault();
            showResults();
        }

        // Alt+G for guidelines
        if (e.altKey && e.key === 'g') {
            e.preventDefault();
            showGuidelines();
        }
    });

    log('Keyboard shortcuts initialized', 'debug');
}

/**
 * Get browser info
 */
function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = 'Unknown';

    if (ua.indexOf('Firefox') > -1) browser = 'Firefox';
    else if (ua.indexOf('Chrome') > -1) browser = 'Chrome';
    else if (ua.indexOf('Safari') > -1) browser = 'Safari';
    else if (ua.indexOf('Edge') > -1) browser = 'Edge';

    return {
        browser: browser,
        platform: navigator.platform,
        language: navigator.language
    };
}