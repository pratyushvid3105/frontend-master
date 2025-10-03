# Event Target Solution - Step-by-Step Explanation

## Overview

This solution implements a custom event system using a Map-of-Sets data structure. The Map stores event names as keys, and each value is a Set containing callback functions, automatically handling duplicate prevention.

## Data Structure Strategy

### **Map + Set Architecture**

```
eventListenerMap (Map)
├─ 'click' → Set { callback1, callback2, callback3 }
├─ 'hover' → Set { callbackA }
└─ 'submit' → Set { callbackX, callbackY }
```

**Why this structure?**

- **Map**: Fast O(1) lookup by event name
- **Set**: Automatically prevents duplicate callbacks
- **Combination**: Efficient storage and duplicate handling

## Step-by-Step Breakdown

### 1. **Constructor - Initialization**

```javascript
constructor() {
  this.eventListenerMap = new Map();
}
```

**Purpose:** Initialize empty Map to store all event listeners

**State After Creation:**

```javascript
new EventTarget() → { eventListenerMap: Map {} }
```

### 2. **addEventListener - Register Callbacks**

```javascript
addEventListener(name, callback) {
  if (!this.eventListenerMap.has(name)) {
    this.eventListenerMap.set(name, new Set());
  }
  this.eventListenerMap.get(name).add(callback);
}
```

**Algorithm:**

1. Check if event name already exists in Map
2. If not, create new Set for this event
3. Add callback to the Set (Set prevents duplicates automatically)

**Example Execution:**

```javascript
const target = new EventTarget();
const onClick = () => console.log("clicked");

// First addEventListener call
target.addEventListener("click", onClick);
// Map: { 'click' → Set { onClick } }

// Second addEventListener with SAME callback (duplicate)
target.addEventListener("click", onClick);
// Map: { 'click' → Set { onClick } } // Set prevents duplicate!

// Third addEventListener with DIFFERENT callback
const onClick2 = () => console.log("clicked again");
target.addEventListener("click", onClick2);
// Map: { 'click' → Set { onClick, onClick2 } }
```

**Key Feature:** Set's `.add()` method automatically handles duplicates - adding the same function reference twice has no effect.

### 3. **removeEventListener - Unregister Callbacks**

```javascript
removeEventListener(name, callback) {
  this.eventListenerMap.get(name)?.delete(callback);
}
```

**Optional Chaining Breakdown:**

- `this.eventListenerMap.get(name)` → Returns Set or `undefined`
- `?.delete(callback)` → Only calls delete if Set exists, otherwise does nothing

**Algorithm:**

1. Attempt to get Set for event name
2. If Set exists, remove callback from it
3. If Set doesn't exist, `?.` short-circuits (no error)

**Example Execution:**

```javascript
// Starting state: Map { 'click' → Set { onClick, onClick2 } }

target.removeEventListener("click", onClick);
// Map: { 'click' → Set { onClick2 } }

target.removeEventListener("nonexistent", onClick);
// No error! Optional chaining prevents crash
// Map: { 'click' → Set { onClick2 } } // unchanged

target.removeEventListener("click", onClick2);
// Map: { 'click' → Set {} } // Empty Set remains
```

**Important:** Removing a callback only affects that specific callback, not other callbacks for the same event.

### 4. **dispatchEvent - Trigger Callbacks**

```javascript
dispatchEvent(name) {
  this.eventListenerMap.get(name)?.forEach(callback => callback());
}
```

**Optional Chaining Breakdown:**

- `this.eventListenerMap.get(name)` → Returns Set or `undefined`
- `?.forEach(...)` → Only iterates if Set exists, otherwise does nothing

**Algorithm:**

1. Attempt to get Set of callbacks for event name
2. If Set exists, iterate through all callbacks and invoke each
3. If Set doesn't exist, `?.` short-circuits (no error)

**Example Execution:**

```javascript
const target = new EventTarget();
const log1 = () => console.log("first");
const log2 = () => console.log("second");

target.addEventListener("test", log1);
target.addEventListener("test", log2);

// Dispatch triggers ALL callbacks
target.dispatchEvent("test");
// Console output:
// "first"
// "second"

// Dispatch nonexistent event - no error
target.dispatchEvent("nonexistent");
// No output, no error

// Dispatch can be called multiple times
target.dispatchEvent("test");
// Console output again:
// "first"
// "second"
```

## Design Pattern Analysis

### **Observer Pattern Implementation**

This is a classic implementation of the Observer/Pub-Sub pattern:

- **Subject**: EventTarget instance
- **Observers**: Callback functions
- **Subscribe**: addEventListener
- **Unsubscribe**: removeEventListener
- **Notify**: dispatchEvent

### **Data Structure Advantages**

**Map Benefits:**

- O(1) lookup by event name
- Clear key-value semantics
- `.has()`, `.get()`, `.set()` methods

**Set Benefits:**

- Automatic duplicate prevention
- O(1) add/delete operations
- Maintains insertion order
- `.forEach()` for iteration

**Combined Power:**

```javascript
// No manual duplicate checking needed!
addEventListener(name, callback) {
  // Set.add() is idempotent for same reference
  this.map.get(name).add(callback);
}
```

## Optional Chaining (`?.`) Power

### **Without Optional Chaining:**

```javascript
removeEventListener(name, callback) {
  const callbacks = this.eventListenerMap.get(name);
  if (callbacks) {
    callbacks.delete(callback);
  }
}
```

### **With Optional Chaining:**

```javascript
removeEventListener(name, callback) {
  this.eventListenerMap.get(name)?.delete(callback);
}
```

**Benefits:**

- Concise code
- No error if event doesn't exist
- Same functionality, fewer lines

## Instance Isolation

**Critical Feature:** Each EventTarget instance has its own Map:

```javascript
const target1 = new EventTarget();
const target2 = new EventTarget();

target1.addEventListener("click", () => console.log("target1"));
target2.addEventListener("click", () => console.log("target2"));

target1.dispatchEvent("click"); // Only logs "target1"
target2.dispatchEvent("click"); // Only logs "target2"
```

This is achieved because each instance gets its own `eventListenerMap` in the constructor.

## Edge Cases Handled

### **1. Duplicate Registration**

```javascript
target.addEventListener("click", onClick);
target.addEventListener("click", onClick); // No effect
// Set prevents duplicate
```

### **2. Removing Nonexistent Listener**

```javascript
target.removeEventListener("nonexistent", callback);
// Optional chaining prevents error
```

### **3. Dispatching Nonexistent Event**

```javascript
target.dispatchEvent("nonexistent");
// Optional chaining prevents error
```

### **4. Multiple Callbacks Same Event**

```javascript
target.addEventListener("click", callback1);
target.addEventListener("click", callback2);
target.dispatchEvent("click");
// Both callbacks execute
```

### **5. Empty Event Set**

```javascript
target.addEventListener("click", callback);
target.removeEventListener("click", callback);
// Set becomes empty but remains in Map
// Minor memory overhead, but harmless
```

This implementation provides a clean, efficient event system using modern JavaScript features.
