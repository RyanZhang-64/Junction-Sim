const junctionFactor = 0.4;

class JunctionSimulation {
    constructor(canvasId) {
        // Canvas setup
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        const rect = this.canvas.getBoundingClientRect();
        this.dpr = window.devicePixelRatio || 1;
        this.setupHighDPICanvas(rect.width, rect.height);
        
        // Junction dimensions
        this.junctionSize = Math.min(rect.width, rect.height) * junctionFactor;
        
        // Lane configurations
        this.westboundLanes = 1;
        this.eastboundLanes = 1;
        this.northboundLanes = 1;
        this.southboundLanes = 1;
    
        // Direction state
        this.currentDirection = null;
        this.laneAttributes = {
            north: null,
            south: null,
            east: null,
            west: null
        };
    
        // Puffin crossing states
        this.puffinCrossings = {
            north: false,
            south: false,
            east: false,
            west: false
        };

        // Add alongside other state objects
        // In your JunctionSimulation constructor
        this.priorities = {
            north: 0,  // 0 means no priority
            south: 0,
            east: 0,
            west: 0
        };
        
        this.zebraCrossing = new Image();
        this.zebraCrossing.src = 'zebra.png';
        this.zebraCrossing.onload = () => {
            this.draw();
        };
        this.arrowImage = new Image();
        this.arrowImage.src = 'arrow.png';
    
        // Setup event handlers
        this.setupFixedButtonPositions();  // Removed duplicate call
        this.setupNavigationListeners();
        
        // Initial draw
        // Add this to your initialization code, after creating the JunctionSimulation instance
        document.fonts.ready.then(() => {
            console.log("All fonts are loaded and ready to use!");
            this.draw(); // Redraw after fonts are loaded
        });
    }
    
    drawZebraCrossing(x, y, width, height, direction) {
        if (!this.puffinCrossings[direction]) return;
    
        // Save current context state
        this.ctx.save();
        
        // Move to the crossing position and apply specific translations
        this.ctx.translate(x, y);
    
        try {
            switch(direction) {
                case 'north':
                    this.ctx.translate(width, -height/4);  // right by width, up by half height
                    this.ctx.rotate(Math.PI / 2);
                    this.ctx.drawImage(
                        this.zebraCrossing,
                        0,
                        0,
                        height/4,
                        width
                    );
                    break;
                
                case 'south':
                    this.ctx.translate(width, height);  // right by width, down by height
                    this.ctx.rotate(Math.PI / 2);
                    this.ctx.drawImage(
                        this.zebraCrossing,
                        0,
                        0,
                        height/4,
                        width
                    );
                    break;
                
                case 'east':
                    this.ctx.translate(height, 0);  // right by height, no vertical movement
                    this.ctx.drawImage(
                        this.zebraCrossing,
                        0,
                        0,
                        height/4,
                        width
                    );
                    break;
                
                case 'west':
                    this.ctx.translate(-height/4, 0);  // left by half height, no vertical movement
                    this.ctx.drawImage(
                        this.zebraCrossing,
                        0,
                        0,
                        height/4,
                        width
                    );
                    break;
            }
        } catch (e) {
            console.error('Error drawing zebra crossing:', e);
        }
    
        // Restore context state
        this.ctx.restore();
    }

