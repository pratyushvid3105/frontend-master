function debounce(callback, delay, immediate = false) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    if (immediate && timeoutId == null) {
      callback.apply(this, args);
    }
    timeoutId = setTimeout(() => {
      if (!immediate) {
        callback.apply(this, args);
      }
      timeoutId = null;
    }, delay);
  };
}

const log = (msg) => console.log("Called:", msg, "at", Date.now());
const debounced = debounce(log, 3000);

// Example 1: Normal debounce
debounced("typing..."); // waits 3s after last call to execute

// Example 2: Immediate debounce
const debouncedImmediate = debounce(log, 3000, true);
debouncedImmediate("first call fires immediately");
