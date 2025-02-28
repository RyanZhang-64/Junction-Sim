/**
 * Junction Simulator - Editor Module
 * Handles the lane editor functionality for configuring junction arms
 */

// Constants
const LANE_LIMITS = {
    MIN: 1,
    MAX: 5
};

// State variables
let editorState = {
    puffinActive: false,
    activeBusColumn: null,
    currentConfig: {
        lanes: 1,
        leftTurnLanes: [],
        busLanes: [],
        priority: 0
    }
};

/**
 * Gets the current number of lanes in the editor
 * @returns {number} Current column count
 */
function getCurrentColumnCount() {
    return document.querySelectorAll('.column').length;
}

/**
 * Creates and updates the priority selection pagination based on current value
 * @param {number} priorityValue - Current priority value (0-4, 0 means unset)
 */
function rebuildPriorityPagination(priorityValue) {
    // Get the pagination container
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) {
        console.warn('Priority pagination container not found');
        return;
    }
    
    // Clear existing pagination items
    paginationContainer.innerHTML = '';
    
    // Create new pagination items (priority levels 1-4)
    for (let i = 1; i <= 4; i++) {
        const listItem = document.createElement('li');
        listItem.id = `priority${i}`;
        listItem.className = 'page-item';
        
        // Mark the current priority as active
        if (i === priorityValue) {
            listItem.classList.add('active');
        }
        
        // Create the pagination link
        const link = document.createElement('a');
        link.className = 'page-link text-center';
        link.href = '#';
        link.textContent = i;
        
        // Add click handler for priority selection
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            console.log(`Priority clicked: ${i}`);
            
            // Update priority label
            updatePriorityLabel(i);
            
            // Update current config
            editorState.currentConfig.priority = i;
            console.log(`Updated editorState.currentConfig.priority to: ${editorState.currentConfig.priority}`);
            
            // Update active state
            document.querySelectorAll('.page-item').forEach(el => {
                el.classList.remove('active');
            });
            listItem.classList.add('active');
        });
        
        // Add to DOM
        listItem.appendChild(link);
        paginationContainer.appendChild(listItem);
    }
    
    // Update the priority label
    updatePriorityLabel(priorityValue);
}

/**
 * Updates the priority label based on selected priority
 * @param {number} priorityValue - Selected priority (0-4)
 */
function updatePriorityLabel(priorityValue) {
    const priorityLabel = document.querySelector('.priority-label');
    if (!priorityLabel) return;
    
    if (priorityValue === 0) {
        priorityLabel.textContent = 'Priority Unset';
        priorityLabel.classList.remove('active');
        priorityLabel.classList.add('text-muted');
    } else {
        priorityLabel.innerHTML = `Priority Set <i class="fas fa-star"></i>`;
        priorityLabel.classList.remove('text-muted');
        priorityLabel.classList.add('active');
    }
}

/**
 * Initialize the editor UI with a given configuration
 * @param {Object} config - Configuration object for the editor
 * @param {number} config.lanes - Number of lanes
 * @param {Array} config.leftTurnLanes - Indices of lanes with left turn
 * @param {Array} config.busLanes - Indices of lanes with bus priority
 * @param {number} config.priority - Priority setting (0-4)
 * @param {boolean} config.puffinActive - Whether puffin crossing is active
 */
