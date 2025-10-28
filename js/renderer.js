/**
 * Handles all Canvas API drawing for the Clock Simulator.
 * It reads the state from the ClockAlgorithm and renders it.
 */
export class ClockRenderer {
    /**
     * @param {HTMLCanvasElement} canvas The canvas element to draw on.
     * @param {number} numFrames The number of frames to draw.
     */
    constructor(canvas, numFrames) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.numFrames = numFrames;

        // Clock geometry
        this.centerX = this.width / 2;
        this.centerY = this.height / 2 + 10; // Move down a bit for title
        this.radius = Math.min(this.width, this.height) * 0.3;
        this.frameRadius = 25; // Radius of the circle for each frame
        
        // Pre-calculate frame positions
        this.framePositions = [];
        for (let i = 0; i < numFrames; i++) {
            // Calculate angle for each frame, starting from the top ( -PI / 2)
            const angle = (i / numFrames) * 2 * Math.PI - Math.PI / 2;
            const x = this.centerX + this.radius * Math.cos(angle);
            const y = this.centerY + this.radius * Math.sin(angle);
            this.framePositions.push({ x, y, angle });
        }
    }

    /**
     * Clears and draws the entire visualization based on the algorithm's state.
     * @param {import('./clockAlgorithm.js').ClockAlgorithm} algorithm The algorithm instance containing the current state.
     */
    draw(algorithm) {
        const { frames, useBits, pointer, highlightFrame, highlightColor } = algorithm;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw title
        this.ctx.font = 'bold 18px sans-serif';
        this.ctx.fillStyle = '#333';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Physical Memory Frames (Clock)', this.centerX, 30);

        this._drawFrames(frames, useBits);
        this._drawPointer(pointer);
        
        // Draw highlight if any
        if (highlightFrame !== null) {
            this._drawHighlight(highlightFrame, highlightColor);
        }
    }

    /**
     * Draws the circular frames, page numbers, and use bits.
     * @param {string[]} frames - Array of page numbers.
     * @param {number[]} useBits - Array of use bits.
     */
    _drawFrames(frames, useBits) {
        this.ctx.font = 'bold 16px sans-serif';
        
        for (let i = 0; i < this.framePositions.length; i++) {
            const { x, y } = this.framePositions[i];
            
            // Draw frame circle
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.frameRadius, 0, 2 * Math.PI);
            this.ctx.fillStyle = '#EAF2F8';
            this.ctx.fill();
            this.ctx.strokeStyle = '#B0C4DE';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // Draw Page Number
            this.ctx.fillStyle = '#005a9c';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(frames[i] === null ? '-' : frames[i], x, y);

            // Draw Use Bit
            const angle = this.framePositions[i].angle;
            const bitX = x + (this.frameRadius + 15) * Math.cos(angle);
            const bitY = y + (this.frameRadius + 15) * Math.sin(angle);
            this.ctx.font = '14px sans-serif';
            this.ctx.fillStyle = useBits[i] === 1 ? '#28a745' : '#dc3545';

            // --- NEW LOGIC TO FIX OVERLAP ---
            // Set text alignment based on the frame's horizontal position
            // We use 0.01 as a small buffer for floating point numbers
            if (Math.cos(angle) < -0.01) {
                // Frame is on the LEFT side
                this.ctx.textAlign = 'right';
            } else if (Math.cos(angle) > 0.01) {
                // Frame is on the RIGHT side
                this.ctx.textAlign = 'left';
            } else {
                // Frame is on the TOP or BOTTOM
                this.ctx.textAlign = 'center';
            }
            // textBaseline is already 'middle' from drawing the page number,
            // which is correct for all cases.
            // --- END NEW LOGIC ---

            this.ctx.fillText(`bit: ${useBits[i]}`, bitX, bitY);
        }
    }

    /**
     * Draws the clock hand (pointer).
     * @param {number} pointer - The current index of the clock hand.
     */
    _drawPointer(pointer) {
        const { x, y } = this.framePositions[pointer];
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        
        // Calculate point just outside the frame circle
        const targetX = this.centerX + (this.radius - this.frameRadius - 5) * Math.cos(this.framePositions[pointer].angle);
        const targetY = this.centerY + (this.radius - this.frameRadius - 5) * Math.sin(this.framePositions[pointer].angle);

        this.ctx.lineTo(targetX, targetY);
        this.ctx.strokeStyle = '#d9534f';
        this.ctx.lineWidth = 4;
        this.ctx.stroke();

        // Draw a circle at the tip
        this.ctx.beginPath();
        this.ctx.arc(targetX, targetY, 6, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#d9534f';
        this.ctx.fill();
    }

    /**
     * Draws a highlight around a specific frame.
     * @param {number} frameIndex - The index of the frame to highlight.
     * @param {string} color - The color of the highlight (e.g., 'green', 'red').
     */
    _drawHighlight(frameIndex, color) {
        const { x, y } = this.framePositions[frameIndex];
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.frameRadius + 5, 0, 2 * Math.PI);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 5;
        this.ctx.stroke();
    }
}