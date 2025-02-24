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
    lanes: 2,
    leftTurnLanes: [],
    busLanes: [],
    priority: 1
};

// Expose initialization function for the main script
window.initializeEditorUI = function(config) {
    const puffin = document.getElementById('puffin');
    if (config.puffinActive) {
        puffinOn = true;
        puffin.classList.replace('inactive', 'active');
        puffin.innerHTML = "Puffin Active";
    } else {
        puffinOn = false;
        puffin.classList.replace('active', 'inactive');
        puffin.innerHTML = "Puffin Inactive";
    }
    currentConfig = {
        lanes: config.lanes || 2,
        leftTurnLanes: config.leftTurnLanes || [],
        busLanes: config.busLanes || [],
        priority: config.priority || 1
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

    // Set priority
    const priorityItems = document.querySelectorAll('.page-item');
    priorityItems.forEach(item => item.classList.remove('active'));
    priorityItems[currentConfig.priority - 1]?.classList.add('active');

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

    const activePriority = document.querySelector('.page-item.active');
    const priority = activePriority ? 
        parseInt(activePriority.querySelector('.page-link').textContent) : 1;

    return {
        lanes: columns.length,
        leftTurnLanes,
        busLanes,
        priority,
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

document.querySelectorAll('.page-item:not(.disabled)').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        // Remove active class from all items
        document.querySelectorAll('.page-item').forEach(el => {
            el.classList.remove('active');
        });
        // Add active class to clicked item
        this.classList.add('active');
        
        // Update the label
        const priorityLabel = document.querySelector('.priority-label');
        priorityLabel.innerHTML = `Priority Set <i class="fas fa-star"></i>`;
        priorityLabel.classList.remove('text-muted');
        priorityLabel.classList.add('active');

        // Get priority from clicked item and update config directly
        const newPriority = parseInt(this.querySelector('.page-link').textContent);
        currentConfig.priority = newPriority;
    });
});
// Initialize first column with Left Turn button
window.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('columnsContainer').children.length) {
        initializeColumns(4);
    }
});

function createButtonsDiv(isFirstColumn) {
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'column-buttons';
    
    let buttonHtml = '';
    if (isFirstColumn) {
        buttonHtml += '<button class="left-turn-button" onclick="spawnLeftTurn(this)">Left Turn</button>';
    }
    
    buttonHtml += `
        <button class="button-label" onclick="spawnBusImage(this)">Bus</button>
        <div class="arrow-buttons">
            <button class="btn-arrow-up"><i class="fa-solid fa-up-long"></i></button>
            <button class="btn-arrow-down"><i class="fa-solid fa-down-long"></i></button>
        </div>
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