    setupFixedButtonPositions() {
        const buttons = {
            'north': document.getElementById('editNorth'),
            'south': document.getElementById('editSouth'),
            'east': document.getElementById('editEast'),
            'west': document.getElementById('editWest')
        };
        
        // Get canvas dimensions
        const rect = this.canvas.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate junction dimensions
        const junctionSize = Math.min(rect.width, rect.height) * junctionFactor;
        const halfJunction = junctionSize / 2;
        
        // Calculate responsive button size (proportional to junction)
        const buttonSize = Math.max(32, Math.round(junctionSize * 0.12));
        const fontSize = Math.max(14, Math.round(buttonSize * 0.5)); 
        
        // Calculate responsive padding from edge
        const edgePadding = Math.max(10, Math.round(rect.width * 0.01));
        
        // Apply responsive styling to all buttons
        Object.values(buttons).forEach(button => {
            button.innerHTML = "✏️";
            button.style.position = "absolute";
            button.style.opacity = "1";
            button.style.width = `${buttonSize}px`;
            button.style.height = `${buttonSize}px`;
            button.style.display = "flex";
            button.style.alignItems = "center";
            button.style.justifyContent = "center";
            button.style.fontSize = `${fontSize}px`;
            
            // These properties ensure expansion from center
            button.style.transform = "translate(-50%, -50%)";
        });
        
        // Position buttons with transform-friendly coordinates
        // When using transform: translate(-50%, -50%), we position based on the CENTER of the button
        
        // Add fixed adjustment values to fine-tune positions
        const topAdjust = 25;        // Move top buttons inward
        const rightAdjust = 10;      // Move right buttons inward
        const bottomAdjust = 0;      // Move bottom buttons inward (positive moves up)
        const leftAdjust = 35;        // Move left buttons inward (positive moves right)
        
        // Additional corner adjustments for North and East buttons
        const northRightOffset = 40; // Push North button more to the right
        const eastDownOffset = 30;   // Push East button more down
        
        // NORTH arm: top edge of canvas, aligned with right side of north road
        buttons['north'].style.left = `${centerX + halfJunction * 0.7 + northRightOffset}px`; // Added rightward shift
        buttons['north'].style.top = `${edgePadding + topAdjust}px`;
        
        // SOUTH arm: bottom edge of canvas, aligned with left side of south road
        buttons['south'].style.left = `${centerX - halfJunction * 0.65}px`;
        buttons['south'].style.top = `${rect.height - edgePadding + bottomAdjust}px`;
        buttons['south'].style.bottom = 'auto'; // Clear bottom property
        
        // EAST arm: right edge of canvas, aligned with bottom of east road
        buttons['east'].style.left = `${rect.width - edgePadding + rightAdjust}px`;
        buttons['east'].style.right = 'auto'; // Clear right property
        buttons['east'].style.top = `${centerY + halfJunction * 0.7 + eastDownOffset}px`; // Added downward shift
        
        // WEST arm: left edge of canvas, aligned with top of west road
        buttons['west'].style.left = `${edgePadding + leftAdjust}px`;
        buttons['west'].style.top = `${centerY - halfJunction * 0.7}px`;
    }
    
    
    setupHighDPICanvas(width, height) {
        // Set the canvas size in memory (scaled up)
        this.canvas.width = width * this.dpr;
        this.canvas.height = height * this.dpr;
        
        // Set the canvas CSS size
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        
        // Scale all drawing operations
        this.ctx.scale(this.dpr, this.dpr);
    }

    calculateLaneWidth(lanes) {
        return this.junctionSize / lanes;
    }

    draw() {
        console.log("Starting draw() with laneAttributes:", 
                JSON.stringify(this.laneAttributes));
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width / this.dpr, this.canvas.height / this.dpr);
        
        const centerX = (this.canvas.width / this.dpr) / 2;
        const centerY = (this.canvas.height / this.dpr) / 2;

        // Draw junction box background
        this.ctx.fillStyle = '#888888';  // White background
        this.ctx.fillRect(
            centerX - this.junctionSize/2,
            centerY - this.junctionSize/2,
            this.junctionSize,
            this.junctionSize
        );

        // Draw the roads
        this.drawRoads(centerX, centerY);

