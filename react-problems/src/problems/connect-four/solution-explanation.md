# Connect Four Solution - Step-by-Step Explanation

## Overview

This solution implements a Connect Four game using React with useReducer for complex state management. The key challenges include **2D board representation**, **gravity simulation for falling tiles**, **win detection in 4 directions**, **turn alternation**, and **game restart**. The algorithm uses a reducer pattern for predictable state updates and directional checking for win conditions.

## Implementation Strategy

### **Core Approach: useReducer + 2D Array Board**

The solution uses:

1. **useReducer** → Manage complex game state (board, currentPlayer, winner, isGameOver)
2. **2D array representation** → Board as array of columns, columns as arrays of tiles
3. **Reducer actions** → "move" and "restart" actions for state transitions
4. **Win detection algorithm** → Check 4 directions from last placed tile
5. **Component composition** → Separate Column component for organization

This approach provides predictable state management for complex game logic.

---

## Board Data Structure

### **Why Array of Columns (not rows)**

```javascript
// Board structure:
[
  [topLeft, ..., bottomLeft],     // Column 0
  [topLeft, ..., bottomLeft],     // Column 1
  ...
  [topRight, ..., bottomRight]    // Column 6
]

// Why this structure:
// ✓ Easy to find "drop position" in column (lastIndexOf(null))
// ✓ Natural mapping to visual columns
// ✓ Click handler gets column index directly
// ✓ Gravity simulation is simple (find last empty in column)

// Example 3x3 board after a few moves:
[
  [null, null, 1],    // Column 0: Player 1 at bottom
  [null, null, 2],    // Column 1: Player 2 at bottom
  [null, null, null]  // Column 2: Empty
]
```

---

## Step-by-Step Breakdown

### **1. Constants**

```javascript
// Game configuration constants
// Centralized for easy game size adjustments
const NUM_COL = 7; // Standard Connect Four: 7 columns
const NUM_ROW = 6; // Standard Connect Four: 6 rows
const NUM_TO_WIN = 4; // Need 4 in a row to win
```

**Purpose:** Define game rules and board dimensions.

---

### **2. Component Setup with useReducer**

```javascript
export default function ConnectFour() {
  // useReducer for complex state management
  // State contains: board, winner, isGameOver
  // reducer function handles all state transitions
  // genEmptyState() provides initial state
  const [{ board, winner, isGameOver }, dispatchBoard] = useReducer(
    reducer,
    genEmptyState()
  );
```

**Purpose:** Initialize component with reducer for state management.

**Why useReducer instead of useState:**

```javascript
// With useState (messy for complex state):
const [board, setBoard] = useState(genEmptyBoard());
const [currentPlayer, setCurrentPlayer] = useState(1);
const [winner, setWinner] = useState(null);
const [isGameOver, setIsGameOver] = useState(false);

// With useReducer (cleaner):
const [state, dispatch] = useReducer(reducer, genEmptyState());
// All state updates go through reducer
// Easier to reason about state transitions
// State updates are atomic (all or nothing)
```

---

### **3. Render Winner Heading**

```javascript
  return (
    <>
      {/* Conditional rendering: Show winner if game won */}
      {/* winner is null until someone wins */}
      {/* != null checks both undefined and null */}
      {winner != null && <h1>Player {winner} Wins</h1>}
```

**Purpose:** Display winner announcement when game is won.

**Conditional Rendering:**

```javascript
{winner != null && <h1>...</h1>}

// Equivalent to:
{winner !== null && winner !== undefined && <h1>...</h1>}

// Examples:
winner = null      → false && ... → No h1 rendered
winner = 1         → true && ...  → <h1>Player 1 Wins</h1> rendered
winner = 2         → true && ...  → <h1>Player 2 Wins</h1> rendered
```

---

### **4. Render Board**

```javascript
{
  /* Board container with 7 columns */
}
<div className="board">
  {/* Map over board array to create columns */}
  {/* Each element in board is a column array */}
  {board.map((colEntries, colIndex) => {
    // Define click handler for this column
    // Dispatches "move" action with column index
    const onClickCol = () => {
      dispatchBoard({ type: "move", colIndex });
    };

    // Render Column component
    // Pass column data and click handler
    return <Column key={colIndex} entries={colEntries} onClick={onClickCol} />;
  })}
</div>;
```

**Purpose:** Render 7 columns with click handlers.

**Map Over Board:**

