# Corresponding Node Solution - Step-by-Step Explanation

## Overview

This solution finds a corresponding node in one DOM tree that matches the position of a given node in another identically-structured DOM tree. The key technique is **parallel tree traversal** using two stacks, where both trees are traversed simultaneously in the same order. When the target node is found in tree1, the current node in tree2 is the corresponding match.

## Implementation Strategy

### **Core Approach: Parallel Depth-First Search (DFS)**

The solution uses:

1. **Two stacks** → Maintain parallel traversal of both trees
2. **Iterative DFS** → Traverse trees in the same order simultaneously
3. **Synchronous popping** → Process corresponding nodes at the same time
4. **Identity check** → When node1 is found, return corresponding node2

This approach guarantees finding the corresponding node because both trees have identical structures and are traversed in exactly the same order.

---

## Step-by-Step Breakdown

### **1. Initial Setup: Stack Initialization**

```javascript
/**
 * Finds the corresponding node in tree2 that matches node1's position in tree1
 * Uses parallel iterative DFS with two stacks
 * @param {Element} tree1 - Root of first DOM tree
 * @param {Element} tree2 - Root of second DOM tree (same structure as tree1)
 * @param {Element} node1 - Target node in tree1 to find correspondence for
 * @returns {Element} Corresponding node in tree2
 */
function correspondingNode(tree1, tree2, node1) {
  // Initialize two stacks for parallel traversal
  // stack1 tracks nodes in the first tree
  // stack2 tracks corresponding nodes in the second tree
  // Both stacks start with their respective root nodes
  const stack1 = [tree1];
  const stack2 = [tree2];
```

**Purpose:** Set up data structures for parallel tree traversal.

**Why use stacks:**

- Stacks enable iterative Depth-First Search (DFS)
- LIFO (Last In, First Out) ensures proper tree traversal order
- Two stacks maintain correspondence between trees

**Initial State:**

```
stack1: [tree1 root]
stack2: [tree2 root]

Both stacks have one element each (the root nodes)
These roots correspond to each other
```

**Visual Representation:**

```
tree1:          stack1:         stack2:         tree2:
  A              [A]              [X]              X
 / \                                              / \
B   C                                            Y   Z

Initial state: Both stacks contain only root nodes
```

---

### **2. Main Loop: Parallel Traversal**

```javascript
  // Continue processing while there are nodes to visit
  // Loop terminates when stack1 is empty (all nodes processed)
  while (stack1.length > 0) {
```

**Purpose:** Process all nodes in both trees until target is found.

**Loop Invariant:**

- `stack1.length === stack2.length` (always same size)
- Nodes at same stack position correspond to each other
- Both trees traversed in identical order

**Example Iteration:**

```
Iteration 1: stack1.length = 1 (has root)
Iteration 2: stack1.length = 3 (has children)
Iteration 3: stack1.length = 2 (processed one child)
...
Iteration N: stack1.length = 0 (done)
```

---

### **3. Pop Corresponding Nodes**

```javascript
// Pop one node from each stack
// These two nodes are in corresponding positions in their respective trees
// pop() removes and returns the last element (LIFO)
const currentNode1 = stack1.pop();
const currentNode2 = stack2.pop();
```

**Purpose:** Get the next pair of corresponding nodes to process.

**How `pop()` works:**

```javascript
const arr = [1, 2, 3];
arr.pop(); // Returns 3, arr is now [1, 2]
arr.pop(); // Returns 2, arr is now [1]
```

**Visual Example:**

```
Before pop:
stack1: [A, B, C]
stack2: [X, Y, Z]

After pop:
currentNode1 = C
currentNode2 = Z
stack1: [A, B]
stack2: [X, Y]

C and Z correspond to each other (same position in their trees)
```

**Key Point:** Because we always push and pop from both stacks together, the nodes we pop are always in corresponding positions.

---

### **4. Push Children to Stacks**

```javascript
// Add all children of current nodes to their respective stacks
// Spread operator (...) expands children array into individual arguments
// Children are added in order, which maintains tree structure correspondence
stack1.push(...currentNode1.children);
stack2.push(...currentNode2.children);
```

**Purpose:** Continue traversal by adding child nodes.

**How spread operator works:**

```javascript
const parent = { children: [child1, child2, child3] };
stack.push(...parent.children);

// Equivalent to:
stack.push(child1, child2, child3);

// NOT equivalent to:
stack.push([child1, child2, child3]); // This would push an array
```

**Why use spread operator:**

- Adds each child individually to stack
- Maintains proper traversal order
- Cleaner syntax than looping

**Example Execution:**

```
Current state:
currentNode1 has 3 children: [B, C, D]
currentNode2 has 3 children: [Y, Z, W]

Before push:
stack1: [A]
stack2: [X]

After push:
stack1: [A, B, C, D]
stack2: [X, Y, Z, W]

Note: B↔Y, C↔Z, D↔W are corresponding pairs
```

**Visual Tree Traversal:**