window.initializeEditorUI = function(config) {
    // Set up puffin crossing toggle
    const puffinToggle = document.getElementById('puffinToggle');
    if (puffinToggle) {
        // Update puffin state based on config
        editorState.puffinActive = config.puffinActive || false;
        updatePuffinToggleDisplay();
    } else {
        console.warn("Puffin toggle element not found in DOM");
        editorState.puffinActive = config.puffinActive || false;
    }
    
    // Store current configuration
    editorState.currentConfig = {
        lanes: config.lanes || 1,
        leftTurnLanes: Array.isArray(config.leftTurnLanes) ? config.leftTurnLanes : [],
        busLanes: Array.isArray(config.busLanes) ? config.busLanes : [],
        priority: config.priority !== undefined ? config.priority : 0
    };

    // Clear and rebuild lanes container
    const container = document.getElementById('columnsContainer');
    if (!container) {
        console.error("Columns container not found");
        return;
    }
    
    container.innerHTML = '';
    
    // Initialize with the provided lane count
    initializeColumns(editorState.currentConfig.lanes);

    // Restore left turn lanes
    editorState.currentConfig.leftTurnLanes.forEach(laneIndex => {
        const column = document.querySelectorAll('.column')[laneIndex];
        if (column) {
            const leftTurnButton = column.querySelector('.left-turn-button');
            if (leftTurnButton) {
                spawnLeftTurn(leftTurnButton);
            }
        }
    });

    // Restore bus lanes
    editorState.currentConfig.busLanes.forEach(laneIndex => {
        const column = document.querySelectorAll('.column')[laneIndex];
        if (column) {
            const busButton = column.querySelector('.button-label');
            if (busButton) {
                spawnBusImage(busButton);
            }
        }
    });

    // Create the priority pagination
    rebuildPriorityPagination(editorState.currentConfig.priority);
};

/**
 * Updates the display of the puffin crossing toggle button
 */
function updatePuffinToggleDisplay() {
    const puffinToggle = document.getElementById('puffinToggle');
    if (!puffinToggle) return;
    
    if (editorState.puffinActive) {
        puffinToggle.classList.remove('inactive');
        puffinToggle.classList.add('active');
        puffinToggle.textContent = "Puffin Active";
        puffinToggle.setAttribute('aria-pressed', 'true');
    } else {
        puffinToggle.classList.remove('active');
        puffinToggle.classList.add('inactive');
        puffinToggle.textContent = "Puffin Inactive";
        puffinToggle.setAttribute('aria-pressed', 'false');
    }
}

/**
 * Get the current editor configuration
 * @returns {Object} Configuration object with lanes, leftTurnLanes, busLanes, and priority
 */
window.getEditorConfiguration = function() {
    const columns = document.querySelectorAll('.column');
    const leftTurnLanes = [];
    const busLanes = [];

    // Identify lanes with left turns and bus priority
    columns.forEach((column, index) => {
        // Check for left turn lane
        if (column.querySelector('.fa-turn-left')) {
            leftTurnLanes.push(index);
        }
        
        // Check for bus lane
        if (column.querySelector('.fa-bus')) {
            busLanes.push(index);
        }
    });

    console.log(`getEditorConfiguration - editorState.currentConfig.priority: ${editorState.currentConfig.priority}`);

    // Return current configuration
    return {
        lanes: columns.length,
        leftTurnLanes,
        busLanes,
        priority: editorState.currentConfig.priority,
        puffinActive: editorState.puffinActive
    };
};

/**
 * Handles transition between different lane icons
 * @param {HTMLElement} column - The column element where the icon appears
 * @param {string} iconClass - FontAwesome icon class to display
 * @param {boolean} isBus - Whether this is a bus lane icon (special handling)
 */
function handleImageTransition(column, iconClass, isBus = false) {
    const imageContainer = column.querySelector('.lane-image-container');
    console.log("Creating new icon");
    
    // Handle special case for bus lanes (only one allowed at a time)
    if (isBus) {
        // If there's an active bus in a different column, remove it first
        if (editorState.activeBusColumn && editorState.activeBusColumn !== column) {
            const existingBusContainer = editorState.activeBusColumn.querySelector('.lane-image-container');
            if (existingBusContainer) {
                existingBusContainer.classList.add('fade-out');
                existingBusContainer.addEventListener('animationend', () => {
                    existingBusContainer.remove();
                }, { once: true });
            }
        }
        
        // Update active bus column reference
        editorState.activeBusColumn = (imageContainer && column === editorState.activeBusColumn) ? null : column;
    }
    
    // Handle existing icon (if any)
    if (imageContainer) {
        // Fade out existing image
        imageContainer.classList.add('fade-out');
        
        // Replace with new icon after animation completes
        imageContainer.addEventListener('animationend', () => {
            imageContainer.remove();
            if (!isBus || (isBus && editorState.activeBusColumn === column)) {
                createNewIcon(column, iconClass);
            }
        }, { once: true });
    } else {
        // No existing icon, create new one immediately
        createNewIcon(column, iconClass);
    }

    // Update configuration after changes
    if (isBus || iconClass === 'fa-turn-left') {
        editorState.currentConfig = window.getEditorConfiguration();
    }
}

