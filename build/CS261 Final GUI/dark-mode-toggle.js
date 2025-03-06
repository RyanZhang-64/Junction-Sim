/**
 * Junction Simulator - Simple Dark Mode Toggle
 * 
 * This simplified script toggles the dark-mode class on the body element,
 * allowing CSS variables to handle the color changes.
 */

// Dark mode state
let darkModeEnabled = false;

/**
 * Creates and manages the dark mode toggle button
 */
function createDarkModeToggleButton() {
    // Create the button element
    const toggleButton = document.createElement('button');
    toggleButton.id = 'dark-mode-toggle';
    toggleButton.className = 'dark-mode-toggle-button readable';
    toggleButton.setAttribute('aria-pressed', 'false');
    toggleButton.setAttribute('aria-label', 'Enable dark mode');
    
    // Set initial state
    updateButtonState();
    
    // Style the button
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '20px';
    toggleButton.style.right = '20px';  // Positioned to the right of TTS button
    toggleButton.style.zIndex = '9999';
    toggleButton.style.padding = '10px 15px';
    toggleButton.style.borderRadius = '4px';
    toggleButton.style.border = 'none';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.display = 'flex';
    toggleButton.style.alignItems = 'center';
    toggleButton.style.fontWeight = 'bold';
    toggleButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    
    // Add button click handler
    toggleButton.addEventListener('click', function() {
        darkModeEnabled = !darkModeEnabled;
        updateButtonState();
        toggleDarkMode();
    });
    
    // Update button appearance based on state
    function updateButtonState() {
        if (darkModeEnabled) {
            toggleButton.innerHTML = '🌙 Dark Mode: ON';
            toggleButton.style.backgroundColor = '#333';
            toggleButton.style.color = 'white';
            toggleButton.setAttribute('aria-pressed', 'true');
            toggleButton.setAttribute('aria-label', 'Disable dark mode');
        } else {
            toggleButton.innerHTML = '☀️ Dark Mode: OFF';
            toggleButton.style.backgroundColor = '#f5f5f5';
            toggleButton.style.color = '#333';
            toggleButton.setAttribute('aria-pressed', 'false');
            toggleButton.setAttribute('aria-label', 'Enable dark mode');
        }
    }
    
    // Add to the DOM
    document.body.appendChild(toggleButton);
    
    return toggleButton;
}

/**
 * Toggles dark mode by adding/removing the dark-mode class on the body
 */
function toggleDarkMode() {
    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    
    // Store preference in localStorage
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('darkModeEnabled', darkModeEnabled ? 'true' : 'false');
    }
}

/**
 * Initialize dark mode
 */
function initDarkMode() {
    // Create toggle button
    createDarkModeToggleButton();
    
    // Check for stored preference
    if (typeof localStorage !== 'undefined') {
        const storedPreference = localStorage.getItem('darkModeEnabled');
        if (storedPreference === 'true') {
            darkModeEnabled = true;
            document.body.classList.add('dark-mode');
            
            // Update button state (after a small delay to ensure button exists)
            setTimeout(() => {
                const button = document.getElementById('dark-mode-toggle');
                if (button) {
                    button.innerHTML = '🌙 Dark Mode: ON';
                    button.style.backgroundColor = '#333';
                    button.style.color = 'white';
                    button.setAttribute('aria-pressed', 'true');
                }
            }, 100);
        }
    }
    
    // Check for system preference if no stored preference
    if (typeof localStorage === 'undefined' || !localStorage.getItem('darkModeEnabled')) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            darkModeEnabled = true;
            document.body.classList.add('dark-mode');
            
            // Update button state (after a small delay to ensure button exists)
            setTimeout(() => {
                const button = document.getElementById('dark-mode-toggle');
                if (button) {
                    button.innerHTML = '🌙 Dark Mode: ON';
                    button.style.backgroundColor = '#333';
                    button.style.color = 'white';
                    button.setAttribute('aria-pressed', 'true');
                }
            }, 100);
        }
    }
    
    // Optional: Add transition for smooth color changes
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            body {
                transition: background-color 0.3s ease, color 0.3s ease;
            }
            
            * {
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
            }
        </style>
    `);
}

// Initialize when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    initDarkMode();
});

// Also handle the case when the script loads after DOMContentLoaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initDarkMode, 1);
}