const todoInput = document.getElementById("todo-input");
const addButton = document.getElementById("add-button");
const todoList = document.getElementById("todo-list");

todoInput.addEventListener("keyup", onInputChange);
addButton.addEventListener("click", onAddButtonClick);

function onInputChange(event) {
  if (event.target.value.length > 0) {
    addButton.disabled = false;
  } else {
    addButton.disabled = true;
    todoItemtext = null;
  }
}

function onAddButtonClick() {
  createNewItem(todoInput.value);
  todoList.appendChild(newItem);
  todoInput.value = "";
  addButton.disabled = true;
}

function createNewItem(name) {
  const newItem = document.createElement("li");
  const newItemHeading = document.createElement("h2");
  newItemHeading.textContent = name;
  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("class", "delete-button");
  deleteButton.textContent = "X";
  deleteButton.addEventListener("click", onDeleteButtonClick);
  newItem.appendChild(newItemHeading);
  newItem.appendChild(deleteButton);
}

function onDeleteButtonClick(event) {
  todoList.removeChild(event.target.parentElement);
  //   this.parentNode.remove();
}
