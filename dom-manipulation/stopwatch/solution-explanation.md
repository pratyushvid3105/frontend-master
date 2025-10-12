# Stopwatch Solution - Step-by-Step Explanation

## Overview

This solution creates a fully functional stopwatch by tracking elapsed time using the browser's performance clock (`Date.now()`) and updating the display using `requestAnimationFrame` for smooth, frequent updates. The key insight is calculating elapsed time from multiple time intervals and formatting it correctly.

## Implementation Strategy

### **Core Approach: Time Accumulation**

Rather than incrementing a counter on each update, the solution calculates elapsed time by:

1. Recording when the timer starts (`lastStartTime`)
2. Measuring how much time passed in previous sessions (`millisecondsPassedBeforeLastStart`)
3. Computing total elapsed time: `(Date.now() - lastStartTime) + millisecondsPassedBeforeLastStart`

This approach elegantly handles pause/resume by storing accumulated time and resetting the start reference point.

### **Animation Method: requestAnimationFrame**

Uses `requestAnimationFrame` instead of `setInterval` because:

- Runs at the browser's refresh rate (typically 60 FPS)
- More efficient than arbitrary intervals
- Smoother, more natural animation
- Pauses automatically when tab is inactive

## Step-by-Step Breakdown

### **1. DOM Element Selection & Event Listeners**

```javascript
// Select all DOM elements needed for the stopwatch
const timer = document.getElementById("timer");
const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");
const resetButton = document.getElementById("reset-button");

// Attach click event listeners to each button
// These listeners call the respective functions when buttons are clicked
startButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", stopTimer);
resetButton.addEventListener("click", resetTimer);
```

**Purpose:** Cache references to UI elements and set up event handling

**Key Points:**

- Caching DOM references improves performance (avoids repeated lookups)
- Event listeners attach to buttons to respond to user interactions
- Functions are called when buttons are clicked

---

### **2. State Variables**

```javascript
let timerID; // Stores the animation frame ID for cancellation
let lastStartTime = 0; // Timestamp when timer last started (milliseconds since epoch)
let millisecondsPassedBeforeLastStart = 0; // Accumulated milliseconds from completed time sessions
```

**Purpose:** Maintain state across function calls

**Variable Explanations:**

- **`timerID`**: ID returned by `requestAnimationFrame`. Needed to cancel animation with `cancelAnimationFrame(timerID)`.

- **`lastStartTime`**: Set to `Date.now()` when timer starts. Combined with current time to calculate elapsed time since start button was pressed.

- **`millisecondsPassedBeforeLastStart`**: Accumulates time from all previous sessions. When you pause at 10 seconds and resume, this stores that 10 seconds so the next session adds to it.

**Example Timeline:**

```
Session 1: Press Start → runs for 5 seconds → Press Stop
  millisecondsPassedBeforeLastStart = 5000

Session 2: Press Start → runs for 3 seconds → Total is now 8 seconds
  millisecondsPassedBeforeLastStart = 5000 + 3000
```

---

### **3. startTimer Function**

```javascript
function startTimer(timestamp) {
  // timestamp parameter comes from requestAnimationFrame (not used here)
  console.log(timestamp); // For debugging only

  // Disable Start button to prevent multiple simultaneous timers
  // Enable Stop button so user can pause
  startButton.disabled = true;
  stopButton.disabled = false;

  // Disable Reset button (can only reset when paused)
  resetButton.disabled = true;

  // Record current time as the reference point for this session
  // This will be used to calculate elapsed time in updateTimer()
  lastStartTime = Date.now();

  // Schedule the updateTimer function to run on next animation frame
  // This starts the continuous update loop
  timerID = requestAnimationFrame(updateTimer);
}
```

**Purpose:** Initialize timer and set up animation loop

**Algorithm:**

1. **Disable/Enable buttons** to enforce valid state transitions

   - Start: Disabled (already running)
   - Stop: Enabled (user can pause)
   - Reset: Disabled (only pause state allows reset)

2. **Capture start timestamp** with `Date.now()` (milliseconds since Jan 1, 1970)

3. **Start animation loop** with `requestAnimationFrame(updateTimer)`
   - Schedules `updateTimer` to run on next screen refresh (~16.67ms at 60Hz)
   - Returns ID stored in `timerID` for later cancellation

