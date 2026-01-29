// ===========================
// APPLICATION CONFIGURATION
// ===========================

const CONFIG = {
    // Application
    APP_NAME: 'Disaster Preparedness STS Hub',
    APP_VERSION: '1.0.0',
    
    // Platforms
    PLATFORMS: [
        { id: 1, name: 'Facebook', emoji: '👍', color: '#1877F2' },
        { id: 2, name: 'YouTube', emoji: '📹', color: '#FF0000' },
        { id: 3, name: 'X (Twitter)', emoji: '𝕏', color: '#000000' },
        { id: 4, name: 'TikTok', emoji: '🎵', color: '#25F4EE' },
        { id: 5, name: 'Instagram', emoji: '📷', color: '#E4405F' },
        { id: 6, name: 'Threads', emoji: '🧵', color: '#000000' }
    ],
    
    // Sections
    SECTIONS: [
        { value: 'CS251', label: 'CS251' },
        { value: 'CS252', label: 'CS252' },
        { value: 'CS253', label: 'CS253' },
        { value: 'CS254', label: 'CS254' }
    ],
    
    // Messages
    MESSAGES: {
        LOGIN_REQUIRED: 'Please fill in all required fields',
        LOGIN_SUCCESS: '✓ Login successful!',
        LOGOUT_SUCCESS: 'Logged out successfully',
        VOTE_ADDED: '✓ Vote added',
        VOTE_REMOVED: '✓ Vote removed',
        MESSAGE_SENT: 'Message sent!',
        MESSAGE_ERROR: 'Failed to send message',
        CHAT_CLEARED: 'Chat cleared',
        SECTION_REQUIRED: 'Please select a section'
    },
    
    // Limits
    LIMITS: {
        MESSAGE_MAX_LENGTH: 200,
        NAME_MIN_LENGTH: 2,
        NAME_MAX_LENGTH: 50
    },
    
    // Timeouts
    TIMEOUTS: {
        TOAST: 2000,
        ANIMATION: 300
    }
};

// Application State
const APP_STATE = {
    currentUser: null,
    userVotes: new Set(),
    allVotes: {},
    allUsers: new Set(),
    messages: [],
    currentPage: 'voting'
};

// Initialize votes object
function initializeVotes() {
    CONFIG.PLATFORMS.forEach(platform => {
        APP_STATE.allVotes[platform.id] = 0;
    });
}

// Initialize app state
initializeVotes();

// Utility: Get platform by ID
function getPlatformById(id) {
    return CONFIG.PLATFORMS.find(p => p.id === id);
}

// Utility: Get platform name
function getPlatformName(id) {
    const platform = getPlatformById(id);
    return platform ? platform.name : 'Unknown';
}

// Utility: Log to console with prefix
function log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] [${type.toUpperCase()}] ${message}`);
}