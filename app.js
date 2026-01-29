// ===========================
// DISASTER PREPAREDNESS HUB
// Main Application Logic
// ===========================

// Configuration
const CONFIG = {
    platforms: [
        { id: 'facebook', name: 'Facebook', icon: '📘' },
        { id: 'twitter', name: 'Twitter/X', icon: '𝕏' },
        { id: 'instagram', name: 'Instagram', icon: '📷' },
        { id: 'tiktok', name: 'TikTok', icon: '🎵' },
        { id: 'youtube', name: 'YouTube', icon: '▶️' },
        { id: 'telegram', name: 'Telegram', icon: '✈️' },
        { id: 'whatsapp', name: 'WhatsApp', icon: '💬' },
        { id: 'discord', name: 'Discord', icon: '🎮' }
    ],
    storageKeys: {
        userData: 'dph_user_data',
        votes: 'dph_votes',
        messages: 'dph_messages'
    }
};

// State Management
const state = {
    currentUser: null,
    votes: new Map(),
    messages: [],
    currentPage: 'voting'
};

// ===========================
// INITIALIZATION
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚨 Disaster Preparedness Hub Initializing...');
    
    // Load stored data
    loadStoredData();
    
    // Show welcome screen
    showWelcomeScreen();
    
    // Initialize event listeners
    initializeEventListeners();
    
    console.log('✅ Initialization complete');
});

function initializeEventListeners() {
    // Enter key for chat
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
}

// ===========================
// SCREEN TRANSITIONS
// ===========================

function showWelcomeScreen() {
    hideAllScreens();
    const welcomeScreen = document.getElementById('welcomeScreen');
    if (welcomeScreen) {
        welcomeScreen.classList.add('active');
    }
}

function showAuthScreen() {
    hideAllScreens();
    const authScreen = document.getElementById('authScreen');
    if (authScreen) {
        authScreen.classList.add('active');
    }
}

function showAppContainer() {
    hideAllScreens();
    const appContainer = document.getElementById('appContainer');
    if (appContainer) {
        appContainer.classList.add('active');
        renderPlatforms();
        renderChat();
        updateStats();
        updateResults();
    }
}

function hideAllScreens() {
    document.querySelectorAll('.welcome-screen, .auth-screen, .app-container')
        .forEach(screen => screen.classList.remove('active'));
}

// ===========================
// AUTHENTICATION
// ===========================

function handleLogin(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('nameInput');
    const sectionInput = document.getElementById('sectionInput');
    const comsaiCheckbox = document.getElementById('comsaiCheckbox');
    
    if (!nameInput.value.trim()) {
        showToast('Please enter your name', 'error');
        return;
    }
    
    if (!sectionInput.value) {
        showToast('Please select your section', 'error');
        return;
    }
    
    const userData = {
        name: nameInput.value.trim(),
        section: sectionInput.value,
        isComsai: comsaiCheckbox.checked,
        loginTime: new Date().toISOString()
    };
    
    loginUser(userData);
}

function loginAsGuest() {
    const userData = {
        name: 'Guest',
        section: 'Guest',
        isComsai: false,
        loginTime: new Date().toISOString()
    };
    
    loginUser(userData);
}

function loginUser(userData) {
    state.currentUser = userData;
    localStorage.setItem(CONFIG.storageKeys.userData, JSON.stringify(userData));
    
    // Update UI
    document.getElementById('userName').textContent = userData.name;
    document.getElementById('userSection').textContent = userData.section;
    
    showToast(`Welcome, ${userData.name}!`, 'success');
    showAppContainer();
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        state.currentUser = null;
        localStorage.removeItem(CONFIG.storageKeys.userData);
        showWelcomeScreen();
        showToast('Logged out successfully', 'success');
    }
}

// ===========================
// NAVIGATION
// ===========================

function navigateTo(pageName) {
    state.currentPage = pageName;
    
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === pageName) {
            btn.classList.add('active');
        }
    });
    
    // Update content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const activeSection = document.getElementById(`${pageName}Section`);
    if (activeSection) {
        activeSection.classList.add('active');
    }
    
    // Update header
    updateHeader(pageName);
    
    // Update data if needed
    if (pageName === 'results') {
        updateResults();
    }
}

