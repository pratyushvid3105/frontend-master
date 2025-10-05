Function.prototype.myCall = function (thisContext, ...args) {
  const symbol = Symbol();
  Object.defineProperty(thisContext, symbol, {
    value: this,
    enumerable: false,
    configurable: true,
  });
  const result = thisContext[symbol](...args);
  delete thisContext[symbol];
  return result;
};

Function.prototype.myApply = function (thisContext, args = []) {
  return this.myCall(thisContext, ...args);
};

Function.prototype.myBind = function (thisContext, ...args) {
  return (...newArgs) => this.myApply(thisContext, [...args, ...newArgs]);
  // return (...newArgs) => this.myCall(thisContext, ...args, ...newArgs);
};

const obj = { num: 0 };

function logNums(x, y) {
  console.log(this.num, x, y);
}

logNums.myCall(obj, 1, 2);
logNums.myApply(obj, [1, 2]);

const boundFunction = logNums.myBind(obj, 1);
boundFunction(2);
