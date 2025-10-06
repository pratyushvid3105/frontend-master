function throttle(callback, delay) {
  let timerID;
  let lastCalledTime = 0;
  function throttled(...args) {
    const currentTime = Date.now();
    const timeSinceLastCall = currentTime - lastCalledTime;
    const delayRemaining = delay - timeSinceLastCall;
    if (delayRemaining <= 0) {
      lastCalledTime = currentTime;
      callback.call(this, ...args);
    } else {
      clearTimeout(timerID);
      timerID = setTimeout(() => {
        lastCalledTime = Date.now();
        callback.call(this, ...args);
      }, delayRemaining);
    }
  }

  throttled.cancel = function () {
    clearTimeout(timerID);
  };
  return throttled;
}

let progress = 0;
function showProgress(value) {
  console.log(`Progress: ${value}%`);
}

const throttledProgress = throttle(showProgress, 1000);

const interval = setInterval(() => {
  progress += 10;
  throttledProgress(progress);
  if (progress >= 100) {
    clearInterval(interval);
    console.log("Complete!");
  }
}, 200);
