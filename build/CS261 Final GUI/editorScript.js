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
    leftLaneAttribute: null, // Can be 'bus', 'bike', 'left-turn', or null
    currentConfig: {
        lanes: 1,
        leftLaneAttribute: null,
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
 * @param {string|null} config.leftLaneAttribute - Attribute of leftmost lane ('bus', 'bike', 'left-turn', or null)
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
         leftLaneAttribute: config.leftLaneAttribute || null,  // Use the passed attribute
         priority: config.priority !== undefined ? config.priority : 0
     };
     
     // Update editor state to match config
     editorState.leftLaneAttribute = config.leftLaneAttribute || null;

    // Clear and rebuild lanes container
    const container = document.getElementById('columnsContainer');
    if (!container) {
        console.error("Columns container not found");
        return;
    }
    
    container.innerHTML = '';
    
    // Initialize with the provided lane count
    initializeColumns(editorState.currentConfig.lanes);

    // Apply attribute to leftmost lane if specified
    if (editorState.currentConfig.leftLaneAttribute) {
        const columns = document.querySelectorAll('.column');
        if (columns.length > 0) {
            const leftmostColumn = columns[0];
            
            // Apply the appropriate attribute
            switch (editorState.currentConfig.leftLaneAttribute) {
                case 'left-turn':
                    createNewIcon(leftmostColumn, 'fa-turn-left');
                    break;
                case 'bus':
                    createNewIcon(leftmostColumn, 'fa-bus');
                    break;
                case 'bike':
                    createNewIcon(leftmostColumn, 'fa-bicycle');
                    break;
            }
        }
    }

    // Create the priority pagination
    rebuildPriorityPagination(editorState.currentConfig.priority);
};

/**
 * Updates the display of the puffin crossing toggle button
 */
function updatePuffinToggleDisplay() {
    console.log("Updating puffin toggle display");
    const puffinToggle = document.getElementById('puffinToggle');
    if (!puffinToggle) return;
    
    if (editorState.puffinActive) {
        console.log("Becoming active");
        puffinToggle.classList.remove('inactive');
        puffinToggle.classList.add('active');
        puffinToggle.textContent = "Puffin Active";
        puffinToggle.setAttribute('aria-pressed', 'true');
    } else {
        console.log("Becoming inactive");
        puffinToggle.classList.remove('active');
        puffinToggle.classList.add('inactive');
        puffinToggle.textContent = "Puffin Inactive";
        puffinToggle.setAttribute('aria-pressed', 'false');
    }
}

/**
 * Get the current editor configuration
 * @returns {Object} Configuration object with lanes, leftLaneAttribute, and priority
 */
window.getEditorConfiguration = function() {
    const columns = document.querySelectorAll('.column');
    
    // Check if the leftmost lane has an attribute
    let leftLaneAttribute = null;
    if (columns.length > 0) {
        const leftmostColumn = columns[0];
        
        // Check for left turn lane
        if (leftmostColumn.querySelector('.fa-turn-left')) {
            leftLaneAttribute = 'left-turn';
            console.log("setting left lane attribute to left-turn");
        }
        // Check for bus lane
        else if (leftmostColumn.querySelector('.fa-bus')) {
            leftLaneAttribute = 'bus';
        }
        // Check for bike lane
        else if (leftmostColumn.querySelector('.fa-bicycle')) {
            leftLaneAttribute = 'bike';
        }
    }

    // Return current configuration
    return {
        lanes: columns.length,
        leftLaneAttribute: leftLaneAttribute,
        priority: editorState.currentConfig.priority,
        puffinActive: editorState.puffinActive
    };
};

/**
 * Handles transition between different lane icons for the leftmost lane
 * @param {HTMLElement} column - The column element where the icon appears
 * @param {string} iconClassOrImageSrc - FontAwesome icon class or image source URL to display
 * @param {string} attributeType - Type of attribute ('bus', 'bike', or 'left-turn')
 */
function handleImageTransition(column, iconClassOrImageSrc, attributeType) {
    console.log(iconClassOrImageSrc);
    // Only allow changes to the leftmost lane
    const columns = document.querySelectorAll('.column');
    if (columns.length === 0 || column !== columns[0]) {
        console.log("Only the leftmost lane can have attributes");
        return;
    }
    
    const imageContainer = column.querySelector('.lane-image-container');
    
    // Check if we're toggling the same attribute (turning it off)
    if (editorState.leftLaneAttribute === attributeType && imageContainer) {
        // Remove the current attribute
        imageContainer.classList.add('fade-out');
        imageContainer.addEventListener('animationend', () => {
            imageContainer.remove();
            editorState.leftLaneAttribute = null;
            editorState.currentConfig.leftLaneAttribute = null;
        }, { once: true });
    } else {
        // Handle existing icon (if any)
        if (imageContainer) {
            // Fade out existing image
            imageContainer.classList.add('fade-out');
            
            // Replace with new icon after animation completes
            imageContainer.addEventListener('animationend', () => {
                imageContainer.remove();
                if (attributeType === 'left-turn') {
                    createNewImage(column, iconClassOrImageSrc);
                } else {
                    createNewIcon(column, iconClassOrImageSrc);
                }
            }, { once: true });
        } else {
            // No existing icon, create new one
            if (attributeType === 'left-turn') {
                createNewImage(column, iconClassOrImageSrc);
            } else {
                createNewIcon(column, iconClassOrImageSrc);
            }
        }
        
        // Update the attribute type
        editorState.leftLaneAttribute = attributeType;
        console.log("setting left lane attribute to", attributeType);
        editorState.currentConfig.leftLaneAttribute = attributeType;
    }
}

/**
 * Creates a new icon in a column
 * @param {HTMLElement} column - The column element where the icon should appear
 * @param {string} iconClass - FontAwesome icon class to display
 */
function createNewIcon(column, iconClass) {
    console.log("creating new icon", iconClass);
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
 * Creates a new image in a column
 * @param {HTMLElement} column - The column element where the image should appear
 * @param {string} imageSrc - Source URL for the image
 */
function createNewImage(column, imageSrc) {
    console.log("creating new image", imageSrc);
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
 * Creates a left turn icon in the leftmost lane
 * @param {HTMLElement} buttonElement - The button that triggered this action
 */
function spawnLeftTurn(buttonElement) {
    console.log("Toggling left turn lane");
    if (!buttonElement) {
        console.warn("Invalid button element for left turn");
        return;
    }
    
    const column = buttonElement.closest('.column');
    if (column) {
        handleImageTransition(column, 'arrow.png', 'left-turn');
    }
}

/**
 * Creates a bus lane icon in the leftmost lane
 * @param {HTMLElement} buttonElement - The button that triggered this action
 */
function spawnBusImage(buttonElement) {
    console.log("Toggling bus lane");
    if (!buttonElement) {
        console.warn("Invalid button element for bus lane");
        return;
    }
    
    const column = buttonElement.closest('.column');
    if (column) {
        handleImageTransition(column, 'fa-bus', 'bus');
    }
}

/**
 * Creates a bike lane icon in the leftmost lane
 * @param {HTMLElement} buttonElement - The button that triggered this action
 */
function spawnBikeImage(buttonElement) {
    console.log("Toggling bike lane");
    if (!buttonElement) {
        console.warn("Invalid button element for bike lane");
        return;
    }
    
    const column = buttonElement.closest('.column');
    if (column) {
        handleImageTransition(column, 'fa-bicycle', 'bike');
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
    
    // Only show lane type buttons on the first column
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
            // Now we're implementing the bike lane functionality
            spawnBikeImage(this);
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