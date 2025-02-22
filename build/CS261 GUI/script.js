const junctionFactor = 0.4;

class JunctionSimulation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Get the computed size from CSS
        const rect = this.canvas.getBoundingClientRect();
        
        // Handle high-DPI displays
        this.dpr = window.devicePixelRatio || 1;
        
        // Setup canvas with the actual viewport size
        this.setupHighDPICanvas(rect.width, rect.height);
        
        // Make junction size responsive to canvas size
        this.junctionSize = Math.min(rect.width, rect.height) * junctionFactor;
        
        // Initialize lanes
        this.westboundLanes = 2;
        this.eastboundLanes = 2;
        this.northboundLanes = 2;
        this.southboundLanes = 2;
    
        // Initialize traffic lights
        this.trafficLights = {
            west: Array(this.westboundLanes).fill('red'),
            east: Array(this.eastboundLanes).fill('red'),
            north: Array(this.northboundLanes).fill('red'),
            south: Array(this.southboundLanes).fill('red')
        };
    
        this.leftArrow = new Image();
        this.leftArrow.src = 'leftarrow.png';
        this.leftTurnLanes = {
            west: [],
            east: [],
            north: [],
            south: []
        };
    
        // Add hover detection for edit button
        this.setupHoverDetection();
        
        // Initial draw
        this.draw();
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
        // Clear with proper dimensions accounting for DPR
        this.ctx.clearRect(0, 0, this.canvas.width / this.dpr, this.canvas.height / this.dpr);
        
        const centerX = (this.canvas.width / this.dpr) / 2;
        const centerY = (this.canvas.height / this.dpr) / 2;

        this.drawRoads(centerX, centerY);
        
        // Draw junction box
        this.ctx.strokeStyle = '#000';
        this.ctx.strokeRect(
            centerX - this.junctionSize/2,
            centerY - this.junctionSize/2,
            this.junctionSize,
            this.junctionSize
        );
    }

    drawRoads(centerX, centerY) {
        // West road
        this.drawRoadSegment(
            centerX - this.junctionSize/2, centerY,
            0, centerY,  // Extend to canvas edge
            this.westboundLanes
        );

        // East road
        this.drawRoadSegment(
            centerX + this.junctionSize/2, centerY,
            this.canvas.width / this.dpr, centerY,  // Account for DPR
            this.eastboundLanes
        );

        // North road
        this.drawRoadSegment(
            centerX, centerY - this.junctionSize/2,
            centerX, 0,
            this.northboundLanes,
            true
        );

        // South road
        this.drawRoadSegment(
            centerX, centerY + this.junctionSize/2,
            centerX, this.canvas.height / this.dpr,  // Account for DPR
            this.southboundLanes,
            true
        );

        // Draw traffic lights and arrows
        this.drawTrafficLights(centerX, centerY, 'west', this.westboundLanes);
        this.drawTrafficLights(centerX, centerY, 'east', this.eastboundLanes);
        this.drawTrafficLights(centerX, centerY, 'north', this.northboundLanes);
        this.drawTrafficLights(centerX, centerY, 'south', this.southboundLanes);

        this.drawLaneArrows(centerX, centerY, 'west', this.westboundLanes);
        this.drawLaneArrows(centerX, centerY, 'east', this.eastboundLanes);
        this.drawLaneArrows(centerX, centerY, 'north', this.northboundLanes);
        this.drawLaneArrows(centerX, centerY, 'south', this.southboundLanes);
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

        // Use scaled line width for sharper lines
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

        // Draw lane numbers
        const centers = this.getLaneCenters(midX, midY, lanes, vertical);
        centers.forEach((center, index) => {
            // Draw number 3 in each lane
            this.drawLaneNumber(center.x, center.y, 3);
        });
    }
}



const simulation = new JunctionSimulation('junctionCanvas');
simulation.updateTrafficLight('west', 0, 'green');  // Set first westbound lane to green
simulation.setLeftTurnLane('west', 0, true);