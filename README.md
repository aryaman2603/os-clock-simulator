# Interactive Clock Page Replacement Algorithm Simulator

This is a web-based interactive animation tool that visualizes the **Clock (Second-Chance)** page replacement algorithm. It is built entirely with HTML5, CSS3, and JavaScript (ES6+), using the Canvas API for all animations.

It runs 100% in the browser with **zero server-side dependencies**.

## Features
* **Interactive Parameters:** Set the number of physical memory frames and the page reference string.
* **Step-by-Step Control:** Manually step through the algorithm or use play/pause for an automated demonstration.
* **Speed Control:** Adjust the animation speed in real-time.
* **Clear Visualization:** A circular "clock" visualizes the frames, the clock hand (pointer), and the "use bit" for each frame.
* **Color-Coded Highlights:**
    * **Green:** Page Hit
    * **Orange:** Checking a frame's use bit
    * **Red:** Page Fault & Replacement
* **Real-Time Statistics:** See live counts of page hits, faults, and the hit ratio.
* **Execution Log:** A detailed, step-by-step log explains exactly what the algorithm is doing.

---

## Execution Guide (How to Run)

**IMPORTANT:** You cannot run this project by just opening the `index.html` file directly from your file system (e.g., `file:///...`).

This project uses **ES6 JavaScript Modules** (`import`/`export`). For security reasons, modern browsers block modules from loading when opened from the `file:` protocol. You **must** serve the files from a simple local web server.

Here are two easy ways to do this:

### Method 1: Using the VS Code "Live Server" Extension (Easiest)
1.  Open the `clock-simulator` folder in Visual Studio Code.
2.  Install the **"Live Server"** extension by Ritwick Dey from the Extensions tab.
3.  Right-click on `index.html` in the file explorer.
4.  Select **"Open with Live Server"**.
5.  Your browser will automatically open to the correct address (e.g., `http://127.0.0.1:5500`).

### Method 2: Using Python's Built-in Server
1.  Open your terminal or command prompt.
2.  Navigate into the `clock-simulator` folder using the `cd` command.
    ```sh
    cd path/to/clock-simulator
    ```
3.  Run the following command (if you have Python 3):
    ```sh
    python -m http.server
    ```
    (If you have Python 2, use: `python -m SimpleHTTPServer`)
4.  Open your web browser and go to: **`http://localhost:8000`**

---

## User Interface Guide

1.  **Parameters Panel:**
    * **Number of Frames:** Enter the number of physical memory frames (e.g., `4`).
    * **Reference String:** Enter the list of pages to be accessed, separated by commas (e.g., `1, 2, 3, 4, 1, 2, 5`).
    * **Start / Reset:** Click this to initialize the simulation with your parameters. This will reset any simulation in progress.

2.  **Controls Panel:**
    * **Play/Pause:** Toggles the automatic animation.
    * **Step Forward:** Manually advances the algorithm by one logical step.
    * **Speed:** A slider to control the speed of the "Play" mode. (Left is faster, Right is slower).

3.  **Visualization:**
    * The large circle represents the physical memory frames.
    * The red line is the **Clock Hand (Pointer)**, which points to the next frame to be considered for replacement.
    * Each frame shows the **Page Number** it contains (or `-` if empty) and its **Use Bit** (`bit: 0` or `bit: 1`).

4.  **Statistics & Log:**
    * **Statistics:** Shows the real-time count of hits, faults, and the current page being processed.
    * **Execution Log:** Provides a clear, human-readable text description of every single step the algorithm takes.