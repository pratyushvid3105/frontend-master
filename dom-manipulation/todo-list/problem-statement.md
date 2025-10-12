# Todo List 🟡⭐

**Category:** DOM Manipulation

You're given HTML and CSS files for a simple todo list, and you need to make the todo list functional using JavaScript.

## Overview

The todo list has an input field and an add button, which are meant to be used to create named todo items. It also has an empty unordered list (`#todo-list`), to which todo items will be appended.

## Requirements

The todo list should have the following functionality:

1. **Input Validation:** When nothing is typed into the input, the add button should be disabled. Otherwise, it should be enabled.

2. **Add Todo Item:** When the add button is enabled and clicked on, a new todo item should be created and appended to the `#todo-list`, and the input should be cleared.

3. **Todo Item Structure:** Each todo item should be an HTML list item with two children: a level-two heading and a button element. The heading should have the text content of whatever was typed into the input at the time of creation, and the button should have `X` as its text content and `delete-button` as its class (this class is defined in the provided CSS file).

4. **Delete Todo Item:** When the `X` button of a todo item is clicked on, the todo item should be removed from the list.

## HTML Structure

```html
<div id="wrapper">
  <h1>Todo List</h1>
  <input id="todo-input" type="text" placeholder="Add a todo..." />
  <button id="add-button" disabled>Add</button>
  <ul id="todo-list"></ul>
</div>
```

## CSS Styling

```css
div {
  width: 70vw;
  background-color: grey;
  color: white;
  padding: 12px;
  border-radius: 12px;
  margin: auto;
  text-align: center;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 24px auto;
}

li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  border: 2px solid black;
  background-color: #00557f;
  border-radius: 5px;
  margin: 5px;
}

h1 {
  font-size: 36px;
}

h2 {
  margin-right: 24px;
}

input {
  font-size: 24px;
  padding: 8px 8px;
  outline: none;
  width: 50%;
}

#add-button {
  font-size: 24px;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: lightblue;
  transition: 0.5s;
  cursor: pointer;
}

#add-button:disabled {
  background-color: revert;
  cursor: default;
}

#wrapper {
  width: 70vw;
  margin: auto;
  text-align: center;
  background: grey;
  color: white;
}

.delete-button {
  background: none;
  color: white;
  border: 1px solid transparent;
  border-radius: 100%;
  height: 24px;
  width: 24px;
  font-size: 14px;
  font-weight: bold;
  padding: 0;
  transition: 0.5s;
  cursor: pointer;
}

.delete-button:hover {
  border-color: white;
  transform: scale(1.2);
}
```

## Sample Usage

1. Page loads → Input field shows, Add button is disabled
2. User types "Learn JavaScript" → Add button becomes enabled
3. User clicks Add → New list item with heading "Learn JavaScript" and delete button appears
4. Input field clears → Add button becomes disabled again
5. User types "Build a project" and clicks Add → Second todo item appears
6. User clicks the `X` button on first item → "Learn JavaScript" item is removed

## Example Todo Item HTML

```html
<li>
  <h2>Practice for frontend interviews</h2>
  <button class="delete-button">X</button>
</li>
```
