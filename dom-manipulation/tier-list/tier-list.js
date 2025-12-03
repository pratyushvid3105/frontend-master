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
  draggedItem = event.target;
}

function onDoubleClickItem() {
  const unrankedDropZone = document.getElementById("unranked-drop-zone");
  if (unrankedDropZone !== this.parentNode) {
    unrankedDropZone.appendChild(this);
  }
}
function onDropOverDropZone() {
  if (this !== draggedItem.parentNode) {
    this.appendChild(draggedItem);
  }
}

function onDragOverDropZone(event) {
  event.preventDefault();
}