function updateHeader(pageName) {
    const titles = {
        voting: {
            title: 'Building Disaster Preparedness',
            subtitle: 'Vote on the most effective social media platforms'
        },
        results: {
            title: 'Live Results & Statistics',
            subtitle: 'Real-time voting data from all participants'
        },
        guidelines: {
            title: 'Participation Guidelines',
            subtitle: 'How to contribute to this case study'
        },
        about: {
            title: 'About This Project',
            subtitle: 'Science, Technology & Society Research'
        }
    };
    
    const config = titles[pageName] || titles.voting;
    document.getElementById('pageTitle').textContent = config.title;
    document.getElementById('pageSubtitle').textContent = config.subtitle;
}

// ===========================
// VOTING SYSTEM
// ===========================

function renderPlatforms() {
    const container = document.getElementById('platformsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    CONFIG.platforms.forEach(platform => {
        const isVoted = state.votes.has(platform.id);
        const voteCount = getVoteCount(platform.id);
        const percentage = calculatePercentage(voteCount);
        
        const card = document.createElement('div');
        card.className = `platform-card ${isVoted ? 'voted' : ''}`;
        card.onclick = () => toggleVote(platform.id);
        
        card.innerHTML = `
            <div class="platform-checkbox"></div>
            <div class="platform-info">
                <div class="platform-name">${platform.icon} ${platform.name}</div>
                <div class="platform-votes">${voteCount} ${voteCount === 1 ? 'vote' : 'votes'}</div>
                <div class="platform-bar">
                    <div class="platform-bar-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

function toggleVote(platformId) {
    if (!state.currentUser) {
        showToast('Please login first', 'error');
        return;
    }
    
    if (state.votes.has(platformId)) {
        state.votes.delete(platformId);
        showToast('Vote removed', 'success');
    } else {
        state.votes.set(platformId, {
            userId: state.currentUser.name,
            timestamp: new Date().toISOString()
        });
        showToast('Vote recorded!', 'success');
    }
    
    saveVotes();
    renderPlatforms();
    updateStats();
    updateResults();
}

function getVoteCount(platformId) {
    const allVotes = getAllVotes();
    return allVotes.filter(v => v.platformId === platformId).length;
}

function getAllVotes() {
    const stored = localStorage.getItem(CONFIG.storageKeys.votes);
    return stored ? JSON.parse(stored) : [];
}

function saveVotes() {
    const allVotes = getAllVotes();
    
    // Remove user's previous votes
    const filteredVotes = allVotes.filter(v => v.userId !== state.currentUser.name);
    
    // Add current votes
    state.votes.forEach((voteData, platformId) => {
        filteredVotes.push({
            platformId,
            userId: voteData.userId,
            timestamp: voteData.timestamp
        });
    });
    
    localStorage.setItem(CONFIG.storageKeys.votes, JSON.stringify(filteredVotes));
}

function calculatePercentage(voteCount) {
    const total = getTotalVotes();
    return total > 0 ? Math.round((voteCount / total) * 100) : 0;
}

function getTotalVotes() {
    return getAllVotes().length;
}

function getUniqueVoters() {
    const allVotes = getAllVotes();
    const uniqueUsers = new Set(allVotes.map(v => v.userId));
    return uniqueUsers.size;
}

// ===========================
// STATISTICS
// ===========================

function updateStats() {
    const myVotes = state.votes.size;
    const totalVotes = getTotalVotes();
    const participants = getUniqueVoters();
    const messages = state.messages.length;
    
    updateStatElement('myVoteCount', myVotes);
    updateStatElement('totalVoteCount', totalVotes);
    updateStatElement('participantCount', participants);
    updateStatElement('messageCount', messages);
}

function updateStatElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        // Animate number change
        const currentValue = parseInt(element.textContent) || 0;
        if (currentValue !== value) {
            animateValue(element, currentValue, value, 500);
        }
    }
}

function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.round(current);
    }, 16);
}

// ===========================
// RESULTS
// ===========================

function updateResults() {
    const container = document.getElementById('resultsList');
    if (!container) return;
    
    // Calculate results
    const results = CONFIG.platforms.map(platform => {
        const voteCount = getVoteCount(platform.id);
        const percentage = calculatePercentage(voteCount);
        return {
            ...platform,
            voteCount,
            percentage
        };
    });
    
    // Sort by votes
    results.sort((a, b) => b.voteCount - a.voteCount);
    
    // Render
    container.innerHTML = '';
    results.forEach((platform, index) => {
        const card = document.createElement('div');
        card.className = 'result-card';
        card.style.animationDelay = `${index * 0.05}s`;
        
        card.innerHTML = `
            <div class="result-header">
                <div class="result-name">${platform.icon} ${platform.name}</div>
                <div class="result-percentage">${platform.percentage}%</div>
            </div>
            <div class="result-bar">
                <div class="result-bar-fill" style="width: ${platform.percentage}%"></div>
            </div>
            <div class="result-votes">${platform.voteCount} ${platform.voteCount === 1 ? 'vote' : 'votes'}</div>
        `;
        
        container.appendChild(card);
    });
}

// ===========================
// CHAT SYSTEM
// ===========================

function renderChat() {
    const container = document.getElementById('chatMessages');
    if (!container) return;
    
    if (state.messages.length === 0) {
        container.innerHTML = `
            <div class="chat-empty">
                <span class="empty-icon">💭</span>
                <p>No messages yet.<br>Start the conversation!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    state.messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message';
        
        const content = linkify(escapeHtml(message.content));
        
        messageDiv.innerHTML = `
            <div class="message-user">${escapeHtml(message.userName)}</div>
            <div class="message-content">${content}</div>
            <div class="message-time">${formatTime(message.timestamp)}</div>
        `;
        
        container.appendChild(messageDiv);
    });
    
    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    if (!input) return;
    
    const content = input.value.trim();
    
    if (!content) {
        showToast('Please enter a message', 'error');
        return;
    }
    
    if (!state.currentUser) {
        showToast('Please login first', 'error');
        return;
    }
    
    if (content.length > 200) {
        showToast('Message too long (max 200 characters)', 'error');
        return;
    }
    
    const message = {
        id: Date.now(),
        userName: state.currentUser.name,
        content: content,
        timestamp: new Date().toISOString()
    };
    
    state.messages.push(message);
    saveMessages();
    renderChat();
    updateStats();
    
    // Clear input
    input.value = '';
    
    showToast('Message sent!', 'success');
}