```javascript
board = [
  [null, null, 1],    // Column 0
  [null, null, 2],    // Column 1
  ...
]

board.map((colEntries, colIndex) => ...)

// Iteration 1:
colEntries = [null, null, 1]
colIndex = 0
<Column key={0} entries={[null,null,1]} onClick={...} />

// Iteration 2:
colEntries = [null, null, 2]
colIndex = 1
<Column key={1} entries={[null,null,2]} onClick={...} />

// ... 7 columns total
```

---

### **5. Restart Button**

```javascript
      {/* Show restart button when game is over */}
      {/* isGameOver is true when winner exists OR board is full */}
      {isGameOver && (
        <button
          onClick={() => {
            // Dispatch restart action to reset game
            dispatchBoard({ type: "restart" });
          }}
        >
          Restart
        </button>
      )}
    </>
  );
}
```

**Purpose:** Allow restarting the game when it ends.

---

### **6. Column Component**

```javascript
/**
 * Column Component
 * Renders one column of the Connect Four board
 * @param {Array} entries - Array of 6 tile values (null, 1, or 2)
 * @param {Function} onClick - Handler for column clicks
 */
function Column({ entries, onClick }) {
  return (
    // Column div with click handler
    // onClick bubbles from tiles to column
    <div className="column" onClick={onClick}>
      {/* Map over entries to create 6 tiles */}
      {entries.map((entry, rowIndex) => {
        return (
          <div key={rowIndex} className="tile">
            {/* If tile is claimed, render player disc */}
            {/* entry is null (empty), 1 (player 1), or 2 (player 2) */}
            {entry != null && <div className={`player player-${entry}`} />}
          </div>
        );
      })}
    </div>
  );
}
```

**Purpose:** Render one column with 6 tiles.

**Tile Rendering:**

```javascript
entries = [null, null, 1, 2, 1, 2]  // Example column

// Renders:
<div class="tile">                      <!-- Row 0: empty -->
</div>
<div class="tile">                      <!-- Row 1: empty -->
</div>
<div class="tile">                      <!-- Row 2: Player 1 -->
  <div class="player player-1"></div>
</div>
<div class="tile">                      <!-- Row 3: Player 2 -->
  <div class="player player-2"></div>
</div>
<div class="tile">                      <!-- Row 4: Player 1 -->
  <div class="player player-1"></div>
</div>
<div class="tile">                      <!-- Row 5: Player 2 -->
  <div class="player player-2"></div>
</div>
```

---

### **7. Reducer Function**

```javascript
/**
 * Reducer function for game state management
 * Handles all state transitions
 * @param {Object} state - Current game state
 * @param {Object} action - Action to perform
 * @returns {Object} New game state
 */
function reducer(state, action) {
  switch (action.type) {
    case "restart":
      // Reset to initial empty state
      return genEmptyState();

    case "move":
    // Handle player move (complex logic follows)
    // ... (explained in detail next)

    default:
      // Catch programming errors
      throw new Error("Unexpected action type");
  }
}
```

**Purpose:** Central location for all state transitions.

---

### **8. Move Action - Part 1: Validation**

```javascript
    case "move":
      // Get the column where move was attempted
      const relevantCol = state.board[action.colIndex];

      // Check if column is full
      // Column is full if top tile (index 0) is not null
      const isColFull = relevantCol[0] != null;

      // Guard clauses: Don't allow move if:
      // - Game is already over (someone won or board full)
      // - Column is full (can't place more tiles)
      if (state.isGameOver || isColFull) return state;
```

**Purpose:** Validate that move is legal.

**Why Check Top Tile:**

```javascript
// Column structure: [top, ..., bottom]
relevantCol = [null, null, 1, 2, 1, 2]

// Top tile (index 0) is null → column NOT full
relevantCol[0] === null → false → can add more tiles

relevantCol = [1, 2, 1, 2, 1, 2]
// Top tile is 1 → column IS full
relevantCol[0] === null → false → cannot add tiles
```

---

### **9. Move Action - Part 2: Clone State**

```javascript
// Extract current state
const { board, currentPlayer } = state;

// Clone board array (don't mutate original)
// Spread creates shallow copy of board array
const boardClone = [...board];

// Clone the specific column being modified
// Must clone to avoid mutating original
const colClone = [...relevantCol];
```

**Purpose:** Create copies to avoid mutating state.

**Why Clone:**

