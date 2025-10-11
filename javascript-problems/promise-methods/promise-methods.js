Promise.myRace = function (promises) {
  return new Promise((res, rej) => {
    promises.forEach((promise) => {
      promise.then(res).catch(rej);
    });
  });
};

Promise.myAny = function (promises) {
  return new Promise((res, rej) => {
    promises.forEach((promise, index) => {
      promise.then(res).catch((err) => {
        if (index === promises.length - 1) {
          rej("all promises rejected");
        }
      });
    });
  });
};

Promise.myAll = function (promises) {
  return new Promise((res, rej) => {
    let resolvedValues = new Array(promises.length);
    let resolvedCount = 0;
    promises.forEach((promise, index) => {
      promise.then((val) => {
        resolvedValues[index] = val;
        resolvedCount += 1;
        if (resolvedCount === promises.length) {
          res(resolvedValues);
        }
      }, rej);
    });
  });
};

Promise.myAllSettled = function (promises) {
  return new Promise((res, _) => {
    const resolvedValues = [];
    let resolvedCount = 0;
    promises.forEach((promise, index) => {
      promise
        .then((val) => {
          resolvedValues[index] = { status: "fulfilled", value: val };
        })
        .catch((err) => {
          resolvedValues[index] = { status: "rejected", error: err };
        })
        .finally(() => {
          resolvedCount += 1;
          if (resolvedCount === promises.length) {
            res(resolvedValues);
          }
        });
    });
  });
};

// Promise.myRace([
//   new Promise((res) => setTimeout(() => res(0), 500)),
//   Promise.resolve(5),
//   new Promise((res) => setTimeout(() => res(10), 1000)),
// ])
//   .then(console.log)
//   .catch((error) => console.log("error:", error));

// Promise.myRace([
//   new Promise((res) => setTimeout(() => res(0), 500)),
//   Promise.reject(5),
//   new Promise((res) => setTimeout(() => res(10), 1000)),
// ])
//   .then(console.log)
//   .catch((error) => console.log("error:", error));

// Promise.myAny([
//   new Promise((res) => setTimeout(() => res(0), 500)),
//   Promise.resolve(5),
//   new Promise((res) => setTimeout(() => res(10), 1000)),
// ]).then(console.log);

// Promise.myAny([
//   new Promise((res) => setTimeout(() => res(0), 500)),
//   Promise.reject(5),
//   new Promise((res) => setTimeout(() => res(10), 1000)),
// ])
//   .then(console.log)
//   .catch((error) => console.log("error:", error));

// Promise.myAll([
//   new Promise((res) => setTimeout(() => res(0), 500)),
//   Promise.resolve(5),
//   new Promise((res) => setTimeout(() => res(10), 1000)),
// ]).then(console.log);

// Promise.myAll([
//   new Promise((res) => setTimeout(() => res(0), 500)),
//   Promise.reject(5),
//   new Promise((res) => setTimeout(() => res(10), 1000)),
// ])
//   .then(console.log)
//   .catch((error) => console.log("error: " + error));

// Promise.myAllSettled([
//   new Promise((res) => setTimeout(() => res(0), 500)),
//   Promise.resolve(5),
//   new Promise((res) => setTimeout(() => res(10), 1000)),
// ]).then(console.log);

Promise.myAllSettled([
  new Promise((res) => setTimeout(() => res(0), 500)),
  Promise.reject(5),
  new Promise((res) => setTimeout(() => res(10), 1000)),
])
  .then(console.log)
  .catch((error) => console.log("error: " + error));