**Example Execution:**

```
User clicks Start button at 10:30:45.250 AM (local time)
lastStartTime = 1728764445250 (milliseconds since epoch)
Animation loop begins, updateTimer called repeatedly
```

---

### **4. stopTimer Function**

```javascript
function stopTimer() {
  // Enable Start button so user can resume timing
  // Disable Stop button (nothing to stop when paused)
  startButton.disabled = false;
  stopButton.disabled = true;

  // Enable Reset button (user can now reset back to 00:00:000)
  resetButton.disabled = false;

  // Calculate how much time elapsed during this session
  // This is: current time minus the time when we started this session
  // Example: if started at 1000ms and now at 3500ms, elapsed is 2500ms
  millisecondsPassedBeforeLastStart += Date.now() - lastStartTime;

  // Reset lastStartTime to 0 as we're no longer running
  // This prevents the updateTimer from using a stale start time
  lastStartTime = 0;

  // Cancel the animation frame to stop calling updateTimer
  // This effectively pauses the timer display
  cancelAnimationFrame(timerID);
}
```

**Purpose:** Pause the timer and prepare for resume or reset

**Algorithm:**

1. **Update button states** to reflect paused state

2. **Accumulate elapsed time** from this session:

   ```
   millisecondsPassedBeforeLastStart += (Date.now() - lastStartTime)
   ```

   This takes the time elapsed since this session started and adds it to the total accumulated time.

