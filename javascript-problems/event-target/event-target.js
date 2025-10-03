class EventTarget {
  constructor() {
    this.eventListenerMap = new Map();
  }

  addEventListener(name, callback) {
    if (!this.eventListenerMap.has(name)) {
      this.eventListenerMap.set(name, new Set());
    }
    this.eventListenerMap.get(name).add(callback);
  }

  removeEventListener(name, callback) {
    this.eventListenerMap.get(name)?.delete(callback);
  }

  dispatchEvent(name) {
    this.eventListenerMap.get(name)?.forEach((callback) => callback());
  }
}

const target = new EventTarget();
const logHello = () => console.log("hello");
const logWorld = () => console.log("world");

target.addEventListener("hello", logHello);
target.addEventListener("world", logWorld);

target.dispatchEvent("hello");
target.dispatchEvent("world");

target.removeEventListener("hello", logHello);

target.dispatchEvent("hello");
target.dispatchEvent("world");
