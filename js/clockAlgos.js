/**
 * Represents the core logic of the Clock Page Replacement Algorithm.
 * This class is a state machine, processing one step of the algorithm at a time.
 */
export class ClockAlgorithm {
    /**
     * @param {number} numFrames The number of physical memory frames.
     * @param {string[]} refStringArray The array of page references.
     */
    constructor(numFrames, refStringArray) {
        this.numFrames = numFrames;
        this.refString = refStringArray;

        // The physical memory frames
        this.frames = new Array(numFrames).fill(null);
        // The "use" or "reference" bits for each frame
        this.useBits = new Array(numFrames).fill(0);
        // The clock hand pointer
        this.pointer = 0;

        // Current position in the reference string
        this.refIndex = 0;
        this.currentPage = null;

        // Statistics
        this.pageFaults = 0;
        this.pageHits = 0;

        // State machine properties
        this.currentState = 'START'; // 'START', 'CHECK_HIT', 'HIT', 'FAULT_START_SEARCH', 'FAULT_CHECK_BIT', 'FAULT_SET_BIT_ZERO', 'FAULT_REPLACE', 'DONE'
        this.logMessage = 'Simulation initialized. Click Start/Reset.';
        this.logType = 'info';
        this.highlightFrame = null; // Which frame to highlight in the renderer
        this.highlightColor = null; // What color to use for highlighting
    }

    /**
     * Finds the index of a page in the frames.
     * @param {string} page The page number (as a string) to find.
     * @returns {number} The index if found, otherwise -1.
     */
    _findPage(page) {
        return this.frames.indexOf(page);
    }

    /**
     * Executes one logical step of the algorithm state machine.
     * This function is called repeatedly by the main controller.
     */


    step() {
        if (this.currentState === 'DONE') {
            this.logMessage = 'Simulation complete.';
            this.logType = 'info'; // <-- ADD THIS
            return;
        }

        switch (this.currentState) {
            case 'START':
                if (this.refIndex >= this.refString.length) {
                    this.currentState = 'DONE';
                    this.currentPage = null;
                    this.logMessage = 'Reference string finished.';
                    this.logType = 'info'; // <-- ADD THIS
                    this.highlightFrame = null;
                    break;
                }
                this.currentPage = this.refString[this.refIndex];
                this.logMessage = `Accessing page ${this.currentPage}...`;
                this.logType = 'info'; // <-- ADD THIS
                this.currentState = 'CHECK_HIT';
                break;

            case 'CHECK_HIT':
                const foundIndex = this._findPage(this.currentPage);
                if (foundIndex !== -1) {
                    // Page Hit
                    this.pageHits++;
                    this.useBits[foundIndex] = 1; // Set the use bit
                    this.currentState = 'HIT';
                    this.highlightFrame = foundIndex;
                    this.highlightColor = 'green';
                    this.logMessage = `Page ${this.currentPage} is a HIT. Setting use bit to 1.`;
                    this.logType = 'hit'; // <-- ADD THIS
                } else {
                    // Page Fault
                    this.pageFaults++;
                    this.currentState = 'FAULT_START_SEARCH';
                    this.highlightFrame = null;
                    this.logMessage = `Page ${this.currentPage} is a FAULT. Searching for victim...`;
                    this.logType = 'fault'; // <-- ADD THIS
                }
                break;

            case 'HIT':
                // This state just acts as a pause after a hit
                this.refIndex++;
                this.currentState = 'START';
                // No log change needed here, it's just a pause
                break;

            case 'FAULT_START_SEARCH':
                this.logMessage = `Clock hand at frame ${this.pointer} (Page ${this.frames[this.pointer]}).`;
                this.logType = 'check'; // <-- ADD THIS
                this.currentState = 'FAULT_CHECK_BIT';
                this.highlightFrame = this.pointer;
                this.highlightColor = 'orange';
                break;

            case 'FAULT_CHECK_BIT':
                this.logMessage = `Checking frame ${this.pointer}. Use bit is ${this.useBits[this.pointer]}.`;
                this.logType = 'check'; // <-- ADD THIS
                if (this.useBits[this.pointer] === 1) {
                    this.currentState = 'FAULT_SET_BIT_ZERO';
                } else {
                    this.currentState = 'FAULT_REPLACE';
                }
                this.highlightFrame = this.pointer;
                break;

            case 'FAULT_SET_BIT_ZERO':
                this.useBits[this.pointer] = 0;
                this.logMessage = `Set bit to 0 for frame ${this.pointer}. Advancing pointer.`;
                this.logType = 'check'; // <-- ADD THIS
                this.highlightColor = 'orange';
                this.pointer = (this.pointer + 1) % this.numFrames;
                this.currentState = 'FAULT_CHECK_BIT';
                break;

            case 'FAULT_REPLACE':
                const victimPage = this.frames[this.pointer];
                this.frames[this.pointer] = this.currentPage;
                this.useBits[this.pointer] = 1;
                this.logMessage = `Replacing Page ${victimPage} at frame ${this.pointer} with Page ${this.currentPage}. Setting bit to 1.`;
                this.logType = 'fault'; // <-- ADD THIS
                this.highlightFrame = this.pointer;
                this.highlightColor = 'red';

                this.pointer = (this.pointer + 1) % this.numFrames;
                this.refIndex++;
                this.currentState = 'START';
                break;
        }
    }
}