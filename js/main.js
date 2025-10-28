import { ClockAlgorithm } from './clockAlgos.js';
import { ClockRenderer } from './renderer.js';

// --- State Variables ---
let algorithm = null;
let renderer = null;
let isPlaying = false;
let animationTimer = null;
let animationSpeed = 1000; // Default speed in ms

// --- DOM Element References ---
const canvas = document.getElementById('clock-canvas');
const startButton = document.getElementById('start-button');
const playPauseButton = document.getElementById('play-pause-button');
const stepButton = document.getElementById('step-button');
const speedSlider = document.getElementById('speed-slider');

const framesInput = document.getElementById('frames-input');
const refStringInput = document.getElementById('ref-string-input');

const hitsEl = document.getElementById('hits-count');
const faultsEl = document.getElementById('faults-count');
const ratioEl = document.getElementById('hit-ratio');
const currentPageEl = document.getElementById('current-page');
const logOutput = document.getElementById('log-output');

// --- Event Listeners ---
startButton.addEventListener('click', initializeSimulation);
playPauseButton.addEventListener('click', togglePlayPause);
stepButton.addEventListener('click', doStep);
// Update speed immediately as the slider moves
speedSlider.addEventListener('input', (e) => {
    // Slider value is 50 (fast) to 1950 (slow). We reverse it for speed.
    animationSpeed = 2000 - e.target.value;
    if (isPlaying) {
        // Reset the interval to apply the new speed
        clearInterval(animationTimer);
        animationTimer = setInterval(doStep, animationSpeed);
    }
});

/**
 * Initializes or resets the simulation with current parameters.
 */
function initializeSimulation() {
    // Stop any existing animation
    if (animationTimer) clearInterval(animationTimer);
    isPlaying = false;
    playPauseButton.textContent = 'Play';
    playPauseButton.classList.remove('paused');

    // Get parameters
    const numFrames = parseInt(framesInput.value);
    const refString = refStringInput.value.split(',')
                                        .map(s => s.trim())
                                        .filter(Boolean); // Remove empty strings

    if (numFrames < 1 || refString.length === 0) {
        addToLog("Error: Invalid input. Check frames or reference string.", 'fault');
        return;
    }

    // Create new algorithm and renderer instances
    algorithm = new ClockAlgorithm(numFrames, refString);
    renderer = new ClockRenderer(canvas, numFrames);

    // Reset UI
    logOutput.innerHTML = '';
    addToLog('Simulation initialized. Ready to start.', 'info');
    updateStats();
    renderer.draw(algorithm); // Draw initial state

    // Enable controls
    playPauseButton.disabled = false;
    stepButton.disabled = false;
}

/**
 * Toggles the play/pause state of the animation.
 */
function togglePlayPause() {
    if (algorithm.currentState === 'DONE') return;

    isPlaying = !isPlaying;
    if (isPlaying) {
        playPauseButton.textContent = 'Pause';
        playPauseButton.classList.add('paused');
        // Do one step immediately, then start interval
        doStep();
        animationTimer = setInterval(doStep, animationSpeed);
    } else {
        playPauseButton.textContent = 'Play';
        playPauseButton.classList.remove('paused');
        clearInterval(animationTimer);
    }
}

/**
 * Executes a single step of the algorithm and updates the UI.
 */
function doStep() {
    if (algorithm.currentState === 'DONE') {
        addToLog('Simulation finished.', 'info');
        if (animationTimer) clearInterval(animationTimer);
        isPlaying = false;
        playPauseButton.textContent = 'Play';
        playPauseButton.classList.remove('paused');
        playPauseButton.disabled = true;
        stepButton.disabled = true;
        return;
    }

    algorithm.step();
    renderer.draw(algorithm);
    updateStats();
    addToLog(algorithm.logMessage, algorithm.logType);
}

/**
 * Updates the statistics panel.
 */
function updateStats() {
    const hits = algorithm.pageHits;
    const faults = algorithm.pageFaults;
    const total = hits + faults;
    const ratio = total === 0 ? 0 : (hits / total) * 100;

    hitsEl.textContent = hits;
    faultsEl.textContent = faults;
    ratioEl.textContent = `${ratio.toFixed(2)}%`;
    currentPageEl.textContent = algorithm.currentPage || 'N/A';
}

/**
 * Adds a styled message to the execution log div.
 * @param {string} message The message to log.
 * @param {string} type The type of log (info, hit, fault, check).
 */
function addToLog(message, type = 'info') {
    if (!message) return;

    const logEntry = document.createElement('p');
    // Add classes for styling
    logEntry.className = `log-entry log-${type}`; 

    // Use textContent for security (prevents HTML injection)
    logEntry.textContent = message; 

    logOutput.appendChild(logEntry);

    // Auto-scroll to the bottom
    logOutput.scrollTop = logOutput.scrollHeight; 
}