// ===========================
// VOTING LOGIC
// ===========================

/**
 * Render all voting platforms
 */
function renderPlatforms() {
    const container = document.getElementById('platformsList');
    
    container.innerHTML = CONFIG.PLATFORMS.map(platform => `
        <div class="platform-option" id="platform-${platform.id}" onclick="toggleVote(${platform.id})">
            <input 
                type="checkbox" 
                class="platform-checkbox" 
                id="vote-${platform.id}"
            >
            <div class="platform-info">
                <div class="platform-name">${platform.emoji} ${platform.name}</div>
                <div class="vote-count">
                    <span id="vote-count-${platform.id}">0</span> votes
                </div>
                <div class="platform-bar">
                    <div class="platform-bar-fill" id="vote-bar-${platform.id}" style="width: 0%"></div>
                </div>
            </div>
        </div>
    `).join('');

    updateVoteDisplay();
}

/**
 * Toggle vote for a platform
 */
function toggleVote(platformId) {
    const checkbox = document.getElementById(`vote-${platformId}`);
    const isChecked = checkbox.checked;
    const platformOption = document.getElementById(`platform-${platformId}`);

    if (isChecked && !APP_STATE.userVotes.has(platformId)) {
        // Add vote
        APP_STATE.userVotes.add(platformId);
        APP_STATE.allVotes[platformId]++;
        platformOption.classList.add('voted');
        log(`Vote added for platform ${platformId}`, 'info');
    } else if (!isChecked && APP_STATE.userVotes.has(platformId)) {
        // Remove vote
        APP_STATE.userVotes.delete(platformId);
        APP_STATE.allVotes[platformId]--;
        platformOption.classList.remove('voted');
        log(`Vote removed for platform ${platformId}`, 'info');
    }

    updateVoteDisplay();
    showToast(isChecked ? CONFIG.MESSAGES.VOTE_ADDED : CONFIG.MESSAGES.VOTE_REMOVED, 'success');
}

/**
 * Update voting display and statistics
 */
function updateVoteDisplay() {
    const total = Object.values(APP_STATE.allVotes).reduce((a, b) => a + b, 0);
    
    // Update stats
    document.getElementById('myVoteCount').textContent = APP_STATE.userVotes.size;
    document.getElementById('totalVoteCount').textContent = total;
    document.getElementById('participantCount').textContent = APP_STATE.allUsers.size;

    // Update each platform display
    CONFIG.PLATFORMS.forEach(platform => {
        const votes = APP_STATE.allVotes[platform.id];
        const percentage = total > 0 ? (votes / total) * 100 : 0;
        
        // Update vote count
        document.getElementById(`vote-count-${platform.id}`).textContent = votes;
        
        // Update progress bar
        document.getElementById(`vote-bar-${platform.id}`).style.width = percentage + '%';
        
        // Update voted class
        const option = document.getElementById(`platform-${platform.id}`);
        if (APP_STATE.userVotes.has(platform.id)) {
            option.classList.add('voted');
        } else {
            option.classList.remove('voted');
        }
    });

    // Update results section
    updateResults();
}

/**
 * Update and display results
 */
function updateResults() {
    const container = document.getElementById('resultsList');
    const total = Object.values(APP_STATE.allVotes).reduce((a, b) => a + b, 0);

    // Sort platforms by votes (descending)
    const sorted = [...CONFIG.PLATFORMS].sort((a, b) => APP_STATE.allVotes[b.id] - APP_STATE.allVotes[a.id]);

    container.innerHTML = sorted.map((platform, index) => {
        const votes = APP_STATE.allVotes[platform.id];
        const percentage = total > 0 ? ((votes / total) * 100).toFixed(1) : 0;
        
        return `
            <div class="result-item">
                <div class="result-header">
                    <span class="result-label">
                        #${index + 1} ${platform.emoji} ${platform.name}
                    </span>
                    <span class="result-percentage">${percentage}%</span>
                </div>
                <div class="result-bar">
                    <div class="result-bar-fill" style="width: ${percentage}%"></div>
                </div>
                <small style="color: var(--text-lighter);">
                    ${votes} ${votes === 1 ? 'vote' : 'votes'}
                </small>
            </div>
        `;
    }).join('');

    log('Results updated', 'debug');
}

/**
 * Get voting statistics
 */
function getVotingStats() {
    const total = Object.values(APP_STATE.allVotes).reduce((a, b) => a + b, 0);
    const topPlatform = CONFIG.PLATFORMS.reduce((max, p) => 
        APP_STATE.allVotes[p.id] > APP_STATE.allVotes[max.id] ? p : max
    );

    return {
        totalVotes: total,
        participants: APP_STATE.allUsers.size,
        topPlatform: topPlatform,
        userVotes: APP_STATE.userVotes.size,
        platforms: CONFIG.PLATFORMS.map(p => ({
            ...p,
            votes: APP_STATE.allVotes[p.id],
            percentage: total > 0 ? ((APP_STATE.allVotes[p.id] / total) * 100).toFixed(1) : 0
        }))
    };
}

/**
 * Export voting results as JSON
 */
function exportResults() {
    const stats = getVotingStats();
    const data = {
        timestamp: new Date().toISOString(),
        appName: CONFIG.APP_NAME,
        appVersion: CONFIG.APP_VERSION,
        stats: stats
    };

    const json = JSON.stringify(data, null, 2);
    downloadFile(json, 'voting-results.json');
    showToast('Results exported!', 'success');
}

/**
 * Download file utility
 */
function downloadFile(content, filename) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}