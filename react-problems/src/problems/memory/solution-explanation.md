# Memory Game Solution - Step-by-Step Explanation

## Overview

This React component implements a memory matching game where players flip tiles to find matching pairs. The game tracks selected tiles, matches, and provides win conditions with restart functionality.

## Game Logic Architecture

### **State Management Strategy**

The solution uses three key state variables:

- `tiles`: Array of shuffled color strings representing the board
- `selectedTiles`: Array of indices for currently selected tiles (max 2)
- `matchedTiles`: Array of indices for successfully matched tiles

### **Game Flow Design**

1. **Initial Setup** → Shuffle tiles and render board
2. **Tile Selection** → Track up to 2 selected tiles
3. **Match Evaluation** → Compare selected tiles after 2 selections
4. **Match Resolution** → Keep matches or reset after delay
5. **Win Detection** → Check if all tiles are matched
6. **Game Restart** → Reset state and reshuffle

## Step-by-Step Breakdown

### 1. **Initial State Setup**

```javascript
const [tiles, setTiles] = useState(shuffle([...TILE_COLORS, ...TILE_COLORS]));
const [selectedTiles, setSelectedTiles] = useState([]);
const [matchedTiles, setMatchedTiles] = useState([]);
```

**Board Generation:**

- Creates pairs by duplicating TILE_COLORS array: `['red', 'green', 'blue', 'yellow', 'red', 'green', 'blue', 'yellow']`
- Shuffles the array to randomize tile positions
- Initializes empty selection and match tracking

### 2. **Match Evaluation Effect**

```javascript
useEffect(() => {
  if (selectedTiles.length < 2) return;

  if (tiles[selectedTiles[0]] === tiles[selectedTiles[1]]) {
    // Match found - add to matched tiles
    setMatchedTiles([...matchedTiles, ...selectedTiles]);
    setSelectedTiles([]);
  } else {
    // No match - clear selections after 1 second
    const timeoutId = setTimeout(() => setSelectedTiles([]), 1000);
    return () => clearTimeout(timeoutId);
  }
}, [selectedTiles]);
```

**Match Logic:**

- Triggers only when exactly 2 tiles are selected
- Compares colors at selected indices in tiles array
- **Match**: Permanently adds indices to matchedTiles
- **No Match**: Uses setTimeout to clear selections after 1 second
- **Cleanup**: Returns clearTimeout to prevent memory leaks

### 3. **Tile Click Handler**

```javascript
const handleTileClick = (tileIndex) => {
  if (
    selectedTiles.length >= 2 ||
    selectedTiles.includes(tileIndex) ||
    matchedTiles.includes(tileIndex)
  ) {
    return;
  }
  setSelectedTiles([...selectedTiles, tileIndex]);
};
```

**Click Protection:**

- **Blocks** clicks when 2 tiles already selected (during evaluation)
- **Blocks** re-clicking already selected tiles
- **Blocks** clicking already matched tiles
- **Allows** adding tile index to selectedTiles array

### 4. **Dynamic CSS Class Assignment**

```javascript
const isPairMatched =
  selectedTiles.includes(tileIndex) || matchedTiles.includes(tileIndex);
const className = isPairMatched ? `tile ${tileColor}` : "tile";
```

**Visual State Logic:**

- Shows color class if tile is currently selected OR permanently matched
- Hides color (shows only "tile" class) for unselected, unmatched tiles
- Creates the "flip" effect by conditionally showing colors

### 5. **Win Condition Detection**

```javascript
const playerWinStatus = matchedTiles.length === tiles.length;
```

**Win Logic:**

- Simple comparison: all 8 tiles matched when matchedTiles has 8 indices
- Triggers UI changes: title becomes "You Win!" and restart button appears

### 6. **Game Restart Functionality**

```javascript
const handleRestart = () => {
  setMatchedTiles([]);
  setSelectedTiles([]);
  setTiles(shuffle([...TILE_COLORS, ...TILE_COLORS]));
};
```

**Reset Operations:**

- Clears all game state back to initial values
- Reshuffles tiles to new random positions
- Hides restart button and resets title

### 7. **Shuffle Algorithm**

```javascript
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
  return array;
}
```

**Fisher-Yates Shuffle:**

- Iterates backwards through array
- Swaps each element with randomly chosen earlier element
- Provides unbiased randomization
- Modifies array in-place and returns it

## Key Implementation Patterns

### **Temporal State Management**

- Uses setTimeout for delayed state changes
- Properly cleans up timers to prevent memory leaks
- Creates "thinking pause" for better user experience

### **Index-Based Selection**

- Stores tile indices rather than colors for selection tracking
- Allows multiple tiles of same color to be tracked independently
- Enables efficient lookups for click protection

### **Conditional Rendering**

- Dynamic CSS classes based on game state
- Conditional restart button visibility
- Title changes based on win status

### **Immutable State Updates**

- Uses spread operators for array updates
- Maintains React's state update requirements
- Ensures proper re-renders when state changes

## Game State Transitions

```
Initial: [tiles shuffled, no selections, no matches]
    ↓ (click tile)
Selection: [1 tile selected, showing color]
    ↓ (click second tile)
Evaluation: [2 tiles selected, both showing colors]
    ↓ (match check)
Match Found: [tiles move to matched, selections clear]
    OR
No Match: [wait 1 second, then hide both colors]
    ↓ (repeat until all matched)
Win State: [all tiles matched, "You Win!", restart button]
    ↓ (click restart)
Reset: [back to initial state with new shuffle]
```

This architecture provides robust game logic while maintaining clean separation between state management, user interaction, and visual presentation.