/**
 * Creates a new icon in a column
 * @param {HTMLElement} column - The column element where the icon should appear
 * @param {string} iconClass - FontAwesome icon class to display
 */
function createNewIcon(column, iconClass) {
    // Create container for the icon
    const imageContainer = document.createElement('div');
    imageContainer.className = 'lane-image-container';
    
    // Create the icon element
    const icon = document.createElement('i');
    icon.className = `fa-solid ${iconClass} lane-image fade-in`;
    
    // Add to DOM
    imageContainer.appendChild(icon);
    column.appendChild(imageContainer);
}

/**
 * Creates a left turn icon in the specified column
 * @param {HTMLElement} buttonElement - The button that triggered this action
 */
function spawnLeftTurn(buttonElement) {
    console.log("Spawning left turn");
    if (!buttonElement) {
        console.warn("Invalid button element for left turn");
        return;
    }
    
    const column = buttonElement.closest('.column');
    if (column) {
        handleImageTransition(column, 'fa-turn-left', false);
    }
}

/**
 * Creates a bus lane icon in the specified column
 * @param {HTMLElement} buttonElement - The button that triggered this action
 */
function spawnBusImage(buttonElement) {
    if (!buttonElement) {
        console.warn("Invalid button element for bus lane");
        return;
    }
    
    const column = buttonElement.closest('.column');
    if (column) {
        handleImageTransition(column, 'fa-bus', true);
    }
}

/**
 * Creates a new image in a column (for non-FontAwesome images)
 * @param {HTMLElement} column - The column element where the image should appear
 * @param {string} imageSrc - Source URL for the image
 */
function createNewImage(column, imageSrc) {
    // Create container for the image
    const imageContainer = document.createElement('div');
    imageContainer.className = 'lane-image-container';
    
    // Create the image element
    const image = document.createElement('img');
    image.src = imageSrc;
    image.alt = "Lane configuration icon"; // Accessibility improvement
    image.className = 'lane-image fade-in';
    
    // Add to DOM
    imageContainer.appendChild(image);
    column.appendChild(imageContainer);
}

/**
 * Toggles the puffin crossing state
 */
function puffinToggle() {
    // Toggle puffin state
    editorState.puffinActive = !editorState.puffinActive;
    console.log(editorState.puffinActive ? "Puffin activated" : "Puffin deactivated");
    
    // Update display
    updatePuffinToggleDisplay();
    
    // Notify the main view of puffin state change
    if (typeof window.updatePuffinState === 'function') {
        window.updatePuffinState(editorState.puffinActive);
    }
}

/**
 * Increases the number of lanes in the editor
 */
function increaseColumns() {
    const currentCount = getCurrentColumnCount();
    if (currentCount < LANE_LIMITS.MAX) {
        const container = document.getElementById('columnsContainer');
        if (!container) {
            console.error("Columns container not found");
            return;
        }
        
        // Create and add new column
        const newColumn = createColumn(currentCount === 0);
        container.appendChild(newColumn);
        
        // Update configuration
        editorState.currentConfig.lanes = currentCount + 1;
    } else {
        console.log(`Maximum lane limit (${LANE_LIMITS.MAX}) reached`);
    }
}

/**
 * Decreases the number of lanes in the editor
 */
