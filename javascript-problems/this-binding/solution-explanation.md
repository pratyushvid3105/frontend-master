# This Binding Solution - Step-by-Step Explanation

## Overview

This solution implements custom `this` binding by temporarily adding the function as a property on the target object, then immediately removing it. The use of Symbols and `Object.defineProperty` ensures no side effects or property conflicts.

## Core Strategy

### **The Trick: Temporary Property Assignment**

To bind `this` without using native binding methods, the solution exploits a fundamental JavaScript rule:

```javascript
obj.method(); // 'this' inside method refers to obj
```

By temporarily making the function a property of `thisContext`, calling it automatically binds `this` correctly.

### **Symbol for Collision Prevention**

Using a Symbol as the property key prevents:

- Name collisions with existing properties
- Enumeration in for...in loops
- Accidental access or modification

### **Object.defineProperty for Side-Effect Minimization**

Makes the temporary property non-enumerable, ensuring it doesn't appear in property iteration.

## Step-by-Step Breakdown

### 1. **myCall Implementation**

```javascript
Function.prototype.myCall = function (thisContext, ...args) {
```

**Setup:**

- Adds method to Function prototype (available on all functions)
- `this` inside myCall refers to the original function being called
- Rest parameters collect all additional arguments

---

```javascript
const symbol = Symbol();
```

**Purpose:** Create unique property key

**Why Symbol?**

- Guaranteed unique (no collision with existing properties)
- Non-enumerable by default in for...in loops
- Won't interfere with Object.keys(), JSON.stringify(), etc.

**Alternative (problematic):**

```javascript
const key = "__temp_function__"; // Could collide with existing property!
```

---

```javascript
Object.defineProperty(thisContext, symbol, {
  value: this,
  enumerable: false,
  configurable: true,
});
```

**Purpose:** Add function as hidden, temporary property on thisContext

**Property Descriptor Breakdown:**

- `value: this` - The original function to be called
- `enumerable: false` - Won't show up in for...in, Object.keys()
- `configurable: true` - Allows deletion with `delete` later

**Why not simple assignment?**

```javascript
// This would work but makes property enumerable:
thisContext[symbol] = this;

// Our approach ensures no side effects:
for (let key in thisContext) {
} // Won't see our symbol
```

---

```javascript
const result = thisContext[symbol](...args);
```

**The Magic Moment:**

- Calls function as if it's a method on thisContext
- `thisContext[symbol]` accesses our temporary function
- Calling it with `thisContext.method()` syntax binds `this` correctly
- Spreads args as individual parameters
- Stores return value for later

**How this works:**

```javascript
const obj = { num: 5 };
// After adding function as property:
// obj[symbol] = function logNums(x, y) { console.log(this.num, x, y); }
// Calling obj[symbol](1, 2) makes 'this' === obj
```

---

```javascript
delete thisContext[symbol];
```

**Cleanup:**

- Removes temporary property
- Restores thisContext to original state
- No side effects remain

---

```javascript
return result;
```

**Return original function's result**

### 2. **myApply Implementation**

```javascript
Function.prototype.myApply = function (thisContext, args = []) {
  return this.myCall(thisContext, ...args);
};
```

**Elegant Reuse:**

- Delegates to myCall (DRY principle)
- Spreads array into individual arguments
- Default empty array handles missing args parameter

**Logic:**

```javascript
myApply(obj, [1, 2, 3])
  ↓ spreads array
myCall(obj, 1, 2, 3)
```

### 3. **myBind Implementation**

```javascript
Function.prototype.myBind = function (thisContext, ...args) {
  return (...newArgs) => this.myApply(thisContext, [...args, ...newArgs]);
};
```

**Closure-Based Partial Application:**

**Outer Function:**

- Captures: `thisContext`, original `args`, and `this` (the function)
- Returns: New function with bound context

**Inner Function (arrow function):**

- Accepts: Additional arguments when called
- Combines: Original args + new args
- Delegates: To myApply for execution

