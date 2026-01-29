// ===========================
// WELCOME SCREEN LOGIC
// ===========================

/**
 * Start the application from welcome screen
 */
function startApplication() {
    const welcomeScreen = document.getElementById('welcomeScreen');
    const authScreen = document.getElementById('authScreen');
    const brandHeader = document.querySelector('.brand-header');
    
    // Add hiding animation
    welcomeScreen.classList.add('hiding');
    
    // Wait for animation to complete
    setTimeout(() => {
        welcomeScreen.style.display = 'none';
        authScreen.style.display = 'flex';
        brandHeader.style.display = 'block';
        
        // Add entrance animation to auth screen
        authScreen.style.animation = 'fadeIn 0.5s ease-out';
        
        log('Welcome screen dismissed, showing auth screen', 'info');
    }, 500);
}

/**
 * Initialize welcome screen animations
 */
function initializeWelcomeScreen() {
    // Create additional particle effects
    createParticles();
    
    // Add keyboard shortcut (Enter to start)
    document.addEventListener('keydown', (e) => {
        const welcomeScreen = document.getElementById('welcomeScreen');
        if (e.key === 'Enter' && welcomeScreen && welcomeScreen.style.display !== 'none') {
            startApplication();
        }
    });
    
    log('Welcome screen initialized', 'info');
}

/**
 * Create floating particles for visual effect
 */
function createParticles() {
    const particlesContainer = document.querySelector('.floating-particles');
    if (!particlesContainer) return;
    
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: rgba(0, 230, 255, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: floatParticle ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        particlesContainer.appendChild(particle);
    }
    
    // Add particle animation style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0% {
                transform: translateY(0) translateX(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeWelcomeScreen();
});