const STATE = {
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected",
};

class MyPromise {
  #value = null;
  #state = STATE.PENDING;
  #fulfilledCallbacks = [];
  #rejectedCallbacks = [];

  #resolve(value) {
    this.#value = value;
    this.#state = STATE.FULFILLED;
    this.#fulfilledCallbacks.forEach((callback) => callback());
  }

  #reject(value) {
    this.#value = value;
    this.#state = STATE.REJECTED;
    this.#rejectedCallbacks.forEach((callback) => callback());
  }

  constructor(executorFunc) {
    try {
      executorFunc(
        (val) => this.#resolve(val),
        (val) => this.#reject(val)
      );
    } catch (error) {
      this.#reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handleOnFullfill = () => {
        if (!onFulfilled) {
          return resolve(this.#value);
        }

        queueMicrotask(() => {
          try {
            resolve(onFulfilled(this.#value));
          } catch (error) {
            reject(error);
          }
        });
      };

      const handleOnRejected = () => {
        if (!onRejected) {
          return reject(this.#value);
        }

        queueMicrotask(() => {
          try {
            resolve(onRejected(this.#value));
          } catch (error) {
            reject(error);
          }
        });
      };

      switch (this.#state) {
        case "pending":
          this.#fulfilledCallbacks.push(handleOnFullfill);
          this.#rejectedCallbacks.push(handleOnRejected);
          break;
        case "fulfilled":
          handleOnFullfill();
          break;
        case "rejected":
          handleOnRejected();
          break;
        default:
          throw new Error("Enexpected Promise State");
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  get state() {
    return this.#state;
  }

  get value() {
    return this.#value;
  }
}

/* Sample Usage 1*/
// const promise = new MyPromise((res, rej) => {
//   res(10);
// });

// promise
//   .then((val) => {
//     console.log(val);
//     return val + 10;
//   })
//   .then((val) => {
//     console.log(val);
//     throw val + 10;
//   })
//   .then(
//     (val) => {
//       console.log(val);
//       return val + 10;
//     },
//     (val) => {
//       console.log("error: " + val);
//       return val + 20;
//     }
//   )
//   .then((val) => {
//     console.log(val);
//     throw val + 10;
//   })
//   .catch((val) => {
//     console.log("error: " + val);
//     return val + 10;
//   })
//   .then((val) => {
//     console.log(val);
//   });

// console.log("end");

/* Sample Usage 2*/
// const promise2 = new MyPromise((res, rej) => {
//   res(10);
// });

// promise2.then((val) => {
//   console.log(val + 10);
//   return val + 10;
// });

// promise2.then((val) => {
//   console.log(val + 5);
//   return val + 5;
// });

// console.log("end");
