/**
 * Junction Simulator - Lane Limit Feedback Enhancement
 * 
 * This code adds user feedback when attempting to exceed lane limits:
 * - Shows a "not-allowed" cursor when hovering over buttons at limits
 * - Displays a Bootstrap modal with an informative message when clicked at limits
 */

// Function to update the add/remove lane buttons' states based on current lane count
function updateLaneButtonStates() {
    const currentCount = getCurrentColumnCount();
    const addLaneButton = document.getElementById('addLane');
    const removeLaneButton = document.getElementById('removeLane');
    
    if (!addLaneButton || !removeLaneButton) {
        console.error("Lane buttons not found");
        return;
    }
    
    // Update Add Lane button state
    if (currentCount >= LANE_LIMITS.MAX) {
        addLaneButton.classList.add('at-limit');
        addLaneButton.setAttribute('data-limit-message', 'This arm is already at the max number of lanes!');
    } else {
        addLaneButton.classList.remove('at-limit');
        addLaneButton.removeAttribute('data-limit-message');
    }
    
    // Update Remove Lane button state
    if (currentCount <= LANE_LIMITS.MIN) {
        removeLaneButton.classList.add('at-limit');
        removeLaneButton.setAttribute('data-limit-message', 'This arm must have at least one lane!');
    } else {
        removeLaneButton.classList.remove('at-limit');
        removeLaneButton.removeAttribute('data-limit-message');
    }
}

// Function to show the limit reached modal
function showLimitModal(message) {
    // Ensure Bootstrap Modal functionality is available
    ensureBootstrapModal();
    
    // Get or create the modal
    let limitModal = document.getElementById('laneLimitModal');
    
    if (!limitModal) {
        // Create the modal if it doesn't exist
        limitModal = document.createElement('div');
        limitModal.id = 'laneLimitModal';
        limitModal.className = 'modal fade';
        limitModal.setAttribute('tabindex', '-1');
        limitModal.setAttribute('role', 'dialog');
        limitModal.setAttribute('aria-labelledby', 'laneLimitModalTitle');
        limitModal.setAttribute('aria-hidden', 'true');
        
        limitModal.innerHTML = `
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title readable" id="laneLimitModalTitle">Lane Limit Reached</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p class="readable" id="laneLimitMessage"></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary readable" id="limitModalOkButton">OK</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(limitModal);
    }
    
    // Set the modal message
    const messageElement = limitModal.querySelector('#laneLimitMessage');
    if (messageElement) {
        messageElement.textContent = message;
    }
    
    // Show the modal - using direct DOM methods since jQuery might not be available
    const bsModal = new bootstrap.Modal(limitModal);
    bsModal.show();
    
    // Add event listeners to close buttons
    const closeButton = limitModal.querySelector('.close');
    const okButton = limitModal.querySelector('#limitModalOkButton');
    
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            bsModal.hide();
        });
    }
    
    if (okButton) {
        okButton.addEventListener('click', function() {
            bsModal.hide();
        });
    }
}

// Add custom CSS for at-limit buttons
const style = document.createElement('style');
style.textContent = `
.control-btn.at-limit {
    cursor: not-allowed;
    opacity: 0.7;
}

.control-btn.at-limit:hover {
    background-color: #f8f9fa; /* Light gray background to indicate disabled state */
}
`;
document.head.appendChild(style);

// Function to handle the add lane button click with limit checking
function handleAddLaneClick(event) {
    const currentCount = getCurrentColumnCount();
    if (currentCount >= LANE_LIMITS.MAX) {
        showLimitModal('This arm is already at the max number of lanes!');
        event.stopPropagation(); // Prevent the original click handler from firing
    } else {
        // Continue with the original increaseColumns function
        increaseColumns();
        // Update button states after increasing
        updateLaneButtonStates();
    }
}

// Function to handle the remove lane button click with limit checking
function handleRemoveLaneClick(event) {
    const currentCount = getCurrentColumnCount();
    if (currentCount <= LANE_LIMITS.MIN) {
        showLimitModal('This arm must have at least one lane!');
        event.stopPropagation(); // Prevent the original click handler from firing
    } else {
        // Continue with the original decreaseColumns function
        decreaseColumns();
        // Update button states after decreasing
        updateLaneButtonStates();
    }
}

// Initialize when the document is ready
// Ensure Bootstrap's Modal is available
function ensureBootstrapModal() {
    // Check if Bootstrap 5 Modal is available
    if (typeof bootstrap !== 'undefined' && typeof bootstrap.Modal === 'function') {
        return true;
    }
    
    // Check if we're using Bootstrap 4 with jQuery
    if (typeof $ !== 'undefined' && typeof $.fn.modal === 'function') {
        // Create a shim for Bootstrap 5's Modal API
        window.bootstrap = window.bootstrap || {};
        window.bootstrap.Modal = function(element) {
            this.element = element;
            this.show = function() {
                $(element).modal('show');
            };
            this.hide = function() {
                $(element).modal('hide');
            };
        };
        return true;
    }
    
    // Neither Bootstrap 5 nor Bootstrap 4 with jQuery is available
    // Add a simplified modal implementation
    window.bootstrap = window.bootstrap || {};
    window.bootstrap.Modal = function(element) {
        this.element = element;
        this.show = function() {
            element.style.display = 'block';
            element.classList.add('show');
            document.body.classList.add('modal-open');
            
            // Create backdrop
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            document.body.appendChild(backdrop);
            
            // Store backdrop reference
            this.backdrop = backdrop;
        };
        this.hide = function() {
            element.style.display = 'none';
            element.classList.remove('show');
            document.body.classList.remove('modal-open');
            
            // Remove backdrop
            if (this.backdrop && this.backdrop.parentNode) {
                this.backdrop.parentNode.removeChild(this.backdrop);
            }
        };
    };
    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    // Ensure Bootstrap Modal is available
    ensureBootstrapModal();
    // Setup for the add lane button
    const addLaneButton = document.getElementById('addLane');
    if (addLaneButton) {
        // Remove existing event listeners
        const addLaneClone = addLaneButton.cloneNode(true);
        if (addLaneButton.parentNode) {
            addLaneButton.parentNode.replaceChild(addLaneClone, addLaneButton);
        }
        
        // Add our new event listener
        addLaneClone.addEventListener('click', handleAddLaneClick);
    }
    
    // Setup for the remove lane button
    const removeLaneButton = document.getElementById('removeLane');
    if (removeLaneButton) {
        // Remove existing event listeners
        const removeLaneClone = removeLaneButton.cloneNode(true);
        if (removeLaneButton.parentNode) {
            removeLaneButton.parentNode.replaceChild(removeLaneClone, removeLaneButton);
        }
        
        // Add our new event listener
        removeLaneClone.addEventListener('click', handleRemoveLaneClick);
    }
    
    // Initial state update
    updateLaneButtonStates();
});

// Also update button states whenever lanes are initialized or changed
const originalInitializeColumns = initializeColumns;
window.initializeColumns = function(count) {
    originalInitializeColumns(count);
    updateLaneButtonStates();
};