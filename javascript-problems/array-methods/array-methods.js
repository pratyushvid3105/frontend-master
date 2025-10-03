Array.prototype.myMap = function (callback) {
  const newArr = [];
  for (let i = 0; i < this.length; i++) {
    newArr.push(callback(this[i], i, this));
  }
  return newArr;
};

Array.prototype.myFilter = function (callback) {
  const newArr = [];
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this) === true) {
      newArr.push(this[i]);
    }
  }
  return newArr;
};

Array.prototype.myReduce = function (callback, initialValue) {
  if (this.length === 0) {
    return initialValue;
  }
  let accumulator = initialValue;
  let startingIndex = 0;
  if (accumulator == null) {
    accumulator = this[0];
    startingIndex = 1;
  }
  for (let i = startingIndex; i < this.length; i++) {
    accumulator = callback(accumulator, this[i], i, this);
  }
  return accumulator;
};

console.log([1, 2, 3].myMap((item) => item * 2));
console.log([1, 2, 3].myFilter((item) => item > 2));
console.log([1, 2, 3].myReduce((acc, item) => acc + item, 0));