```javascript
// ❌ WRONG: Mutates original state
const col = state.board[0];
col[5] = 1; // Mutates original! React won't detect change

// ✓ CORRECT: Clone and modify copy
const boardClone = [...state.board];
const colClone = [...state.board[0]];
colClone[5] = 1; // Modifies copy only
boardClone[0] = colClone; // New board with modified column
```

---

### **10. Move Action - Part 3: Place Tile**

```javascript
// Find lowest empty row in column
// lastIndexOf(null) finds rightmost null (bottom-most empty)
const rowIndex = colClone.lastIndexOf(null);

// Place current player's tile
colClone[rowIndex] = currentPlayer;

// Update board with modified column
boardClone[action.colIndex] = colClone;
```

**Purpose:** Simulate gravity by placing tile at lowest position.

**lastIndexOf() for Gravity:**

```javascript
colClone = [null, null, null, 1, 2, 1]

colClone.lastIndexOf(null)  // Returns 2 (last null before filled tiles)

// After placing:
colClone[2] = 1  →  [null, null, 1, 1, 2, 1]

// Visual representation (top to bottom):
[null]   ← Row 0 (empty)
[null]   ← Row 1 (empty)
[1]      ← Row 2 (just placed!) ← NEW
[1]      ← Row 3
[2]      ← Row 4
[1]      ← Row 5 (bottom)
```

---

### **11. Move Action - Part 4: Win Detection**

```javascript
// Check all four win directions from placed tile

// Vertical: Check up/down (rowIncrement=1, colIncrement=0)
const didWinVertical = didWin(
  boardClone,
  rowIndex,
  action.colIndex,
  1,
  0,
  currentPlayer
);

// Horizontal: Check left/right (rowIncrement=0, colIncrement=1)
const didWinHorizontal = didWin(
  boardClone,
  rowIndex,
  action.colIndex,
  0,
  1,
  currentPlayer
);

// Diagonal: Check both diagonals
// Diagonal ↘: (rowIncrement=1, colIncrement=1)
// Diagonal ↙: (rowIncrement=-1, colIncrement=1)
const didWinDiagonal =
  didWin(boardClone, rowIndex, action.colIndex, 1, 1, currentPlayer) ||
  didWin(boardClone, rowIndex, action.colIndex, -1, 1, currentPlayer);

// Determine winner
const winner =
  didWinVertical || didWinHorizontal || didWinDiagonal ? currentPlayer : null;
```

**Purpose:** Check if current move created a winning condition.

**Four Directions:**

```
Vertical (↓):      Horizontal (→):     Diagonal (↘):      Diagonal (↙):
row+1, col+0       row+0, col+1        row+1, col+1       row-1, col+1

  X                X X X X                X                      X
  X                                         X                  X
  X                                           X              X
  X                                             X          X
```

---

### **12. Move Action - Part 5: Check Board Full**

```javascript
// Check if board is completely full
// every() checks if ALL columns are full
// Column is full if ALL tiles are not null
const isBoardFull = boardClone.every((column) =>
  column.every((val) => val != null)
);
```

**Purpose:** Detect draw condition (board full, no winner).

**Double every():**

```javascript
boardClone.every(column =>
  column.every(val => val != null)
)

// Outer every: All columns must be full
// Inner every: All tiles in column must be non-null

// Example:
board = [
  [1, 2, 1, 2, 1, 2],  // Full column ✓
  [1, 2, 1, 2, 1, 2],  // Full column ✓
  [1, 2, 1, 2, 1, null] // Not full ✗
]
// isBoardFull = false (third column has null)

board = [
  [1, 2, 1, 2, 1, 2],  // All full
  [1, 2, 1, 2, 1, 2],
  ...all columns full
]
// isBoardFull = true
```

---

### **13. Move Action - Part 6: Return New State**

```javascript
// Return new state object
return {
  board: boardClone, // Updated board
  currentPlayer: currentPlayer === 1 ? 2 : 1, // Switch players
  winner, // null or 1/2
  isGameOver: winner != null || isBoardFull, // End if won or full
};
```

**Purpose:** Return completely new state object.

**Player Switching:**

```javascript
currentPlayer: currentPlayer === 1 ? 2 : 1

// Examples:
currentPlayer = 1 → next is 2
currentPlayer = 2 → next is 1

// Alternates between players each turn
```

---

### **14. genEmptyState Function**

```javascript
/**
 * Generates initial/reset game state
 * Creates empty 7x6 board
 * @returns {Object} Initial game state
 */
function genEmptyState() {
  return {
    // Create 7 columns, each with 6 null tiles
    board: new Array(NUM_COL)
      .fill(null)
      .map((_) => new Array(NUM_ROW).fill(null)),

    currentPlayer: 1, // Player 1 starts
    winner: null, // No winner yet
    isGameOver: false, // Game is active
  };
}
```