function decreaseColumns() {
    const currentCount = getCurrentColumnCount();
    if (currentCount > LANE_LIMITS.MIN) {
        const container = document.getElementById('columnsContainer');
        if (!container) {
            console.error("Columns container not found");
            return;
        }
        
        // Remove last column
        container.removeChild(container.lastElementChild);
        
        // Update configuration
        editorState.currentConfig.lanes = currentCount - 1;
    } else {
        console.log(`Minimum lane limit (${LANE_LIMITS.MIN}) reached`);
    }
}

/**
 * Creates the buttons div for a column
 * @param {boolean} isFirstColumn - Whether this is the first column
 * @returns {HTMLElement} The buttons div element
 */
function createButtonsDiv(isFirstColumn) {
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'column-buttons';
    
    // Only show lane type buttons on the first column for UI clarity
    if (isFirstColumn) {
        const leftTurnButton = document.createElement('button');
        leftTurnButton.id = 'leftToggle';
        leftTurnButton.className = 'left-turn-button';
        leftTurnButton.textContent = 'Left Turn';
        leftTurnButton.setAttribute('aria-label', 'Toggle left turn lane');
        leftTurnButton.addEventListener('click', function() {
            spawnLeftTurn(this);
        });
        
        const busButton = document.createElement('button');
        busButton.id = 'busToggle';
        busButton.className = 'button-label';
        busButton.textContent = 'Bus';
        busButton.setAttribute('aria-label', 'Toggle bus lane');
        busButton.addEventListener('click', function() {
            spawnBusImage(this);
        });
        
        const bikeButton = document.createElement('button');
        bikeButton.id = 'bikeToggle';
        bikeButton.className = 'button-label';
        bikeButton.textContent = 'Bike';
        bikeButton.setAttribute('aria-label', 'Toggle bike lane');
        bikeButton.addEventListener('click', function() {
            // This function seems to be missing in the original code
            // Placeholder for implementation
            console.log("Bike lane functionality not implemented");
        });
        
        // Add buttons to div
        buttonsDiv.appendChild(leftTurnButton);
        buttonsDiv.appendChild(busButton);
        buttonsDiv.appendChild(bikeButton);
    }
    
    return buttonsDiv;
}

/**
 * Creates a new lane column
 * @param {boolean} isFirstColumn - Whether this is the first column
 * @returns {HTMLElement} The column element
 */
function createColumn(isFirstColumn) {
    const column = document.createElement('div');
    column.className = 'column col';
    
    // Create and add the buttons div
    const buttonsDiv = createButtonsDiv(isFirstColumn);
    column.appendChild(buttonsDiv);
    
    // Create and add the content div
    const contentDiv = document.createElement('div');
    contentDiv.className = 'column-content';
    column.appendChild(contentDiv);
    
    return column;
}

/**
 * Initializes the editor with a specific number of columns/lanes
 * @param {number} count - Number of columns to initialize (default: 1)
 */
function initializeColumns(count = 1) {
    const container = document.getElementById('columnsContainer');
    if (!container) {
        console.error("Columns container not found");
        return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Create the specified number of columns
    for (let i = 0; i < count; i++) {
        container.appendChild(createColumn(i === 0));
    }
}

// Initialize the editor when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set up event listeners for lane controls
    const addLaneButton = document.getElementById('addLane');
    if (addLaneButton) {
        addLaneButton.addEventListener('click', increaseColumns);
    }
    
    const removeLaneButton = document.getElementById('removeLane');
    if (removeLaneButton) {
        removeLaneButton.addEventListener('click', decreaseColumns);
    }
    
    const puffinButton = document.getElementById('puffinToggle');
    if (puffinButton) {
        puffinButton.addEventListener('click', puffinToggle);
    }
    
    // Initialize first column if container exists and is empty
    const columnsContainer = document.getElementById('columnsContainer');
    if (columnsContainer && !columnsContainer.children.length) {
        initializeColumns(1);
    }
});