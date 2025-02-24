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
        this.westboundLanes = 2;
        this.eastboundLanes = 2;
        this.northboundLanes = 2;
        this.southboundLanes = 2;
    
        // Direction state
        this.currentDirection = null;
    
        // Traffic light states
        this.trafficLights = {
            west: Array(this.westboundLanes).fill('red'),
            east: Array(this.eastboundLanes).fill('red'),
            north: Array(this.northboundLanes).fill('red'),
            south: Array(this.southboundLanes).fill('red')
        };

        this.busLanes = {
            north: [],
            south: [],
            east: [],
            west: []
        };
    
        // Lane configurations
        this.leftTurnLanes = {
            west: [],
            east: [],
            north: [],
            south: []
        };
    
        // Puffin crossing states
        this.puffinCrossings = {
            north: false,
            south: false,
            east: false,
            west: false
        };

        // Add alongside other state objects
        this.priorities = {
            north: 0,  // 0 means no priority
            south: 0,
            east: 0,
            west: 0
        };
            
        // Image resources
        this.busImage = new Image();
        this.busImage.src = 'BUS.png';

        this.leftArrow = new Image();
        this.leftArrow.src = 'leftarrow.png';
        
        this.zebraCrossing = new Image();
        this.zebraCrossing.src = 'zebra.png';
        this.zebraCrossing.onload = () => {
            this.draw();
        };
    
        // Setup event handlers
        this.setupEventListeners();
        this.setupHoverDetection();  // Removed duplicate call
        this.setupNavigationListeners();
        
        // Initial draw
        this.draw();
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

    setupEventListeners() {
        document.getElementById('increaseBtn').addEventListener('click', () => {
            if (this.westboundLanes < 5) {
                this.westboundLanes++;
                this.draw();
            }
        });
    
        document.getElementById('decreaseBtn').addEventListener('click', () => {
            if (this.westboundLanes > 1) {
                this.westboundLanes--;
                this.draw();
            }
        });
    }

    setupHoverDetection() {
        const buttons = {
            north: document.getElementById('editNorth'),
            south: document.getElementById('editSouth'),
            east: document.getElementById('editEast'),
            west: document.getElementById('editWest')
        };
        
        const hoverStates = {
            north: false,
            south: false,
            east: false,
            west: false
        };
    
        const junctionFactor = 0.4;
    
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate dimensions consistently with main drawing
            const canvasMin = Math.min(rect.width, rect.height);
            const halfJunction = (canvasMin * junctionFactor) / 2;
            const roadWidth = halfJunction;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
    
            ['north', 'south', 'east', 'west'].forEach(direction => {
                const button = buttons[direction];
                const buttonRect = button.getBoundingClientRect();
                
                // Define hover zones based on direction
                let inArmArea = false;
                let buttonX = 0;
                let buttonY = 0;
                
                switch(direction) {
                    case 'north':
                        inArmArea = 
                            x >= centerX - roadWidth && 
                            x <= centerX + roadWidth &&
                            y <= centerY - halfJunction;
                        buttonX = rect.left + centerX + roadWidth + (halfJunction * 0.1);
                        buttonY = rect.top + (centerY - halfJunction) / 2;
                        break;
                    case 'south':
                        inArmArea = 
                            x >= centerX - roadWidth && 
                            x <= centerX + roadWidth &&
                            y >= centerY + halfJunction;
                        buttonX = rect.left + centerX + roadWidth + (halfJunction * 0.1);
                        buttonY = rect.top + centerY + halfJunction + (halfJunction * 0.5);
                        break;
                    case 'east':
                        inArmArea = 
                            x >= centerX + halfJunction &&
                            y >= centerY - roadWidth && 
                            y <= centerY + roadWidth;
                        buttonX = rect.left + centerX + halfJunction + (halfJunction * 0.5);
                        buttonY = rect.top + centerY + roadWidth + (halfJunction * 0.1);
                        break;
                    case 'west':
                        inArmArea = 
                            x <= centerX - halfJunction &&
                            y >= centerY - roadWidth && 
                            y <= centerY + roadWidth;
                        buttonX = rect.left + centerX - halfJunction - (halfJunction * 0.5);
                        buttonY = rect.top + centerY - roadWidth - (halfJunction * 0.1);
                        break;
                }
    
                // Check if mouse is on the button
                const inButtonArea = 
                    e.clientX >= buttonRect.left && 
                    e.clientX <= buttonRect.right &&
                    e.clientY >= buttonRect.top && 
                    e.clientY <= buttonRect.bottom;
    
                // Create corridor check based on direction
                const padding = halfJunction * 0.1; // Scale padding with junction size
                let inCorridor = false;
                
                switch(direction) {
                    case 'north':
                        inCorridor = 
                            e.clientX >= buttonRect.left - padding &&
                            e.clientX <= buttonRect.right &&
                            e.clientY >= buttonRect.top - padding &&
                            e.clientY <= rect.top + centerY;
                        break;
                    case 'south':
                        inCorridor = 
                            e.clientX >= buttonRect.left - padding &&
                            e.clientX <= buttonRect.right &&
                            e.clientY >= rect.top + centerY &&
                            e.clientY <= buttonRect.bottom + padding;
                        break;
                    case 'east':
                        inCorridor = 
                            e.clientX >= rect.left + centerX &&
                            e.clientX <= buttonRect.right + padding &&
                            e.clientY >= buttonRect.top - padding &&
                            e.clientY <= buttonRect.bottom;
                        break;
                    case 'west':
                        inCorridor = 
                            e.clientX >= buttonRect.left - padding &&
                            e.clientX <= rect.left + centerX &&
                            e.clientY >= buttonRect.top - padding &&
                            e.clientY <= buttonRect.bottom;
                        break;
                }
    
                if (inArmArea || inButtonArea || inCorridor) {
                    button.style.left = `${buttonX}px`;
                    button.style.top = `${buttonY}px`;
                    button.classList.add('visible');
                    hoverStates[direction] = true;
                } else {
                    hoverStates[direction] = false;
                    setTimeout(() => {
                        if (!hoverStates[direction]) {
                            button.classList.remove('visible');
                        }
                    }, 100);
                }
            });
        });
    
        // Button hover handlers
        Object.entries(buttons).forEach(([direction, button]) => {
            button.addEventListener('mouseenter', () => {
                hoverStates[direction] = true;
                button.classList.add('visible');
            });
    
            button.addEventListener('mouseleave', () => {
                hoverStates[direction] = false;
                setTimeout(() => {
                    if (!hoverStates[direction]) {
                        button.classList.remove('visible');
                    }
                }, 100);
            });
        });
    
        this.canvas.addEventListener('mouseleave', () => {
            Object.entries(hoverStates).forEach(([direction]) => {
                hoverStates[direction] = false;
                setTimeout(() => {
                    if (!hoverStates[direction]) {
                        buttons[direction].classList.remove('visible');
                    }
                }, 100);
            });
        });
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
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width / this.dpr, this.canvas.height / this.dpr);
        
        const centerX = (this.canvas.width / this.dpr) / 2;
        const centerY = (this.canvas.height / this.dpr) / 2;

        // Draw junction box background
        this.ctx.fillStyle = '#ffffff';  // White background
        this.ctx.fillRect(
            centerX - this.junctionSize/2,
            centerY - this.junctionSize/2,
            this.junctionSize,
            this.junctionSize
        );

        // Draw the roads
        this.drawRoads(centerX, centerY);

        // Draw junction box border
        this.ctx.strokeStyle = '#000';
        this.ctx.strokeRect(
            centerX - this.junctionSize/2,
            centerY - this.junctionSize/2,
            this.junctionSize,
            this.junctionSize
        );
    }

    drawRoads(centerX, centerY) {
        // Draw the base roads first
        this.drawBaseRoad('west', centerX, centerY);
        this.drawBaseRoad('east', centerX, centerY);
        this.drawBaseRoad('north', centerX, centerY);
        this.drawBaseRoad('south', centerX, centerY);
    
        // Then draw all zebra crossings
        this.drawAllCrossings(centerX, centerY);  // Remove the if condition
        this.drawBusLanes(centerX, centerY); 
        this.drawPriorityBars(centerX, centerY);
    
        // Finally draw traffic lights and arrows
        this.drawTrafficLights(centerX, centerY, 'west', this.westboundLanes);
        this.drawTrafficLights(centerX, centerY, 'east', this.eastboundLanes);
        this.drawTrafficLights(centerX, centerY, 'north', this.northboundLanes);
        this.drawTrafficLights(centerX, centerY, 'south', this.southboundLanes);
    
        this.drawLaneArrows(centerX, centerY, 'west', this.westboundLanes);
        this.drawLaneArrows(centerX, centerY, 'east', this.eastboundLanes);
        this.drawLaneArrows(centerX, centerY, 'north', this.northboundLanes);
        this.drawLaneArrows(centerX, centerY, 'south', this.southboundLanes);
    }

    drawBaseRoad(direction, centerX, centerY) {
        const vertical = direction === 'north' || direction === 'south';
        const lanes = this[`${direction}boundLanes`];
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
            
            const lanes = this[`${direction}boundLanes`];
            const laneWidth = this.calculateLaneWidth(lanes);
            const totalWidth = lanes * laneWidth;
            const barHeight = laneWidth * 0.3;  // Height of priority bar
            
            this.ctx.save();
            this.ctx.fillStyle = '#4a90e2';  // Priority bar color
            this.ctx.font = `${barHeight * 0.6}px Arial`;
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

    drawLaneArrows(x, y, direction, lanes) {
        const laneWidth = this.calculateLaneWidth(lanes);
        // Scale arrow size relative to lane width
        const arrowSize = laneWidth * 0.6;
        
        this.leftTurnLanes[direction].forEach(laneIndex => {
            if (laneIndex >= lanes) return;
            
            const center = this.getLaneCenters(x, y, lanes, direction === 'north' || direction === 'south')[laneIndex];
            let arrowX, arrowY, rotation;
            
            // Position arrows relative to junction size
            const arrowOffset = this.junctionSize * 0.25;  // Place arrows 1/4 of the way from junction
            
            switch(direction) {
                case 'west':
                    arrowX = x - this.junctionSize/2 - arrowOffset;
                    arrowY = center.y;
                    rotation = Math.PI/2;
                    break;
                case 'east':
                    arrowX = x + this.junctionSize/2 + arrowOffset;
                    arrowY = center.y;
                    rotation = -Math.PI/2;
                    break;
                case 'north':
                    arrowX = center.x;
                    arrowY = y - this.junctionSize/2 - arrowOffset;
                    rotation = Math.PI;
                    break;
                case 'south':
                    arrowX = center.x;
                    arrowY = y + this.junctionSize/2 + arrowOffset;
                    rotation = 0;
                    break;
            }

            this.ctx.save();
            this.ctx.translate(arrowX, arrowY);
            this.ctx.rotate(rotation);
            this.ctx.drawImage(
                this.leftArrow,
                -arrowSize/2,
                -arrowSize/2,
                arrowSize,
                arrowSize
            );
            this.ctx.restore();
        });
    }

    drawLaneNumber(x, y, number) {
        // Scale font size relative to junction size
        const fontSize = Math.max(14, this.junctionSize * 0.03);
        this.ctx.font = `${fontSize}px Arial`;
        this.ctx.fillStyle = '#000';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(number.toString(), x, y);
    }

    setLeftTurnLane(direction, laneIndex, enabled) {
        if (enabled) {
            if (!this.leftTurnLanes[direction].includes(laneIndex)) {
                this.leftTurnLanes[direction].push(laneIndex);
            }
        } else {
            this.leftTurnLanes[direction] = this.leftTurnLanes[direction].filter(i => i !== laneIndex);
        }
        this.draw();
    }

    drawTrafficLights(x, y, direction, lanes) {
        const laneWidth = this.calculateLaneWidth(lanes);
        const stripWidth = laneWidth;  // Fixed width
        const stripLength = 10;
        
        const centers = this.getLaneCenters(x, y, lanes, direction === 'north' || direction === 'south');
        
        centers.forEach((center, index) => {
            const lightColor = this.trafficLights[direction][index];
            this.ctx.fillStyle = lightColor;
            
            // Position strips based on direction
            switch(direction) {
                case 'west':
                    this.ctx.fillRect(
                        x - this.junctionSize/2 - stripLength,
                        center.y - stripWidth/2,
                        stripLength,
                        stripWidth
                    );
                    break;
                case 'east':
                    this.ctx.fillRect(
                        x + this.junctionSize/2,
                        center.y - stripWidth/2,
                        stripLength,
                        stripWidth
                    );
                    break;
                case 'north':
                    this.ctx.fillRect(
                        center.x - stripWidth/2,
                        y - this.junctionSize/2 - stripLength,
                        stripWidth,
                        stripLength
                    );
                    break;
                case 'south':
                    this.ctx.fillRect(
                        center.x - stripWidth/2,
                        y + this.junctionSize/2,
                        stripWidth,
                        stripLength
                    );
                    break;
            }
        });
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

    updateTrafficLight(direction, laneIndex, color) {
        if (this.trafficLights[direction] && 
            laneIndex < this.trafficLights[direction].length) {
            this.trafficLights[direction][laneIndex] = color;
            this.draw();
        }
    }

    drawRoadSegment(x1, y1, x2, y2, lanes, vertical = false) {
        const offset = this.junctionSize / 2;
        const laneWidth = this.calculateLaneWidth(lanes);
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;

        // Draw road boundaries
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#000';

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

        // Draw lane dividers
        this.ctx.setLineDash([5, 5]);
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

        // Draw lane numbers with black text
        const centers = this.getLaneCenters(midX, midY, lanes, vertical);
        this.ctx.fillStyle = '#000';  // Ensure text is black
        centers.forEach((center, index) => {
            this.drawLaneNumber(center.x, center.y, this.calculateLaneNumber(index, lanes));
        });
    }

    drawBusLanes(centerX, centerY) {
        const directions = ['north', 'south', 'east', 'west'];
        
        directions.forEach(direction => {
            const lanes = this[`${direction}boundLanes`];
            const laneWidth = this.calculateLaneWidth(lanes);
            const busWidth = laneWidth * 0.6;
            
            // Calculate height maintaining aspect ratio
            const aspectRatio = this.busImage.naturalHeight / this.busImage.naturalWidth;
            const busHeight = busWidth * aspectRatio;
            
            this.busLanes[direction].forEach(laneIndex => {
                if (laneIndex >= lanes) return;
                
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
                this.ctx.drawImage(
                    this.busImage,
                    -busWidth/2,   // center horizontally
                    -busHeight/2,  // center vertically
                    busWidth,
                    busHeight
                );
                this.ctx.restore();
            });
        });
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
            leftTurnLanes: this.leftTurnLanes[direction],
            puffinActive: this.puffinCrossings[direction],
            busLanes: this.busLanes[direction],
            priority: this.priorities[direction]
        });
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
        
        // Update the appropriate direction's configuration
        this.puffinCrossings[this.currentDirection] = newConfig.puffinActive;
        this.busLanes[this.currentDirection] = newConfig.busLanes;
        this.priorities[this.currentDirection] = newConfig.priority;
    
        switch(this.currentDirection) {
            case 'north':
                this.northboundLanes = newConfig.lanes;
                this.leftTurnLanes.north = newConfig.leftTurnLanes;
                break;
            case 'south':
                this.southboundLanes = newConfig.lanes;
                this.leftTurnLanes.south = newConfig.leftTurnLanes;
                break;
            case 'east':
                this.eastboundLanes = newConfig.lanes;
                this.leftTurnLanes.east = newConfig.leftTurnLanes;
                break;
            case 'west':
                this.westboundLanes = newConfig.lanes;
                this.leftTurnLanes.west = newConfig.leftTurnLanes;
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



const simulation = new JunctionSimulation('junctionCanvas');
simulation.updateTrafficLight('west', 0, 'green');  // Set first westbound lane to green
simulation.setLeftTurnLane('west', 0, true);