**Purpose:** Create fresh game state.

**Array Generation:**

```javascript
// Step 1: Create array of 7 elements
new Array(7)  // [empty × 7]

// Step 2: Fill with null
.fill(null)   // [null, null, null, null, null, null, null]

// Step 3: Map each null to array of 6 nulls
.map(_ => new Array(6).fill(null))

// Result:
[
  [null, null, null, null, null, null],  // Column 0
  [null, null, null, null, null, null],  // Column 1
  [null, null, null, null, null, null],  // Column 2
  [null, null, null, null, null, null],  // Column 3
  [null, null, null, null, null, null],  // Column 4
  [null, null, null, null, null, null],  // Column 5
  [null, null, null, null, null, null],  // Column 6
]
```

---

### **15. didWin Function - Part 1: Count Forward**

```javascript
/**
 * Checks if placing a tile resulted in 4+ in a row
 * Counts tiles in specified direction from starting position
 * @param {Array} board - Game board
 * @param {number} startingRow - Row of placed tile
 * @param {number} startingColumn - Column of placed tile
 * @param {number} rowIncrement - Direction to move in rows (-1, 0, or 1)
 * @param {number} colIncrement - Direction to move in columns (-1, 0, or 1)
 * @param {number} currentPlayer - Player who just moved (1 or 2)
 * @returns {boolean} True if 4+ in a row found
 */
function didWin(
  board,
  startingRow,
  startingColumn,
  rowIncrement,
  colIncrememt,
  currentPlayer
) {
  // Counter for consecutive tiles
  let numInRow = 0;

  // Current position (starts at placed tile)
  let currRow = startingRow;
  let currColumn = startingColumn;

  // Count forward in specified direction
  // Stop when: out of bounds OR not current player's tile
  while (
    currColumn < NUM_COL &&           // Within board width
    currRow < NUM_ROW &&              // Within board height
    board[currColumn][currRow] === currentPlayer  // Matches player
  ) {
    numInRow++;                       // Found matching tile
    currRow += rowIncrement;          // Move to next row
    currColumn += colIncrememt;       // Move to next column
  }
```

**Purpose:** Count consecutive tiles in one direction.

**Example: Vertical Check**

```javascript
// Board column: [null, null, 1, 1, 1, 2]
// Just placed: Player 1 at row 2, col 0
// Check vertical (rowInc=1, colInc=0)

startingRow = 2, startingColumn = 0

// Iteration 1:
currRow=2, currColumn=0
board[0][2] === 1 → true
numInRow = 1
currRow = 3, currColumn = 0

// Iteration 2:
currRow=3, currColumn=0
board[0][3] === 1 → true
numInRow = 2
currRow = 4, currColumn = 0

// Iteration 3:
currRow=4, currColumn=0
board[0][4] === 1 → true
numInRow = 3
currRow = 5, currColumn = 0

// Iteration 4:
currRow=5, currColumn=0
board[0][5] === 2 → false (Player 2's tile)
STOP

numInRow = 3 (so far)
```

---

### **16. didWin Function - Part 2: Count Backward**

```javascript
  // Count backward in opposite direction
  // Start one step back from placed tile
  currRow = startingRow - rowIncrement;
  currColumn = startingColumn - colIncrememt;

  // Count backward until: out of bounds OR not current player's tile
  while (
    currColumn >= 0 &&                // Within board (left edge)
    currRow >= 0 &&                   // Within board (top edge)
    board[currColumn][currRow] === currentPlayer
  ) {
    numInRow++;                       // Found matching tile
    currRow -= rowIncrement;          // Move backward in rows
    currColumn -= colIncrememt;       // Move backward in columns
  }

  // Return true if 4 or more in a row
  return numInRow >= NUM_TO_WIN;
}
```

**Purpose:** Count tiles in opposite direction to get total.

**Why Count Both Directions:**

```
Placed tile could be in middle of winning sequence:

1 1 X 1
    ↑
  placed

Forward count: X 1 = 1 tile
Backward count: 1 1 = 2 tiles
Total: 3 tiles (not a win)

But if:
1 1 X 1 1
    ↑
  placed

Forward: 1 1 = 2 tiles
Backward: 1 1 = 2 tiles
Total: 5 tiles (WIN!)
```
