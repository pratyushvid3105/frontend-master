function memoize(callback, resolver) {
  const cache = new Map();

  const getCacheKey = (...args) =>
    resolver != null ? resolver(...args) : JSON.stringify(args);

  function memoisedFunction(...args) {
    const cacheKey = getCacheKey(...args);
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    memoisedFunction.callCount += 1;
    const result = callback(...args);
    cache.set(cacheKey, result);
    return result;
  }

  memoisedFunction.callCount = 0;

  memoisedFunction.clear = () => {
    cache.clear();
  };

  memoisedFunction.delete = (...otherArgs) => {
    const cacheKey = getCacheKey(...otherArgs);
    return cache.delete(cacheKey);
  };

  memoisedFunction.has = (...otherArgs) => {
    const cacheKey = getCacheKey(...otherArgs);
    return cache.has(cacheKey);
  };

  return memoisedFunction;
}

const callback = (...args) => args;
const memoized = memoize(callback);

console.log(memoized(123)); // calls callback, returns 123
console.log(memoized(123)); // returns 123
console.log(memoized(123, "abc")); // calls callback, returns [123, 'abc']

const memoized2 = memoize(callback, (args) => args[0]);
console.log(memoized2(123)); // calls callback, returns 123
console.log(memoized2(123)); // returns 123
console.log(memoized2(123, "abc")); // returns 123
console.log(memoized2("abc", 123)); // calls callback, returns ['abc', 123]
console.log(memoized2("abc")); // returns ['abc', 123]
