// ===========================
// CHAT LOGIC
// ===========================

/**
 * Send a message to chat
 */
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    // Validation
    if (!message) return;

    if (message.length > CONFIG.LIMITS.MESSAGE_MAX_LENGTH) {
        showToast('Message is too long', 'error');
        return;
    }

    // Create message object
    const newMessage = {
        id: generateMessageId(),
        user: APP_STATE.currentUser.name,
        userId: APP_STATE.currentUser.id,
        content: message,
        timestamp: new Date(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Add to messages
    APP_STATE.messages.push(newMessage);

    // Save to localStorage (persistent)
    saveMessagesToStorage();

    // Clear input
    input.value = '';

    // Render messages
    renderMessages();

    // Update message count
    document.getElementById('messageCount').textContent = APP_STATE.messages.length;

    // Scroll to bottom
    scrollToBottom();

    // Log message
    log(`Message sent by ${APP_STATE.currentUser.name}`, 'info');
}

/**
 * Render all messages
 */
function renderMessages() {
    const container = document.getElementById('chatMessages');
    
    if (APP_STATE.messages.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">💬</div>
                <p>No messages yet. Be the first to share!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = APP_STATE.messages.map(msg => `
        <div class="chat-message ${msg.isSystemMessage ? 'system-message' : ''}">
            <div class="message-user">${escapeHtml(msg.user)}</div>
            <div class="message-content">${formatMessageContent(msg.content)}</div>
            <div class="message-time">${msg.time}</div>
        </div>
    `).join('');

    // Scroll to bottom
    scrollToBottom();
}

/**
 * Load messages from localStorage (persistent shared chat)
 */
function loadInitialMessages() {
    // Try to load messages from localStorage
    try {
        const storedMessages = localStorage.getItem('disasterPrep_messages');
        if (storedMessages) {
            APP_STATE.messages = JSON.parse(storedMessages);
            log(`Loaded ${APP_STATE.messages.length} messages from storage`, 'info');
        } else {
            // First time - initialize with welcome messages
            APP_STATE.messages = [];
            const welcomeMessages = [
                {
                    id: generateMessageId(),
                    user: '🤖 System',
                    userId: 'system',
                    content: '✅ PERMANENT COMMUNITY CHAT ACTIVATED - All messages are saved and shared with everyone!',
                    timestamp: new Date(Date.now() - 120000),
                    time: getFormattedTime(Date.now() - 120000),
                    isSystemMessage: true
                },
                {
                    id: generateMessageId(),
                    user: '🤖 System',
                    userId: 'system',
                    content: '📌 This is a PUBLIC & PERMANENT chat. Your messages will be visible to all users and will be saved even after page refresh.',
                    timestamp: new Date(Date.now() - 60000),
                    time: getFormattedTime(Date.now() - 60000),
                    isSystemMessage: true
                },
                {
                    id: generateMessageId(),
                    user: '💡 Tip',
                    userId: 'system',
                    content: 'Share disaster preparedness tips, resources, and links. Help the community stay safe and informed!',
                    timestamp: new Date(),
                    time: getFormattedTime(Date.now()),
                    isSystemMessage: true
                }
            ];
            APP_STATE.messages.push(...welcomeMessages);
            saveMessagesToStorage();
        }
    } catch (e) {
        log('Error loading messages from storage: ' + e.message, 'warn');
        APP_STATE.messages = [];
    }

    renderMessages();
    document.getElementById('messageCount').textContent = APP_STATE.messages.length;
    scrollToBottom();
}

/**
 * Save messages to localStorage for persistence
 */
function saveMessagesToStorage() {
    try {
        localStorage.setItem('disasterPrep_messages', JSON.stringify(APP_STATE.messages));
        log('Messages saved to storage', 'debug');
    } catch (e) {
        log('Error saving messages: ' + e.message, 'warn');
    }
}

/**
 * Format message content with link detection
 */
function formatMessageContent(content) {
    // Escape HTML first
    let formatted = escapeHtml(content);

    // Detect and format URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    formatted = formatted.replace(urlRegex, (url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });

    return formatted;
}

/**
 * Scroll chat to bottom
 */
function scrollToBottom() {
    const container = document.getElementById('chatMessages');
    setTimeout(() => {
        container.scrollTop = container.scrollHeight;
    }, CONFIG.TIMEOUTS.ANIMATION);
}

/**
 * Clear all chat messages
 */
function clearChat() {
    if (!confirm('Are you sure you want to clear all messages? This will affect all users.')) {
        return;
    }

    APP_STATE.messages = [];
    
    // Clear from localStorage
    try {
        localStorage.removeItem('disasterPrep_messages');
    } catch (e) {
        log('Error clearing messages: ' + e.message, 'warn');
    }
    
    renderMessages();
    document.getElementById('messageCount').textContent = 0;
    showToast(CONFIG.MESSAGES.CHAT_CLEARED, 'info');
    log('Chat cleared', 'info');
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Generate unique message ID
 */
function generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get formatted time
 */
function getFormattedTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}