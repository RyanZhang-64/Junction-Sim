class JunctionSimulation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.junctionSize = 200;
        
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

        this.setupEventListeners();
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

    calculateLaneWidth(lanes) {
        return this.junctionSize / lanes;
    }

    drawLaneNumber(x, y, number) {
        this.ctx.font = '14px Arial';
        this.ctx.fillStyle = '#000';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(number.toString(), x, y);
    }

    drawLaneArrows(x, y, direction, lanes) {
        const laneWidth = this.calculateLaneWidth(lanes);
        const arrowSize = laneWidth * 0.6;
        
        this.leftTurnLanes[direction].forEach(laneIndex => {
            if (laneIndex >= lanes) return; // Skip if lane doesn't exist
            
            const center = this.getLaneCenters(x, y, lanes, direction === 'north' || direction === 'south')[laneIndex];
            let arrowX, arrowY, rotation;
            
            switch(direction) {
                case 'west':
                    arrowX = x - this.junctionSize*(3/4); // 1/4 depth
                    arrowY = center.y;
                    rotation = Math.PI/2;
                    break;
                case 'east':
                    arrowX = x + this.junctionSize*(3/4);
                    arrowY = center.y;
                    rotation = -Math.PI/2;
                    break;
                case 'north':
                    arrowX = center.x;
                    arrowY = y - this.junctionSize*(3/4);
                    rotation = Math.PI;
                    break;
                case 'south':
                    arrowX = center.x;
                    arrowY = y + this.junctionSize*(3/4);
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

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        this.drawRoads(centerX, centerY);
        
        this.ctx.strokeStyle = '#000';
        this.ctx.strokeRect(
            centerX - this.junctionSize/2,
            centerY - this.junctionSize/2,
            this.junctionSize,
            this.junctionSize
        );
    }

    drawRoads(centerX, centerY) {
        this.drawRoadSegment(
            centerX - this.junctionSize/2, centerY,
            0, centerY,
            this.westboundLanes
        );

        this.drawRoadSegment(
            centerX + this.junctionSize/2, centerY,
            this.canvas.width - 0, centerY,
            this.eastboundLanes
        );

        this.drawRoadSegment(
            centerX, centerY - this.junctionSize/2,
            centerX, 0,
            this.northboundLanes,
            true
        );

        this.drawRoadSegment(
            centerX, centerY + this.junctionSize/2,
            centerX, this.canvas.height - 0,
            this.southboundLanes,
            true
        );

        this.drawTrafficLights(centerX, centerY, 'west', this.westboundLanes);
        this.drawTrafficLights(centerX, centerY, 'east', this.eastboundLanes);
        this.drawTrafficLights(centerX, centerY, 'north', this.northboundLanes);
        this.drawTrafficLights(centerX, centerY, 'south', this.southboundLanes);

        this.drawLaneArrows(centerX, centerY, 'west', this.westboundLanes);
        this.drawLaneArrows(centerX, centerY, 'east', this.eastboundLanes);
        this.drawLaneArrows(centerX, centerY, 'north', this.northboundLanes);
        this.drawLaneArrows(centerX, centerY, 'south', this.southboundLanes);
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

        this.ctx.beginPath();
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;

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



// Testing connecting front and back end stuff
const comparebtn = document.getElementById("compare-btn");
comparebtn.addEventListener("click", () => {
    fetch("http://127.0.0.1:5000/python-test", {
        method: "POST",
    })
    .catch(error => console.error("Error:", error));
});