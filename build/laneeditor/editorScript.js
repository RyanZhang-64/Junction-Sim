const minColumns = 1;
const maxColumns = 5;
var puffinOn = false;

function getCurrentColumnCount() {
    return document.querySelectorAll('.column').length;
}

function createButtonsDiv(isFirstColumn) {
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'column-buttons';
    
    let buttonHtml = '';
    if (isFirstColumn) {
        buttonHtml += '<button class="left-turn-button">Left Turn</button>';
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

// New function to spawn bus image
function spawnBusImage(buttonElement) {
    const column = buttonElement.closest('.column');
    
    // Check if image container already exists
    let imageContainer = column.querySelector('.lane-image-container');
    
    if (!imageContainer) {
        imageContainer = document.createElement('div');
        imageContainer.className = 'lane-image-container';
        const busImage = document.createElement('img');
        busImage.src = 'leftarrow.png'; // Replace with your bus image path
        busImage.className = 'lane-image';
        imageContainer.appendChild(busImage);
        column.appendChild(imageContainer);
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
    }
}

function decreaseColumns() {
    const currentCount = getCurrentColumnCount();
    if (currentCount > minColumns) {
        const container = document.getElementById('columnsContainer');
        container.removeChild(container.lastElementChild);
    }
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
    });
  });

// Initialize first column with Left Turn button
window.addEventListener('DOMContentLoaded', () => {
    initializeColumns(4);
    const firstColumn = document.querySelector('.column');
    if (firstColumn) {
        const buttonsDiv = firstColumn.querySelector('.column-buttons');
        if (buttonsDiv) {
            buttonsDiv.innerHTML = `
                <button class="left-turn-button">Left Turn</button>
                <button class="button-label">Bus</button>
                <div class="arrow-buttons">
                    <button class="btn-arrow-up"><i class="fa-solid fa-up-long"></i></button>
                    <button class="btn-arrow-down"><i class="fa-solid fa-down-long"></i></button>
                </div>
            `;
        }
    }
});

