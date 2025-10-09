function curry(callback) {
  function curriedFunc(...args) {
    if (args.length > 0) {
      return function (...otherArgs) {
        if (otherArgs.length === 0) {
          return callback(...args);
        }
        return curriedFunc(...args, ...otherArgs);
      };
    }
    return callback();
  }
  return curriedFunc;
}

const sum = (...numbers) => numbers.reduce((acc, curr) => acc + curr, 0);
const curriedSum = curry(sum);

console.log(curriedSum());
console.log(curriedSum(1)());
console.log(curriedSum(1)(2)());
console.log(curriedSum(1, 2)(3)(4, 5, 6)());
console.log(curriedSum(1));
console.log(curriedSum(1)(2)(3));
