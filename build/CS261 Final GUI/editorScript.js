const minColumns = 1;
const maxColumns = 5;
var puffinOn = false;

function getCurrentColumnCount() {
    return document.querySelectorAll('.column').length;
}

// Add this at the top with your other global variables
let activeBusColumn = null;

// Add state management
let currentConfig = {
    lanes: 1,
    leftTurnLanes: [],
    busLanes: [],
    priority: 1
};

function rebuildPriorityPagination(priorityValue) {
    console.log("REBUILDING");
    // Get the container that holds the pagination
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;
    
    // Clear existing pagination
    paginationContainer.innerHTML = '';
    
    // Create new pagination items
    for (let i = 1; i <= 4; i++) {
        const listItem = document.createElement('li');
        listItem.id = `priority${i}`;
        listItem.className = 'page-item';
        
        // Mark the item active if it matches the current priority
        if (i === priorityValue) {
            listItem.classList.add('active');
        }
        
        const link = document.createElement('a');
        link.className = 'page-link text-center';
        link.href = '#';
        link.textContent = i;
        
        // Add click handler
        // In the pagination click handler:
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            console.log(`Priority clicked: ${i}`);
            
            // Update priority label
            const priorityLabel = document.querySelector('.priority-label');
            priorityLabel.innerHTML = `Priority Set <i class="fas fa-star"></i>`;
            priorityLabel.classList.remove('text-muted');
            priorityLabel.classList.add('active');
            
            // Update current config
            currentConfig.priority = i;
            console.log(`Updated currentConfig.priority to: ${currentConfig.priority}`);
            
            // Update active state
            document.querySelectorAll('.page-item').forEach(el => {
                el.classList.remove('active');
            });
            listItem.classList.add('active');
        });
        
        listItem.appendChild(link);
        paginationContainer.appendChild(listItem);
    }
    
    // Update the priority label based on priorityValue
    const priorityLabel = document.querySelector('.priority-label');
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

window.initializeEditorUI = function(config) {
    const puffin = document.getElementById('puffin');
    if (puffin) {  // Make sure element exists before accessing properties
        if (config.puffinActive) {
            puffinOn = true;
            puffin.classList.replace('inactive', 'active');
            puffin.innerHTML = "Puffin Active";
        } else {
            puffinOn = false;
            puffin.classList.replace('active', 'inactive');
            puffin.innerHTML = "Puffin Inactive";
        }
    } else {
        // Handle case where puffin element doesn't exist
        console.warn("Puffin element not found in DOM");
        puffinOn = config.puffinActive || false;
    }
    
    currentConfig = {
        lanes: config.lanes || 1,
        leftTurnLanes: config.leftTurnLanes || [],
        busLanes: config.busLanes || [],
        priority: config.priority !== undefined ? config.priority : 0
    };

    // Clear existing columns
    const container = document.getElementById('columnsContainer');
    container.innerHTML = '';

    // Initialize with the provided configuration
    initializeColumns(currentConfig.lanes);

    // Restore left turn lanes
    currentConfig.leftTurnLanes.forEach(laneIndex => {
        const column = document.querySelectorAll('.column')[laneIndex];
        if (column) {
            spawnLeftTurn(column.querySelector('.left-turn-button'));
        }
    });

    // Restore bus lanes
    currentConfig.busLanes.forEach(laneIndex => {
        const column = document.querySelectorAll('.column')[laneIndex];
        if (column) {
            spawnBusImage(column.querySelector('.button-label'));
        }
    });

    // Create the priority pagination dynamically
    rebuildPriorityPagination(currentConfig.priority);

    // Set puffin state
    if (puffinOn !== config.puffinActive) {
        puffinToggle();
    }
};

// Expose configuration getter for the main script
window.getEditorConfiguration = function() {
    const columns = document.querySelectorAll('.column');
    const leftTurnLanes = [];
    const busLanes = [];

    columns.forEach((column, index) => {
        if (column.querySelector('.lane-image[src="leftarrow.png"]')) {
            leftTurnLanes.push(index);
        }
        if (column.querySelector('.lane-image[src="BUS.png"]')) {
            busLanes.push(index);
        }
    });

    console.log(`getEditorConfiguration - currentConfig.priority: ${currentConfig.priority}`);

    return {
        lanes: columns.length,
        leftTurnLanes,
        busLanes,
        priority: currentConfig.priority,
        puffinActive: puffinOn
    };
};