3. **Reset lastStartTime** to prevent confusion (it's not currently tracking anything)

4. **Cancel animation loop** to stop frequent updates

**Example Execution:**

```
Started at: 1000ms
Stopped at: 3500ms
Elapsed in session: 3500 - 1000 = 2500ms
millisecondsPassedBeforeLastStart was 5000ms
Now: millisecondsPassedBeforeLastStart = 5000 + 2500 = 7500ms
```

---

### **5. resetTimer Function**

```javascript
function resetTimer() {
  // Disable Reset button immediately (nothing to reset to)
  resetButton.disabled = true;

  // Clear all accumulated time
  // This returns the stopwatch to 00:00:000
  millisecondsPassedBeforeLastStart = 0;

  // Update the display to show the reset time
  timer.textContent = "00:00:000";
}
```

**Purpose:** Return stopwatch to initial idle state

**Algorithm:**

1. Disable Reset button (redundant but safe)
2. Clear accumulated time counter
3. Update display directly (don't wait for next animation frame)

**Key Points:**

- Reset is only callable when paused (button is disabled while running)
- Directly sets `timer.textContent` rather than waiting for `updateTimer`
- Simple and straightforward (no time calculations needed)

---

### **6. updateTimer Function (Core Logic)**

```javascript
function updateTimer() {
  // Calculate total elapsed milliseconds
  // Two components:
  // 1. Date.now() - lastStartTime = time since current session started
  // 2. millisecondsPassedBeforeLastStart = time from previous sessions
  const millisecondsPassed =
    Date.now() - lastStartTime + millisecondsPassedBeforeLastStart;

  // Convert milliseconds to seconds (divide by 1000)
  const secondsPassed = millisecondsPassed / 1000;

  // Convert seconds to minutes (divide by 60)
  const minutesPassed = secondsPassed / 60;

  // Extract display values using modulo to get only the relevant digit
  // millisecondsPassed % 1000 gives remainder after dividing by 1000
  // Example: 65234ms → 234ms (the milliseconds part)
  const millisecondsText = formatNumber(
    Math.floor(millisecondsPassed % 1000),
    3
  );

  // secondsPassed % 60 gives remainder after dividing by 60
  // Example: 125 seconds → 5 (only the seconds part, not the minutes)
  const secondsText = formatNumber(Math.floor(secondsPassed % 60), 2);

  // Math.floor(minutesPassed) gives the whole number of minutes
  // Example: 2.5 minutes → 2
  const minutesText = formatNumber(Math.floor(minutesPassed), 2);

  // Update the timer display with the formatted time string
  // Format: MM:SS:mmm (minutes:seconds:milliseconds)
  timer.textContent = `${minutesText}:${secondsText}:${millisecondsText}`;

  // Schedule the next update on the next animation frame
  // This creates a continuous loop that keeps the timer running
  timerID = requestAnimationFrame(updateTimer);
}
```

**Purpose:** Calculate elapsed time and update display (called ~60 times per second)

**Algorithm:**

1. **Calculate total elapsed time:**

   - Current session: `Date.now() - lastStartTime`
   - Previous sessions: `millisecondsPassedBeforeLastStart`
   - Total: Sum of both

2. **Convert to units:**

   - Milliseconds → divide by 1 (already milliseconds)
   - Seconds → divide milliseconds by 1000
   - Minutes → divide seconds by 60

3. **Extract display components using modulo operator:**

   ```
   % extracts the remainder after division (useful for circular time values)

   Time: 125,350 milliseconds

   Minutes: Math.floor(125350 / 1000 / 60) = Math.floor(2.08...) = 2

   Seconds: Math.floor((125350 / 1000) % 60)
            = Math.floor(125.350 % 60)
            = Math.floor(5.350) = 5

   Milliseconds: 125350 % 1000 = 350

   Display: 02:05:350 ✓
   ```

4. **Format and display:** Use `formatNumber` to add leading zeros

5. **Recursively schedule:** Call `requestAnimationFrame(updateTimer)` again

**Key Points:**

- Uses `Math.floor()` to remove decimal places before modulo
- Modulo extracts only the relevant digit range
- Recursive scheduling keeps timer running smoothly
- Called 60 times per second (or browser's refresh rate)

**Example Execution Timeline:**

```
t=0ms:    updateTimer() called, elapsed=0ms, display="00:00:000"
t=16ms:   updateTimer() called, elapsed=16ms, display="00:00:016"
t=32ms:   updateTimer() called, elapsed=32ms, display="00:00:032"
t=1000ms: updateTimer() called, elapsed=1000ms, display="00:01:000"
t=2000ms: updateTimer() called, elapsed=2000ms, display="00:02:000"
```

---

### **7. formatNumber Utility Function**

```javascript
function formatNumber(number, desiredLength) {
  // Convert the number to a string to work with individual digits
  // Example: 5 → "5"
  const stringNumber = String(number);

  // If the number already has more digits than desired, truncate it
  // This prevents 1234 from becoming "01234" when desiredLength is 2
  // Example: "1234".slice(0, 2) → "12"
  if (stringNumber.length > desiredLength) {
    return stringNumber.slice(0, desiredLength);
  }

  // If the number has fewer digits than desired, add leading zeros
  // padStart adds characters to the beginning until string reaches desiredLength
  // Example: "5".padStart(2, "0") → "05"
  //          "350".padStart(3, "0") → "350" (no change, already 3 digits)
  return stringNumber.padStart(desiredLength, "0");
}
```

**Purpose:** Ensure all time components display with correct number of digits

**Algorithm:**

1. Convert number to string for digit manipulation
2. If too long: truncate (safety check, shouldn't happen in normal use)
3. If too short: pad with leading zeros using `padStart()`

**Examples:**

```javascript
formatNumber(2, 2)     → "02"  (added one leading zero)
formatNumber(15, 2)    → "15"  (already 2 digits)
formatNumber(350, 3)   → "350" (already 3 digits)
formatNumber(1234, 3)  → "123" (truncated to 3 digits)
formatNumber(5, 3)     → "005" (added two leading zeros)
```

---

## Complete JavaScript Solution with Detailed Comments

```javascript
// ============================================
// DOM ELEMENT SELECTION & EVENT SETUP
// ============================================

// Cache references to DOM elements for better performance
const timer = document.getElementById("timer");
const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");
const resetButton = document.getElementById("reset-button");

// Attach event listeners to buttons
// These will trigger the respective functions when clicked
startButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", stopTimer);
resetButton.addEventListener("click", resetTimer);

// ============================================
// STATE VARIABLES
// ============================================

// Stores the ID of the current animation frame
// Used to cancel the animation with cancelAnimationFrame()
let timerID;

// Timestamp (milliseconds since epoch) when the current session started
// Used to calculate elapsed time since last start
let lastStartTime = 0;

// Accumulates milliseconds from all completed timing sessions
// Allows the timer to correctly resume after pause
let millisecondsPassedBeforeLastStart = 0;

// ============================================
// START TIMER FUNCTION
// ============================================

/**
 * Initiates the stopwatch timer
 * Sets up button states and begins the animation loop
 * @param {number} timestamp - From requestAnimationFrame (unused)
 */
function startTimer(timestamp) {
  // Log the timestamp for debugging (optional)
  console.log(timestamp);

  // ---- Update button states ----
  // Only the Stop button should be enabled while timer is running
  startButton.disabled = true; // Prevent multiple simultaneous timers
  stopButton.disabled = false; // Allow user to pause
  resetButton.disabled = true; // Reset only allowed when paused

  // ---- Initialize timing ----
  // Record the current time as the reference point
  // This will be subtracted from future timestamps to find elapsed time
  lastStartTime = Date.now();

  // ---- Start animation loop ----
  // Schedule updateTimer to run on the next animation frame (~60 FPS)
  // Store the frame ID so we can cancel it later
  timerID = requestAnimationFrame(updateTimer);
}

// ============================================
// STOP TIMER FUNCTION
// ============================================

/**
 * Pauses the stopwatch timer
 * Saves elapsed time and stops the animation loop
 */
function stopTimer() {
  // ---- Update button states ----
  // Return to start/reset state, but disable Stop
  startButton.disabled = false; // Allow resume
  stopButton.disabled = true; // Nothing to stop when paused
  resetButton.disabled = false; // Allow reset

  // ---- Accumulate elapsed time ----
  // Add this session's elapsed time to the total accumulated time
  // This is critical for resume functionality
  // Example: If you ran for 5 seconds, paused (accumulator=5000), then ran 3 more (accumulator now 8000)
  millisecondsPassedBeforeLastStart += Date.now() - lastStartTime;

  // Clear the start time as we're no longer running
  // This prevents updateTimer from using a stale reference
  lastStartTime = 0;

  // ---- Stop animation loop ----
  // Cancel the animation frame to stop calling updateTimer
  // This freezes the timer display at its current value
  cancelAnimationFrame(timerID);
}

// ============================================
// RESET TIMER FUNCTION
// ============================================

/**
 * Resets the stopwatch to initial idle state
 * Clears all accumulated time and updates display
 */
function resetTimer() {
  // Disable Reset button (nothing to reset now)
  resetButton.disabled = true;

  // Clear all accumulated time from previous sessions
  // This returns the logical state to the beginning
  millisecondsPassedBeforeLastStart = 0;

  // Immediately update display to show reset time
  // We set this directly instead of waiting for the next updateTimer call
  // because updateTimer isn't running (we're in paused state)
  timer.textContent = "00:00:000";
}

// ============================================
// UPDATE TIMER FUNCTION
// ============================================

/**
 * Updates the timer display with current elapsed time
 * Called repeatedly by requestAnimationFrame for smooth updates
 * Runs approximately 60 times per second (once per screen refresh)
 */
function updateTimer() {
  // ---- Calculate total elapsed milliseconds ----
  // Two components sum to give the complete elapsed time:
  // 1. Time since this session started: Date.now() - lastStartTime
  // 2. Time from all previous sessions: millisecondsPassedBeforeLastStart
  // Example: 5000ms (previous) + 3500ms (current session) = 8500ms total
  const millisecondsPassed =
    Date.now() - lastStartTime + millisecondsPassedBeforeLastStart;

  // ---- Convert to different time units ----
  // These are floating-point values; we'll extract whole numbers later
  const secondsPassed = millisecondsPassed / 1000;
  const minutesPassed = secondsPassed / 60;

  // ---- Extract display-ready values ----
  // Use modulo operator (%) to get remainder after division
  // This isolates each time component for display

  // Milliseconds: Get last 3 digits (remainder after dividing by 1000)
  // Example: 65234ms % 1000 = 234 → "234"
  const millisecondsText = formatNumber(
    Math.floor(millisecondsPassed % 1000),
    3
  );

  // Seconds: Get seconds portion (0-59), remainder after dividing seconds by 60
  // Example: 125 seconds % 60 = 5 → "05"
  const secondsText = formatNumber(Math.floor(secondsPassed % 60), 2);

  // Minutes: Just the whole number of minutes
  // Example: 2.08 minutes → 2 → "02"
  const minutesText = formatNumber(Math.floor(minutesPassed), 2);

  // ---- Update DOM ----
  // Set the timer text to format: MM:SS:mmm
  timer.textContent = `${minutesText}:${secondsText}:${millisecondsText}`;

  // ---- Continue animation loop ----
  // Schedule updateTimer to run again on the next animation frame
  // This creates a recursive loop that keeps the timer updating smoothly
  timerID = requestAnimationFrame(updateTimer);
}

// ============================================
// FORMAT NUMBER UTILITY FUNCTION
// ============================================

/**
 * Formats a number with leading zeros to match desired length
 * Truncates if number is already longer than desired
 * @param {number} number - The number to format
 * @param {number} desiredLength - The target string length
 * @returns {string} Formatted number string
 */
function formatNumber(number, desiredLength) {
  // Convert number to string to work with individual digits
  const stringNumber = String(number);

  // Safety check: truncate if number already exceeds desired length
  // Example: 1234 with desiredLength 2 → "12"
  if (stringNumber.length > desiredLength) {
    return stringNumber.slice(0, desiredLength);
  }

  // Pad with leading zeros if number is shorter than desired
  // padStart(length, fillString) prepends characters until string reaches length
  // Example: "5".padStart(2, "0") → "05"
  // Example: "350".padStart(3, "0") → "350" (no change)
  return stringNumber.padStart(desiredLength, "0");
}
```

---

## Key Concepts Explained

### **The Modulo Operator (%) in Time Display**

The modulo operator is crucial for extracting individual time components:

```javascript
Total elapsed: 125,234 milliseconds

Minutes = 125234 / 1000 / 60 = 2.087... → Math.floor = 2
Display: "02"

Seconds = (125234 / 1000) % 60 = 125.234 % 60 = 5.234 → Math.floor = 5
Display: "05"

Milliseconds = 125234 % 1000 = 234
Display: "234"

Result: "02:05:234" ✓
```

### **requestAnimationFrame vs setInterval**

| Aspect           | requestAnimationFrame           | setInterval                    |
| ---------------- | ------------------------------- | ------------------------------ |
| **Timing**       | Browser's refresh rate (60 FPS) | Fixed interval (e.g., 16.67ms) |
| **Efficiency**   | Native, optimized               | Less efficient                 |
| **Power Usage**  | Lower (syncs with screen)       | Higher                         |
| **Inactive Tab** | Pauses automatically            | Continues running              |
| **Smoothness**   | Smoother animation              | May appear jittery             |

### **Time Accumulation Strategy**

The solution's elegant handling of pause/resume:

```javascript
// Session 1: 0 → 5 seconds
lastStartTime = <time at start>
stopTimer() called at 5 seconds
millisecondsPassedBeforeLastStart = 5000

// Session 2: Resume from 5 seconds
lastStartTime = <new time>
elapsed = (Date.now() - lastStartTime) + 5000
// If only 2 seconds elapse: 2000 + 5000 = 7000ms total ✓
```

---

## State Transition Diagram

```
IDLE STATE (initial)
├─ Start button: ENABLED
├─ Stop button: DISABLED
└─ Reset button: DISABLED

        ↓ (press Start)

RUNNING STATE
├─ Start button: DISABLED
├─ Stop button: ENABLED
└─ Reset button: DISABLED
│
└─ updateTimer() runs repeatedly (~60 FPS)

        ↓ (press Stop)

PAUSED STATE
├─ Start button: ENABLED
├─ Stop button: DISABLED
└─ Reset button: ENABLED

    ↙           ↘
(press Start)  (press Reset)
    ║           ║
    ↓           ↓
RUNNING     IDLE STATE
```

## Edge Cases Handled

- **No upper limit bypass:** Times beyond 59:59:999 are truncated (not handled, as per requirements)
- **Smooth pause/resume:** Accumulator prevents jumping or loss of time
- **Disabled buttons:** Prevent invalid transitions (e.g., can't start twice simultaneously)
- **Direct reset update:** Display updates immediately on reset, not waiting for animation frame