        // Draw junction box border
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.strokeRect(
            centerX - this.junctionSize/2,
            centerY - this.junctionSize/2,
            this.junctionSize,
            this.junctionSize
        );
    }

    drawRoads(centerX, centerY) {
        console.log("Starting drawRoads() with laneAttributes:", 
                JSON.stringify(this.laneAttributes));
        // Draw the base roads first
        this.drawBaseRoad('west', centerX, centerY);
        this.drawBaseRoad('east', centerX, centerY);
        this.drawBaseRoad('north', centerX, centerY);
        this.drawBaseRoad('south', centerX, centerY);
    
        // Then draw all zebra crossings
        this.drawAllCrossings(centerX, centerY);
        this.drawBusLanes(centerX, centerY); 
        console.log("About to call drawBikeLanes...");
        console.log("After calling drawBikeLanes...");
        this.drawBikeLanes(centerX, centerY);  
        this.drawPriorityBars(centerX, centerY);
    
        this.drawLaneArrows(centerX, centerY);
    }

    drawBaseRoad(direction, centerX, centerY) {
        const vertical = direction === 'north' || direction === 'south';
        const lanes = this[`${direction}boundLanes`];
        console.log("Lanes: ", lanes);
        const laneWidth = this.calculateLaneWidth(lanes);
        
        if (vertical) {
            this.drawRoadSegment(
                centerX,
                direction === 'north' ? centerY - this.junctionSize/2 : centerY + this.junctionSize/2,
                centerX,
                direction === 'north' ? 0 : this.canvas.height / this.dpr,
                lanes,
                true
            );
        } else {
            this.drawRoadSegment(
                direction === 'west' ? centerX - this.junctionSize/2 : centerX + this.junctionSize/2,
                centerY,
                direction === 'west' ? 0 : this.canvas.width / this.dpr,
                centerY,
                lanes,
                false
            );
        }
    }

    drawAllCrossings(centerX, centerY) {
        const directions = ['north', 'south', 'east', 'west'];  // Make sure these match exactly
        
        directions.forEach(direction => {
            const lanes = this[`${direction}boundLanes`];
            const laneWidth = this.calculateLaneWidth(lanes);
            const totalWidth = lanes * laneWidth;
            
            let x, y;
            
            switch(direction) {
                case 'north':
                    x = centerX - this.junctionSize/2;
                    y = centerY - this.junctionSize/2;
                    break;
                case 'south':
                    x = centerX - this.junctionSize/2;
                    y = centerY + this.junctionSize/2 - laneWidth;
                    break;
                case 'east':
                    x = centerX + this.junctionSize/2 - laneWidth;
                    y = centerY - this.junctionSize/2;
                    break;
                case 'west':
                    x = centerX - this.junctionSize/2;
                    y = centerY - this.junctionSize/2;
                    break;
            }
            
            this.drawZebraCrossing(x, y, totalWidth, laneWidth, direction);
        });
    }

    drawPriorityBars(centerX, centerY) {
        const directions = ['north', 'south', 'east', 'west'];
        
        directions.forEach(direction => {
            if (this.priorities[direction] === 0) return;  // Skip if no priority

            const rect = this.canvas.getBoundingClientRect();
            
            const lanes = this[`${direction}boundLanes`];
            const laneWidth = this.calculateLaneWidth(lanes);
            const totalWidth = lanes * laneWidth - 10;
            const barHeight = rect.height*0.1;  // Height of priority bar
            
            this.ctx.save();
            this.ctx.fillStyle = '#4a90e2';  // Priority bar color
            this.ctx.font = `${totalWidth*0.007}vw Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            let x, y;
            switch(direction) {
                case 'north':
                    x = centerX - totalWidth/2;
                    y = 0;  // At top edge
                    this.ctx.fillRect(x, y, totalWidth, barHeight);
                    this.ctx.fillStyle = 'white';
                    this.ctx.fillText(`⭐ Priority: ${this.priorities[direction]}`, x + totalWidth/2, y + barHeight/2);
                    break;
                case 'south':
                    x = centerX - totalWidth/2;
                    y = (this.canvas.height / this.dpr) - barHeight;  // At bottom edge
                    this.ctx.fillRect(x, y, totalWidth, barHeight);
                    this.ctx.fillStyle = 'white';
                    this.ctx.fillText(`⭐ Priority: ${this.priorities[direction]}`, x + totalWidth/2, y + barHeight/2);
                    break;
                case 'east':
                    x = (this.canvas.width / this.dpr) - barHeight;  // At right edge
                    y = centerY - totalWidth/2;
                    this.ctx.fillRect(x, y, barHeight, totalWidth);
                    this.ctx.save();
                    this.ctx.translate(x + barHeight/2, y + totalWidth/2);
                    this.ctx.rotate(Math.PI/2);
                    this.ctx.fillStyle = 'white';
                    this.ctx.fillText(`⭐ Priority: ${this.priorities[direction]}`, 0, 0);
                    this.ctx.restore();
                    break;
                case 'west':
                    x = 0;  // At left edge
                    y = centerY - totalWidth/2;
                    this.ctx.fillRect(x, y, barHeight, totalWidth);
                    this.ctx.save();
                    this.ctx.translate(x + barHeight/2, y + totalWidth/2);
                    this.ctx.rotate(Math.PI/2);
                    this.ctx.fillStyle = 'white';
                    this.ctx.fillText(`⭐ Priority: ${this.priorities[direction]}`, 0, 0);
                    this.ctx.restore();
                    break;
             }
            this.ctx.restore();
        });
    }

    drawLaneArrows(centerX, centerY) {
        const directions = ['north', 'south', 'east', 'west'];
        
        directions.forEach(direction => {
            // Only proceed if this direction has a left-turn attribute
            if (this.laneAttributes[direction] !== 'left-turn') return;
            
            const lanes = this[`${direction}boundLanes`];
            
            // Only draw if there are lanes
            if (lanes > 0) {
                const laneWidth = this.calculateLaneWidth(lanes);
                // Scale arrow size relative to lane width
                const arrowSize = laneWidth * 0.6;
                
                // Always draw the arrow in the leftmost lane (index 0)
                const laneIndex = 0;
                
                const center = this.getLaneCenters(centerX, centerY, lanes, direction === 'north' || direction === 'south')[laneIndex];
                let arrowX, arrowY, rotation;
                
                // Position arrows relative to junction size
                const arrowOffset = this.junctionSize * 0.4;  // Place arrows 1/4 of the way from junction
                
                switch(direction) {
                    case 'west':
                        arrowX = centerX - this.junctionSize/2 - arrowOffset;
                        arrowY = center.y;
                        rotation = Math.PI/2;
                        break;
                    case 'east':
                        arrowX = centerX + this.junctionSize/2 + arrowOffset;
                        arrowY = center.y;
                        rotation = -Math.PI/2;
                        break;
                    case 'north':
                        arrowX = center.x;
                        arrowY = centerY - this.junctionSize/2 - arrowOffset;
                        rotation = Math.PI;
                        break;
                    case 'south':
                        arrowX = center.x;
                        arrowY = centerY + this.junctionSize/2 + arrowOffset;
                        rotation = 0;
                        break;
                }
        
                this.ctx.save();
                this.ctx.translate(arrowX, arrowY);
                this.ctx.rotate(rotation);
                
                // Draw the arrow image
                // Calculate dimensions based on arrowSize
                const arrowWidth = arrowSize;
                const arrowHeight = arrowSize;
                
                // Draw image centered at the position
                console.log("drawing arrow")
                this.ctx.drawImage(
                    this.arrowImage,
                    -arrowWidth / 2,  // Center horizontally
                    -arrowHeight / 2, // Center vertically
                    arrowWidth,
                    arrowHeight
                );
                
                this.ctx.restore();
            }
        });
    }

    /**
     * Sets the attribute for the leftmost lane of a specific direction
     * @param {string} direction - The direction ('north', 'south', 'east', 'west')
     * @param {string|null} attributeType - The attribute type ('left-turn', 'bus', 'bike', or null)
     */
    setLaneAttribute(direction, attributeType) {
        if (!['north', 'south', 'east', 'west'].includes(direction)) {
            console.warn(`Invalid direction: ${direction}`);
            return;
        }
        
        if (attributeType !== null && !['left-turn', 'bus', 'bike'].includes(attributeType)) {
            console.warn(`Invalid attribute type: ${attributeType}`);
            return;
        }
        
        this.laneAttributes[direction] = attributeType;
        this.draw(); // Redraw the junction with updated attributes
    }

    getLaneCenters(startX, startY, lanes, vertical = false) {
        const laneWidth = this.calculateLaneWidth(lanes);
        const offset = this.junctionSize / 2;
        const centers = [];
        
        for(let i = 0; i < lanes; i++) {
            if(vertical) {
                centers.push({
                    x: startX - offset + (i + 0.5) * laneWidth,
                    y: startY
                });
            } else {
                centers.push({
                    x: startX,
                    y: startY - offset + (i + 0.5) * laneWidth
                });
            }
        }
        return centers;
    }

    calculateLaneNumber(laneIndex, totalLanes) {
        return totalLanes - laneIndex;
    }

    drawRoadSegment(x1, y1, x2, y2, lanes, vertical = false) {
        const offset = this.junctionSize / 2;
        const laneWidth = this.calculateLaneWidth(lanes);
        const roadWidth = this.junctionSize;
        
        this.ctx.save();
        
        // Draw road surface (gray asphalt)
        this.ctx.fillStyle = '#888888'; // Medium gray for asphalt
        this.ctx.beginPath();
        
        if (vertical) {
            this.ctx.rect(x1 - offset, y1, roadWidth, y2 - y1);
        } else {
            this.ctx.rect(x1, y1 - offset, x2 - x1, roadWidth);
        }
        this.ctx.fill();
        
        // Draw road boundaries (solid black lines)
        this.ctx.lineWidth = 10;
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#ffffff';
    
        if (vertical) {
            this.ctx.moveTo(x1 - offset, y1);
            this.ctx.lineTo(x2 - offset, y2);
            this.ctx.moveTo(x1 + offset, y1);
            this.ctx.lineTo(x2 + offset, y2);
        } else {
            this.ctx.moveTo(x1, y1 - offset);
            this.ctx.lineTo(x2, y2 - offset);
            this.ctx.moveTo(x1, y1 + offset);
            this.ctx.lineTo(x2, y2 + offset);
        }
        this.ctx.stroke();
    
        // Draw lane dividers (white dashed lines)
        this.ctx.strokeStyle = '#FFFFFF'; // White for lane dividers
        this.ctx.lineWidth = 1.5;
        // UK motorway style has longer dashes than default
        this.ctx.setLineDash([10, 15]); // Adjusted for scale - longer dash, longer gap
        
        for (let i = 1; i < lanes; i++) {
            this.ctx.beginPath();
            if (vertical) {
                const x = x1 - offset + i * laneWidth;
                this.ctx.moveTo(x, y1);
                this.ctx.lineTo(x, y2);
            } else {
                const y = y1 - offset + i * laneWidth;
                this.ctx.moveTo(x1, y);
                this.ctx.lineTo(x2, y);
            }
            this.ctx.stroke();
        }
        
        this.ctx.setLineDash([]);
        this.ctx.restore();
    }

    drawBusLanes(centerX, centerY) {
        const directions = ['north', 'south', 'east', 'west'];
        
        directions.forEach(direction => {
            // Only proceed if this direction has a bus attribute
            if (this.laneAttributes[direction] !== 'bus') return;
            
            const lanes = this[`${direction}boundLanes`];
            
            // Only draw if there are lanes
            if (lanes > 0) {
                const laneWidth = this.calculateLaneWidth(lanes);
                const busSize = laneWidth * 0.4;
                
                // Always draw in the leftmost lane (index 0)
                const laneIndex = 0;
                
                const center = this.getLaneCenters(centerX, centerY, lanes, direction === 'north' || direction === 'south')[laneIndex];
                let busX, busY, rotation;
                
                const busOffset = this.junctionSize * 0.35;
                
                switch(direction) {
                    case 'west':
                        busX = centerX - this.junctionSize/2 - busOffset;
                        busY = center.y;
                        rotation = Math.PI/2;
                        break;
                    case 'east':
                        busX = centerX + this.junctionSize/2 + busOffset;
                        busY = center.y;
                        rotation = -Math.PI/2;
                        break;
                    case 'north':
                        busX = center.x;
                        busY = centerY - this.junctionSize/2 - busOffset;
                        rotation = Math.PI;
                        break;
                    case 'south':
                        busX = center.x;
                        busY = centerY + this.junctionSize/2 + busOffset;
                        rotation = 0;
                        break;
                }
    
                this.ctx.save();
                this.ctx.translate(busX, busY);
                this.ctx.rotate(rotation);
                this.ctx.font = `${busSize}px FontAwesome`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillStyle = 'white';
                this.ctx.fillText('BUS', 0, 0); // FontAwesome icon for bus
                this.ctx.restore();
            }
        });
    }

    drawBikeLanes(centerX, centerY) {
        console.log("Starting drawBikeLanes() with laneAttributes:", 
                JSON.stringify(this.laneAttributes));
    
        const directions = ['north', 'south', 'east', 'west'];
        
        directions.forEach(direction => {
            console.log(`Checking if ${direction} has bike attribute:`, 
                        this.laneAttributes[direction] === 'bike');
            
            // Only proceed if this direction has a bike attribute
            if (this.laneAttributes[direction] !== 'bike') return;
            
            console.log(`${direction} has bike attribute, rendering...`);
            
            const lanes = this[`${direction}boundLanes`];
            
            // Only draw if there are lanes
            if (lanes > 0) {
                const laneWidth = this.calculateLaneWidth(lanes);
                const bikeSize = laneWidth * 0.6;
                
                // Always draw in the leftmost lane (index 0)
                const laneIndex = 0;
                
                const center = this.getLaneCenters(centerX, centerY, lanes, direction === 'north' || direction === 'south')[laneIndex];
                let bikeX, bikeY, rotation;
                
                const bikeOffset = this.junctionSize * 0.35;
                
                switch(direction) {
                    case 'west':
                        bikeX = centerX - this.junctionSize/2 - bikeOffset;
                        bikeY = center.y;
                        rotation = Math.PI/2;
                        break;
                    case 'east':
                        bikeX = centerX + this.junctionSize/2 + bikeOffset;
                        bikeY = center.y;
                        rotation = -Math.PI/2;
                        break;
                    case 'north':
                        bikeX = center.x;
                        bikeY = centerY - this.junctionSize/2 - bikeOffset;
                        rotation = Math.PI;
                        break;
                    case 'south':
                        bikeX = center.x;
                        bikeY = centerY + this.junctionSize/2 + bikeOffset;
                        rotation = 0;
                        break;
                }
    
                this.ctx.save();
                this.ctx.translate(bikeX, bikeY);
                this.ctx.rotate(rotation);
                this.ctx.font = `${bikeSize}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillStyle = 'white';
                this.ctx.fillText('Bike', 0, 0); // FontAwesome icon for bicycle
                this.ctx.restore();
            }
        });
    }

    // Class method for debouncing
    debounce(func, delay) {
        let timeoutId;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function() {
                func.apply(context, args);
            }, delay);
        };
    }
    
    // The actual resize handler
    handleResize() {
        const rect = this.canvas.getBoundingClientRect();
        this.dpr = window.devicePixelRatio || 1;
        this.setupHighDPICanvas(rect.width, rect.height);
        
        // Junction dimensions
        this.junctionSize = Math.min(rect.width, rect.height) * junctionFactor;

        this.setupFixedButtonPositions();  // Removed duplicate call
        this.setupNavigationListeners();
        
        // Initial draw
        this.draw();
        console.log("Resized");
    }

    setupNavigationListeners() {
        // Edit buttons listeners
        const directions = ['North', 'South', 'East', 'West'];
        directions.forEach(direction => {
            const button = document.getElementById(`edit${direction}`);
            button.addEventListener('click', () => this.showEditor(direction.toLowerCase()));
        });
    
        // Editor action buttons listeners
        const applyButton = document.querySelector('.btn-success.action-button');
        const cancelButton = document.querySelector('.btn-danger.action-button');
        
        applyButton.addEventListener('click', () => this.applyChanges());
        cancelButton.addEventListener('click', () => this.cancelChanges());
        this.handleResize = this.handleResize.bind(this);
        this.debouncedResize = this.debounce(this.handleResize, 250);
        
        // Set up event listener
        window.addEventListener('resize', this.debouncedResize);
    
        // Add puffin state handler
        window.updatePuffinState = (isActive) => {
            this.puffinCrossings[this.currentDirection] = isActive;
            this.draw();
        };
    }

    showEditor(direction) {
        this.currentDirection = direction;
        document.getElementById('main-view').style.opacity = '0';
        document.getElementById('main-view').style.pointerEvents = 'none';
        document.getElementById('editor-view').style.opacity = '1';
        document.getElementById('editor-view').style.pointerEvents = 'auto';
        
        // Initialize editor with current lane configuration
        window.initializeEditorUI?.({
            lanes: this[`${direction}boundLanes`],
            leftLaneAttribute: this.laneAttributes[direction],  // Pass the current lane attribute
            puffinActive: this.puffinCrossings[direction],
            priority: this.priorities[direction]
        });
    
        const directionLabel = document.getElementById('directionLabel');
        if (directionLabel) {
            // Capitalize first letter of direction
            directionLabel.textContent = direction.charAt(0).toUpperCase() + direction.slice(1);
        }

        const editorDirectionLabel = document.getElementById('editorDirectionLabel');
        if (editorDirectionLabel) {
            editorDirectionLabel.textContent = direction.charAt(0).toUpperCase() + direction.slice(1);
        }
    }

    hideEditor() {
        document.getElementById('editor-view').style.opacity = '0';
        document.getElementById('editor-view').style.pointerEvents = 'none';
        document.getElementById('main-view').style.opacity = '1';
        document.getElementById('main-view').style.pointerEvents = 'auto';
        this.currentDirection = null;
    }

    applyChanges() {
        // Get the current configuration from the editor
        const newConfig = this.getEditorConfiguration();
        
        // Debug logging
        console.log(`Applying changes for ${this.currentDirection} direction:`);
        console.log(`- Priority: ${newConfig.priority}`);
        console.log(`- Puffin: ${newConfig.puffinActive}`);
        console.log(`- Lanes: ${newConfig.lanes}`);
        console.log(`- Lane attribute: ${newConfig.leftLaneAttribute}`);
        
        // Update the appropriate direction's configuration
        this.puffinCrossings[this.currentDirection] = newConfig.puffinActive;
        this.laneAttributes[this.currentDirection] = newConfig.leftLaneAttribute;
        // ...rest of method...
        // Add debug for priority before and after
        console.log(`Priority before: ${this.priorities[this.currentDirection]}`);
        this.priorities[this.currentDirection] = newConfig.priority;
        console.log(`Priority after: ${this.priorities[this.currentDirection]}`);
    
        switch(this.currentDirection) {
            case 'north':
                this.northboundLanes = newConfig.lanes;
                break;
            case 'south':
                this.southboundLanes = newConfig.lanes;
                break;
            case 'east':
                this.eastboundLanes = newConfig.lanes;
                break;
            case 'west':
                this.westboundLanes = newConfig.lanes;
                break;
        }
    
        // Redraw the junction with new configuration
        this.draw();
        this.hideEditor();
    }

    cancelChanges() {
        this.hideEditor();
    }

    initializeEditor(direction) {
        // Get current configuration for the direction
        const config = {
            lanes: this[`${direction}boundLanes`],
            leftTurnLanes: this.leftTurnLanes[direction]
        };

        // Update editor UI to reflect current configuration
        // This should be implemented in editorScript.js
        window.initializeEditorUI?.(config);
    }

    getEditorConfiguration() {
        // Simply return whatever the editor's getEditorConfiguration returns
        return window.getEditorConfiguration();
    }

}