function handleImageTransition(column, newImageSrc, isBus = false) {
    const imageContainer = column.querySelector('.lane-image-container');
    
    // If this is a bus image request, handle existing bus lane first
    if (isBus) {
        // If there's an active bus in a different column, remove it first
        if (activeBusColumn && activeBusColumn !== column) {
            const existingBusContainer = activeBusColumn.querySelector('.lane-image-container');
            if (existingBusContainer) {
                existingBusContainer.classList.add('fade-out');
                existingBusContainer.addEventListener('animationend', () => {
                    existingBusContainer.remove();
                }, { once: true });
            }
        }
        // Update active bus column reference
        activeBusColumn = (imageContainer && column === activeBusColumn) ? null : column;
    }
    
    if (imageContainer) {
        // Fade out existing image
        imageContainer.classList.add('fade-out');
        
        // Wait for fade-out to complete before showing new image
        imageContainer.addEventListener('animationend', () => {
            imageContainer.remove();
            if (!isBus || (isBus && activeBusColumn === column)) {
                createNewImage(column, newImageSrc);
            }
        }, { once: true });
    } else {
        // No existing image, create new one immediately
        createNewImage(column, newImageSrc);
    }

    if (isBus || newImageSrc === 'leftarrow.png') {
        currentConfig = window.getEditorConfiguration();
    }
}

function spawnLeftTurn(buttonElement) {
    console.log("Spawning left turn");
    const column = buttonElement.closest('.column');
    handleImageTransition(column, 'leftarrow.png', false);
}

function spawnBusImage(buttonElement) {
    const column = buttonElement.closest('.column');
    handleImageTransition(column, 'BUS.png', true);
}

function createNewImage(column, imageSrc) {
    const imageContainer = document.createElement('div');
    imageContainer.className = 'lane-image-container';
    const image = document.createElement('img');
    image.src = imageSrc;
    image.className = 'lane-image fade-in';
    imageContainer.appendChild(image);
    column.appendChild(imageContainer);
}

function puffinToggle() {
    const puffin = document.getElementById('puffin');
    if (puffinOn) {
        puffinOn = false;
        puffin.classList.replace('active', 'inactive');
        puffin.innerHTML = "Puffin Inactive";
    } else {
        puffinOn = true;
        puffin.classList.replace('inactive', 'active');
        puffin.innerHTML = "Puffin Active";
    }
}

function increaseColumns() {
    const currentCount = getCurrentColumnCount();
    if (currentCount < maxColumns) {
        const container = document.getElementById('columnsContainer');
        const newColumn = document.createElement('div');
        newColumn.className = 'column col';
        
        const buttonsDiv = createButtonsDiv(currentCount === 0);
        const contentDiv = document.createElement('div');
        contentDiv.className = 'column-content';
        
        newColumn.appendChild(buttonsDiv);
        newColumn.appendChild(contentDiv);
        container.appendChild(newColumn);
        currentConfig.lanes = currentCount + 1;
    }
}

function decreaseColumns() {
    const currentCount = getCurrentColumnCount();
    if (currentCount > minColumns) {
        const container = document.getElementById('columnsContainer');
        container.removeChild(container.lastElementChild);
        currentConfig.lanes = currentCount - 1;
    }
}

// Initialize first column with Left Turn button
window.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('columnsContainer').children.length) {
        initializeColumns(1);
    }
});

function createButtonsDiv(isFirstColumn) {
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'column-buttons';
    
    let buttonHtml = '';
    if (isFirstColumn) {
        buttonHtml += '<button id="leftToggle" class="left-turn-button" onclick="spawnLeftTurn(this)">Left Turn</button>';
    }
    
    buttonHtml += `
        <button id="busToggle" class="button-label" onclick="spawnBusImage(this)">Bus</button>
    `;
    
    buttonsDiv.innerHTML = buttonHtml;
    return buttonsDiv;
}

function createColumn(index) {
    const column = document.createElement('div');
    column.className = 'column col';
    
    const buttonsDiv = createButtonsDiv(index === 0);
    const contentDiv = document.createElement('div');
    contentDiv.className = 'column-content';
    
    column.appendChild(buttonsDiv);
    column.appendChild(contentDiv);
    return column;
}

function initializeColumns(count = 4) {
    const container = document.getElementById('columnsContainer');
    for (let i = 0; i < count; i++) {
        container.appendChild(createColumn(i));
    }
}

function puffinToggle() {
    const puffin = document.getElementById('puffin');
    if (puffinOn) {
        puffinOn = false;
        puffin.classList.replace('active', 'inactive');
        puffin.innerHTML = "Puffin Inactive";
    } else {
        puffinOn = true;
        console.log("made active");
        puffin.classList.replace('inactive', 'active');
        puffin.innerHTML = "Puffin Active";
    }
    
    // Notify the main view of puffin state change
    window.updatePuffinState?.(puffinOn);
}