```
tree1:              tree2:
    A                   X
   /|\                 /|\
  B C D               Y Z W
 /|   |\             /|   |\
E F   G H           J K   L M

Step 1: Pop A and X
  stack1 = [B, C, D]
  stack2 = [Y, Z, W]

Step 2: Pop D and W
  Push children: [G, H] and [L, M]
  stack1 = [B, C, G, H]
  stack2 = [Y, Z, L, M]

Step 3: Pop H and M
  (no children)
  stack1 = [B, C, G]
  stack2 = [Y, Z, L]
```

---

### **5. Check for Target Node**

```javascript
    // Check if current node in tree1 is the target node
    // Use strict equality (===) to check object identity
    // Not checking values or properties, just if it's the exact same object
    if (currentNode1 === node1) {
      // Found the target node in tree1
      // Return the corresponding node from tree2
      // This is the answer!
      return currentNode2;
    }
  }  // End of while loop
}  // End of function
```

**Purpose:** Identify when target node is found and return corresponding node.

**Identity Check (===):**

```javascript
// === checks if two references point to the same object
const obj1 = { value: 5 };
const obj2 = { value: 5 };
const ref1 = obj1;

obj1 === obj2; // false (different objects)
obj1 === ref1; // true (same object reference)
```

**Example: Finding Target**

```
Looking for node1 = <h2> element in tree1

Iteration 1: currentNode1 = <div> (root)
  currentNode1 === node1? false
  Continue...

Iteration 2: currentNode1 = <main>
  currentNode1 === node1? false
  Continue...

Iteration 3: currentNode1 = <div>
  currentNode1 === node1? false
  Continue...

Iteration 4: currentNode1 = <h2>
  currentNode1 === node1? TRUE ✓
  Return currentNode2 (which is <img> at same position in tree2)
```

## Key Concepts Explained

### **1. Depth-First Search (DFS) Order**

The algorithm uses DFS traversal, processing nodes in this order:

```
Tree:
      A
     /|\
    B C D
   /|   |
  E F   G

DFS Order (stack-based):
1. A (start)
2. D (last child of A, added last, popped first)
3. G (child of D)
4. C (middle child of A)
5. B (first child of A)
6. F (last child of B)
7. E (first child of B)

Stack states:
[A]
[B, C, D]         ← A popped, children pushed
[B, C, G]         ← D popped, child pushed
[B, C]            ← G popped (no children)
[B, F, E]         ← B still there, C popped
...
```

---

### **2. Why Parallel Traversal Works**

Both trees have identical structure, so:

```
If tree1:              And tree2:
    A                      X
   / \                    / \
  B   C                  Y   Z
 / \   \                / \   \
D   E   F              J   K   L

Then traversal order is identical:
tree1: A, C, F, B, E, D
tree2: X, Z, L, Y, K, J

Position 1: A ↔ X (both roots)
Position 2: C ↔ Z (both second popped)
Position 3: F ↔ L (both third popped)
Position 4: B ↔ Y (both fourth popped)
Position 5: E ↔ K (both fifth popped)
Position 6: D ↔ J (both sixth popped)
```

**Key Insight:** Because structures are identical, the nth node visited in tree1 corresponds to the nth node visited in tree2.

---

### **3. Stack vs Queue (DFS vs BFS)**

This solution uses a **stack (DFS)**, but a **queue (BFS)** would also work:

**Stack-based DFS (current solution):**

```javascript
const stack = [root];
while (stack.length > 0) {
  const node = stack.pop(); // LIFO
  stack.push(...node.children);
}
// Order: Deep first, then wide
```

**Queue-based BFS (alternative):**

```javascript
const queue = [root];
while (queue.length > 0) {
  const node = queue.shift(); // FIFO
  queue.push(...node.children);
}
// Order: Wide first, then deep
```

**Both work** because both traverse all nodes and maintain correspondence!

---

### **4. The Spread Operator (...)**

Understanding `...currentNode1.children`:

```javascript
const parent = document.querySelector("div");
// parent.children is HTMLCollection: [child1, child2, child3]

// WITHOUT spread:
stack.push(parent.children);
// stack = [[child1, child2, child3]]  ← Array inside array

// WITH spread:
stack.push(...parent.children);
// stack = [child1, child2, child3]  ← Individual elements ✓

// Equivalent to:
stack.push(parent.children[0], parent.children[1], parent.children[2]);
```

---

### **5. Why === (Identity Check)**

We use `===` to check object identity, not equality:

```javascript
const div1 = document.createElement("div");
const div2 = document.createElement("div");
const ref = div1;

div1 === div2; // false (different objects)
div1 === ref; // true (same object)

// For our function:
currentNode1 === node1;
// Checks if currentNode1 IS the exact same DOM element as node1
// Not checking if they have same properties or content
```

---

## Complete Execution Example

### **Sample DOM Trees:**

```javascript
tree1:
<div>
  <main>
    <h1>Heading</h1>
    <div>
      <h2>test1</h2>
    </div>
  </main>
</div>

tree2:
<main>
  <article>
    <h1>Heading2</h1>
    <section>
      <img src="img.png" />
    </section>
  </article>
</main>

Find: correspondingNode(tree1, tree2, <h2> element)
```