function saveMessages() {
    localStorage.setItem(CONFIG.storageKeys.messages, JSON.stringify(state.messages));
}

// ===========================
// UTILITIES
// ===========================

function loadStoredData() {
    // Load user data
    const storedUser = localStorage.getItem(CONFIG.storageKeys.userData);
    if (storedUser) {
        try {
            state.currentUser = JSON.parse(storedUser);
        } catch (e) {
            console.error('Error loading user data:', e);
        }
    }
    
    // Load votes
    const allVotes = getAllVotes();
    if (state.currentUser) {
        const userVotes = allVotes.filter(v => v.userId === state.currentUser.name);
        userVotes.forEach(vote => {
            state.votes.set(vote.platformId, {
                userId: vote.userId,
                timestamp: vote.timestamp
            });
        });
    }
    
    // Load messages
    const storedMessages = localStorage.getItem(CONFIG.storageKeys.messages);
    if (storedMessages) {
        try {
            state.messages = JSON.parse(storedMessages);
        } catch (e) {
            console.error('Error loading messages:', e);
            state.messages = [];
        }
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function linkify(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// ===========================
// GLOBAL ERROR HANDLING
// ===========================

window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    showToast('An error occurred. Please refresh the page.', 'error');
});

// ===========================
// EXPORT FOR GLOBAL ACCESS
// ===========================

window.showAuthScreen = showAuthScreen;
window.handleLogin = handleLogin;
window.loginAsGuest = loginAsGuest;
window.logout = logout;
window.navigateTo = navigateTo;
window.sendMessage = sendMessage;

console.log('🚀 Application loaded successfully');