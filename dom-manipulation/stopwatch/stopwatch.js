const timer = document.getElementById("timer");
const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");
const resetButton = document.getElementById("reset-button");

startButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", stopTimer);
resetButton.addEventListener("click", resetTimer);

let timerID;
let lastStartTime = 0;
let millisecondsPassedBeforeLastStart = 0;

/*  setInterval solution
// const INTERVAL_MS = 1000 / 60;
*/

function startTimer(timestamp) {
  console.log(timestamp);
  startButton.disabled = true;
  stopButton.disabled = false;
  resetButton.disabled = true;
  lastStartTime = Date.now();
  timerID = requestAnimationFrame(updateTimer);

  /*  setInterval solution 
  timerID = setInterval(updateTimer, INTERVAL_MS);
  */
}

function stopTimer() {
  startButton.disabled = false;
  stopButton.disabled = true;
  resetButton.disabled = false;
  millisecondsPassedBeforeLastStart += Date.now() - lastStartTime;
  lastStartTime = 0;
  cancelAnimationFrame(timerID);

  /*  setInterval solution 
  clearInterval(timerID);
  */
}

function resetTimer() {
  resetButton.disabled = true;
  millisecondsPassedBeforeLastStart = 0;
  timer.textContent = "00:00:000";
}

function updateTimer() {
  const millisecondsPassed =
    Date.now() - lastStartTime + millisecondsPassedBeforeLastStart;
  const secondsPassed = millisecondsPassed / 1000;
  const minutesPassed = secondsPassed / 60;

  const millisecondsText = formatNumber(
    Math.floor(millisecondsPassed % 1000),
    3
  );
  const secondsText = formatNumber(Math.floor(secondsPassed % 60), 2);
  const minutesText = formatNumber(Math.floor(minutesPassed), 2);

  timer.textContent = `${minutesText}:${secondsText}:${millisecondsText}`;
  timerID = requestAnimationFrame(updateTimer); // Comment this out for setInterval solution
}

function formatNumber(number, desiredLength) {
  const stringNumber = String(number);

  if (stringNumber.length > desiredLength) {
    return stringNumber.slice(0, desiredLength);
  }
  return stringNumber.padStart(desiredLength, "0");
}
