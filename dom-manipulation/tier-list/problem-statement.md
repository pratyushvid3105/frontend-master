# Tier List 🟢⭐

**Category:** DOM Manipulation

You're given HTML and CSS files for a simple tier list, and you need to make the tier list functional using JavaScript.

## Problem Description

A tier list is a system that allows you to rank items from best to worst. The provided tier list has three tiers (A, B, and C) and three items (colored squares), which start out in an unranked section.

## Functionality Requirements

The tier list should have the following functionality:

### 1. Draggable Items

Each element with the `item` class (each colored square) should be **draggable**.

### 2. Drag and Drop to Drop Zones

If a colored square is drag-and-dropped in an element with the `drop-zone` class (one of the grey drop zones), the square should be **appended to that element**. If the square was already in that drop zone or if the square is dropped anywhere else on the page, nothing should happen (the square should remain where it was).

### 3. Double-Click to Return to Unranked

If a colored square is **double-clicked**, it should be appended to the element with the `unranked-drop-zone` id (the grey drop zone in the unranked section). If the item was already in the unranked drop zone, nothing should happen (the square should remain where it was).

## Technical Requirements

Your solution should use the standard browser drag-and-drop API.

Your JavaScript code has already been linked to the pre-written HTML code via a deferred script tag.

## Pre-written HTML

```html
<div id="wrapper">
  <section class="tier-section">
    <h1>A Tier</h1>
    <div class="drop-zone"></div>
  </section>
  <section class="tier-section">
    <h1>B Tier</h1>
    <div class="drop-zone"></div>
  </section>
  <section class="tier-section">
    <h1>C Tier</h1>
    <div class="drop-zone"></div>
  </section>

  <section class="tier-section" id="unranked-section">
    <h1>Unranked</h1>
    <div class="drop-zone" id="unranked-drop-zone">
      <div draggable="true" id="blue" class="item"></div>
      <div draggable="true" id="red" class="item"></div>
      <div draggable="true" id="green" class="item"></div>
    </div>
  </section>
</div>
```

## CSS Styling

```css
h1 {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-basis: 150px;
  padding: 12px;
  border-right: 5px solid black;
  margin: 0;
  font-size: 24px;
  user-select: none;
  background-color: #082969;
  color: white;
}

.tier-section {
  display: flex;
  border: 5px solid black;
  min-height: 50px;
}

.tier-section:not(:first-of-type, :last-of-type) {
  border-top: none;
}

.drop-zone {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  flex-basis: 100%;
  background-color: lightgrey;
}

.item {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 2px solid black;
  border-radius: 8px;
  margin: 0 8px;
  opacity: 0.999; /* prevents Chrome bug of white edges while dragging */
}

#unranked-section {
  margin-top: 18px;
}

#blue {
  background-color: blue;
}

#red {
  background-color: red;
}

#green {
  background-color: green;
}
```

## Solution Template

```javascript
let draggedItem;

const items = document.querySelectorAll(".item");
const dropZones = document.querySelectorAll(".drop-zone");

items.forEach((item) => {
  item.addEventListener("dragstart", onDragItem);
  item.addEventListener("dblclick", onDoubleClickItem);
});

dropZones.forEach((dropZone) => {
  dropZone.addEventListener("drop", onDropOverDropZone);
  dropZone.addEventListener("dragover", onDragOverDropZone);
});

function onDragItem(event) {
  // Your code here
}

function onDoubleClickItem(event) {
  // Your code here
}

function onDropOverDropZone() {
  // Your code here
}

function onDragOverDropZone(event) {
  // Your code here
}
```
