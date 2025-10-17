function deepEquals(valueOne, valueTwo) {
  if (typeof valueOne !== typeof valueTwo) {
    return false;
  }
  if (typeof valueOne !== "object") {
    if (Number.isNaN(valueOne) && Number.isNaN(valueTwo)) {
      return true;
    }
    return valueOne === valueTwo;
  }
  if (valueOne === null || valueTwo === null) {
    return valueOne === valueTwo;
  }
  if (valueOne === valueTwo) {
    return true;
  }
  if (Array.isArray(valueOne) && Array.isArray(valueTwo)) {
    if (valueOne.length !== valueTwo.length) {
      return false;
    }
    for (let i = 0; i < valueOne.length; i++) {
      if (!deepEquals(valueOne[i], valueTwo[i])) {
        return false;
      }
    }
    return true;
  }
  if (Array.isArray(valueOne) || Array.isArray(valueTwo)) {
    return false;
  }
  const valueOneKeys = Object.keys(valueOne);
  const valueTwoKeys = Object.keys(valueTwo);
  if (valueOneKeys.length !== valueTwoKeys.length) {
    return false;
  }
  for (const key of valueOneKeys) {
    if (!valueTwoKeys.includes(key)) {
      return false;
    }
    if (!deepEquals(valueOne[key], valueTwo[key])) {
      return false;
    }
  }
  return true;
}

console.log(deepEquals(NaN, NaN));
console.log(deepEquals(1, "1"));
console.log(deepEquals(null, null));
console.log(deepEquals(null, undefined));
console.log(deepEquals([], []));
console.log(deepEquals({}, {}));

console.log(
  deepEquals({ a: 123, b: { c: [4, 5, 6] } }, { a: 123, b: { c: [4, 5, 6] } })
);
console.log(
  deepEquals({ a: 123, b: { c: [4, 5, 6] } }, { b: { c: [4, 5, 6] } })
);
console.log(
  deepEquals({ a: 123, b: { c: [4, 5, 6] } }, { a: 123, b: { c: [4, "5", 6] } })
);
console.log(deepEquals([1, 2, [3, 4]], [1, 2, [3, 4]]));
console.log(
  deepEquals([1, 2, [3, 4, { a: "abc" }]], [1, 2, [3, 4, { a: "abc" }]])
);
