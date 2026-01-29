// ===========================
// AUTHENTICATION LOGIC
// ===========================

/**
 * Handle login form submission
 */
function handleLogin(event) {
    event.preventDefault();
    login();
}

/**
 * Login user with credentials
 */
function login() {
    const nameInput = document.getElementById('nameInput');
    const sectionInput = document.getElementById('sectionInput');
    const comsaiCheckbox = document.getElementById('comsaiCheckbox');

    const name = nameInput.value.trim();
    const section = sectionInput.value;
    const isComsai = comsaiCheckbox.checked;

    // Validation
    if (!name || !section) {
        showToast(CONFIG.MESSAGES.LOGIN_REQUIRED, 'error');
        log('Login validation failed', 'warn');
        return;
    }

    if (name.length < CONFIG.LIMITS.NAME_MIN_LENGTH) {
        showToast('Name must be at least 2 characters', 'error');
        return;
    }

    if (name.length > CONFIG.LIMITS.NAME_MAX_LENGTH) {
        showToast('Name must be less than 50 characters', 'error');
        return;
    }

    // Create user object
    APP_STATE.currentUser = {
        id: generateUserId(),
        name: name,
        section: section,
        isComsai: isComsai,
        loginTime: new Date()
    };

    // Add user to global users set
    APP_STATE.allUsers.add(name);

    // Log successful login
    log(`User logged in: ${name} (${section})`, 'info');
    
    // Show app
    showApp();
    
    // Show success message
    showToast(CONFIG.MESSAGES.LOGIN_SUCCESS, 'success');
}

/**
 * Login as guest
 */
function loginAsGuest() {
    APP_STATE.currentUser = {
        id: generateUserId(),
        name: 'Guest User',
        section: 'Guest',
        isComsai: false,
        loginTime: new Date()
    };

    APP_STATE.allUsers.add('Guest User');

    log('Guest login', 'info');
    showApp();
    showToast('👋 Welcome, Guest!', 'info');
}

/**
 * Logout current user
 */
function logout() {
    if (!confirm('Are you sure you want to logout?')) {
        return;
    }

    const userName = APP_STATE.currentUser.name;
    
    // Reset state
    APP_STATE.currentUser = null;
    APP_STATE.userVotes.clear();
    
    // Clear form inputs
    document.getElementById('nameInput').value = '';
    document.getElementById('sectionInput').value = '';
    document.getElementById('comsaiCheckbox').checked = false;
    
    // Show auth screen
    document.getElementById('authScreen').classList.remove('hidden');
    document.getElementById('appContainer').classList.add('hidden');
    
    log(`User logged out: ${userName}`, 'info');
    showToast(CONFIG.MESSAGES.LOGOUT_SUCCESS, 'success');
}

/**
 * Show main app interface
 */
function showApp() {
    document.getElementById('authScreen').classList.add('hidden');
    document.getElementById('appContainer').classList.remove('hidden');
    
    updateUserInfo();
    renderPlatforms();
    loadInitialMessages();
}

/**
 * Update user info in sidebar
 */
function updateUserInfo() {
    if (!APP_STATE.currentUser) return;

    const displayName = document.getElementById('userDisplayName');
    const userSection = document.getElementById('userSection');
    const userBadge = document.getElementById('userBadge');

    displayName.textContent = APP_STATE.currentUser.name;
    userSection.textContent = APP_STATE.currentUser.section !== 'Guest' 
        ? APP_STATE.currentUser.section 
        : 'Guest Mode';

    if (APP_STATE.currentUser.isComsai) {
        userBadge.textContent = '✓ CoMSai Student';
        userBadge.style.background = 'var(--success)';
    } else if (APP_STATE.currentUser.section === 'Guest') {
        userBadge.textContent = 'Guest Mode';
        userBadge.style.background = 'var(--secondary)';
    } else {
        userBadge.textContent = 'CS Student';
        userBadge.style.background = 'var(--accent)';
    }
}

/**
 * Generate unique user ID
 */
function generateUserId() {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}