### **Step-by-Step Execution:**

```
Initial:
stack1 = [<div>]
stack2 = [<main>]

─────────────────────────────────────

Iteration 1:
Pop: currentNode1 = <div>, currentNode2 = <main>
Push children:
  tree1 <div> has 1 child: <main>
  tree2 <main> has 1 child: <article>
stack1 = [<main>]
stack2 = [<article>]
Check: <div> === <h2>? No

─────────────────────────────────────

Iteration 2:
Pop: currentNode1 = <main>, currentNode2 = <article>
Push children:
  tree1 <main> has 2 children: <h1>, <div>
  tree2 <article> has 2 children: <h1>, <section>
stack1 = [<h1>, <div>]
stack2 = [<h1>, <section>]
Check: <main> === <h2>? No

─────────────────────────────────────

Iteration 3:
Pop: currentNode1 = <div>, currentNode2 = <section>
Push children:
  tree1 <div> has 1 child: <h2>
  tree2 <section> has 1 child: <img>
stack1 = [<h1>, <h2>]
stack2 = [<h1>, <img>]
Check: <div> === <h2>? No

─────────────────────────────────────

Iteration 4:
Pop: currentNode1 = <h2>, currentNode2 = <img>
Push children:
  tree1 <h2> has 0 children
  tree2 <img> has 0 children
stack1 = [<h1>]
stack2 = [<h1>]
Check: <h2> === <h2>? YES! ✓

Return: <img>
```

**Result:** The `<h2>` in tree1 corresponds to the `<img>` in tree2 (both are at the 4th position in traversal order).

---

## Visual Traversal Diagram

```
tree1:                               tree2:
   ①<div>                            ①<main>
    │                                 │
   ②<main>                           ②<article>
    │                                 │
  ┌─┴─┐                             ┌─┴─┐
 ③<h1> ③<div>                      ③<h1> ③<section>
         │                                  │
        ④<h2>                              ④<img>

Traversal Order (DFS):
Position 1: <div> ↔ <main> (roots)
Position 2: <main> ↔ <article>
Position 3: <div> ↔ <section>
Position 4: <h2> ↔ <img> ← Found!

When we find <h2> at position 4 in tree1,
we return the node at position 4 in tree2: <img>
```

---

## Time and Space Complexity

### **Time Complexity: O(n)**

Where n = number of nodes in the tree

**Analysis:**

- In worst case, we visit every node before finding target
- Each node is processed exactly once (pushed and popped once)
- Spread operator for children is O(c) where c = number of children
- Total: O(n × average_children) = O(n) since average_children is constant

**Best Case:** O(1) - target is the root  
**Average Case:** O(n/2) ≈ O(n)  
**Worst Case:** O(n) - target is last node visited

---

### **Space Complexity: O(h)**

Where h = height of the tree

**Analysis:**

- Stack size depends on tree height (how deep we go)
- At any point, stack contains at most one path from root to deepest unprocessed node
- In worst case (skewed tree), h = n → O(n)
- In balanced tree, h = log(n) → O(log n)

**Best Case:** O(1) - target is root  
**Average Case:** O(log n) - balanced tree  
**Worst Case:** O(n) - skewed tree

---

## Alternative Approaches

### **Approach 1: Recursive DFS**

```javascript
function correspondingNode(tree1, tree2, node1) {
  if (tree1 === node1) return tree2;

  for (let i = 0; i < tree1.children.length; i++) {
    const result = correspondingNode(
      tree1.children[i],
      tree2.children[i],
      node1
    );
    if (result) return result;
  }

  return null;
}
```

**Pros:** More concise, easier to understand  
**Cons:** Uses call stack, risk of stack overflow on deep trees

---

### **Approach 2: Breadth-First Search (BFS)**

```javascript
function correspondingNode(tree1, tree2, node1) {
  const queue1 = [tree1];
  const queue2 = [tree2];

  while (queue1.length > 0) {
    const current1 = queue1.shift(); // FIFO
    const current2 = queue2.shift();

    if (current1 === node1) return current2;

    queue1.push(...current1.children);
    queue2.push(...current2.children);
  }
}
```

**Pros:** Visits nodes level-by-level, finds shallow nodes faster  
**Cons:** `shift()` is O(n), making it slower overall

---

## Summary

The Corresponding Node solution demonstrates:

1. **Parallel Traversal:** Using two data structures to traverse two trees simultaneously
2. **Stack-Based Iteration:** Iterative DFS without recursion
3. **Structure Correspondence:** Leveraging identical structures to find matches
4. **Spread Operator:** Efficiently adding multiple children to stacks
5. **Identity Checking:** Using === to compare object references

This elegant solution finds corresponding nodes efficiently by maintaining synchronized traversal of both trees, guaranteeing that when the target is found in one tree, the current position in the other tree is the corresponding match.
