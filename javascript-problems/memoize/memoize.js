function memoize(callback, resolver) {
  let cache = new Map();

  const getCacheKey = (...args) => {
    return resolver != null ? resolver(...args) : JSON.stringify(args);
  };

  function memoisedFunction(...args) {
    const cacheKey = getCacheKey(...args);
    if (cacheKey) {
      return cache.get(cacheKey);
    }
    const result = callback(...args);
    return result;
  }

  memoisedFunction.clear = () => {
    cache.clear();
  };

  memoisedFunction.delete = (...otherArgs) => {
    const cacheKey = getCacheKey(...otherArgs);
    if (cache.get(cacheKey)) {
      cache.delete(cacheKey);
    }
  };

  memoisedFunction.has = (...otherArgs) => {
    const cacheKey = getCacheKey(...otherArgs);
    if (cache.get(cacheKey)) {
      return true;
    }
  };

  return memoisedFunction;
}