**Why Arrow Function?**

```javascript
return (...newArgs) => this.myApply(...) // 'this' lexically bound to outer 'this'
```

Using regular function would require:

```javascript
const self = this;
return function (...newArgs) {
  return self.myApply(thisContext, [...args, ...newArgs]);
};
```

**Execution Flow:**

```javascript
const boundFn = logNums.myBind(obj, 1, 2);
// Closure captures: thisContext=obj, args=[1,2], this=logNums

boundFn(3, 4);
// newArgs = [3, 4]
// Combined: [...[1,2], ...[3,4]] = [1,2,3,4]
// Calls: logNums.myApply(obj, [1,2,3,4])
```

## Complete Execution Trace

### **Example: myCall**

```javascript
const obj = { num: 0 };
function logNums(x, y) {
  console.log(this.num, x, y);
}
logNums.myCall(obj, 1, 2);
```

**Step-by-step:**

```
1. myCall called on logNums with thisContext=obj, args=[1,2]
2. symbol = Symbol() // e.g., Symbol()
3. obj[symbol] = logNums (via defineProperty)
   State: obj = { num: 0, [Symbol()]: logNums }
4. result = obj[symbol](1, 2)
   - Executes: logNums with this=obj, x=1, y=2
   - Inside logNums: this.num is obj.num = 0
   - Logs: "0 1 2"
5. delete obj[symbol]
   State: obj = { num: 0 } // back to original
6. return result // undefined (console.log returns undefined)
```

### **Example: myBind**

```javascript
const boundFunction = logNums.myBind(obj, 1);
boundFunction(2);
```

**Step-by-step:**

```
1. myBind called on logNums with thisContext=obj, args=[1]
2. Closure created capturing:
   - thisContext = obj
   - args = [1]
   - this = logNums
3. Returns arrow function: (...newArgs) => ...
4. boundFunction(2) called
5. newArgs = [2]
6. Combined args: [...[1], ...[2]] = [1, 2]
7. Calls: logNums.myApply(obj, [1, 2])
   ↓ which calls
   logNums.myCall(obj, 1, 2)
   ↓ which executes
   (same as myCall example above)
```

## Design Decisions

### **1. Symbol vs String Key**

```javascript
// Bad: String key
thisContext["__temp__"] = this;
// Problem: Could collide with existing property

// Good: Symbol key
thisContext[Symbol()] = this;
// Guaranteed unique, no collision
```

### **2. Object.defineProperty vs Direct Assignment**

```javascript
// Works but enumerable:
thisContext[symbol] = this;
for (let key in thisContext) {
  /* symbol appears! */
}

// Better - non-enumerable:
Object.defineProperty(thisContext, symbol, {
  enumerable: false,
});
for (let key in thisContext) {
  /* symbol hidden */
}
```

### **3. Arrow Function in myBind**

```javascript
// Arrow function preserves 'this'
return (...newArgs) => this.myApply(...)

// Regular function would lose 'this'
return function(...newArgs) {
  // 'this' here is NOT the original function!
}
```

## Edge Cases Handled

### **1. No Property Pollution**

```javascript
const obj = { a: 1 };
function fn() {
  return this.a;
}
fn.myCall(obj);
// obj is still { a: 1 } - no side effects
```

### **2. Return Values Preserved**

```javascript
function multiply(x, y) {
  return x * y;
}
const result = multiply.myCall({}, 5, 3);
// result = 15 (return value preserved)
```

### **3. Empty Args Array**

```javascript
fn.myApply(obj); // args defaults to []
fn.myApply(obj, []); // explicit empty array
// Both work correctly
```

### **4. Argument Combination**

```javascript
const bound = fn.myBind(obj, 1, 2);
bound(3, 4, 5);
// Combines: [1, 2] + [3, 4, 5] = [1, 2, 3, 4, 5]
```

This implementation provides robust `this` binding functionality while maintaining clean state and preventing side effects.