(function extendJunctionSimulation() {
    // Add priority methods to JunctionSimulation prototype
    JunctionSimulation.prototype.setPriority = function(direction, priority) {
        if (this.priorities && typeof priority === 'number' && priority >= 0 && priority <= 4) {
            this.priorities[direction] = priority;
            this.draw();
        }
    };
    
    JunctionSimulation.prototype.getPriority = function(direction) {
        return this.priorities[direction] || 0;
    };
    
    // Completely replace the applyChanges method
    JunctionSimulation.prototype.applyChanges = function() {
        // Get the current configuration from the editor
        const newConfig = this.getEditorConfiguration();
        
        // Debug logging
        console.log(`Applying changes for ${this.currentDirection} direction:`);
        console.log(`- Priority: ${newConfig.priority}`);
        console.log(`- Puffin: ${newConfig.puffinActive}`);
        console.log(`- Lanes: ${newConfig.lanes}`);
        console.log(`- Lane attribute: ${newConfig.leftLaneAttribute}`);
        
        // Update the appropriate direction's configuration
        this.puffinCrossings[this.currentDirection] = newConfig.puffinActive;
        this.laneAttributes[this.currentDirection] = newConfig.leftLaneAttribute;
        this.priorities[this.currentDirection] = newConfig.priority;

        console.log("After setting in applyChanges, laneAttributes is:", 
            JSON.stringify(this.laneAttributes));
        
        // Update lane count
        switch(this.currentDirection) {
            case 'north':
                this.northboundLanes = newConfig.lanes;
                break;
            case 'south':
                this.southboundLanes = newConfig.lanes;
                break;
            case 'east':
                this.eastboundLanes = newConfig.lanes;
                break;
            case 'west':
                this.westboundLanes = newConfig.lanes;
                break;
        }
        
        // Redraw the junction with new configuration
        this.draw();
        this.hideEditor();
    };
})();

const simulation = new JunctionSimulation('junctionCanvas');