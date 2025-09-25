function isPrimitive(value) {
  return value !== Object(value);
}

function isArray(value) {
  let flatArray = [];
  value.forEach((el) => {
    if (Array.isArray(el)) {
      flatArray.push(...flatten(el));
    } else if (isPrimitive(el)) {
      flatArray.push(el);
    } else if (Object.prototype.toString.call(el) === "[object Object]") {
      flatArray.push(isPlainObject(el));
    }
  });
  return flatArray;
}

function isPlainObject(value) {
  let flatObject = {};
  Object.keys(value).forEach((key) => {
    if (isPrimitive(value[key])) {
      flatObject[key] = value[key];
    } else if (Array.isArray(value[key])) {
      flatObject[key] = isArray(value[key]);
    } else if (
      Object.prototype.toString.call(value[key]) === "[object Object]"
    ) {
      flatObject = { ...flatObject, ...isPlainObject(value[key]) };
    }
  });
  return flatObject;
}

function flatten(value) {
  const type = typeof value;
  if (isPrimitive(value)) {
    return value;
  } else if (type === "object") {
    if (Array.isArray(value)) {
      return isArray(value);
    } else if (Object.prototype.toString.call(value) === "[object Object]") {
      return isPlainObject(value);
    }
  }
}

console.log(flatten(1));
console.log(flatten("hello"));
console.log(flatten(true));
console.log(flatten(undefined));
console.log(flatten(Symbol("test")));
console.log(flatten({ a: 1 }));
console.log(flatten([1, 2, 3]));
console.log(flatten([1, [2, 3], 4]));
console.log(flatten([1, [2, [3, 4]], 5]));
console.log(flatten([1, [2, [3, [4, 5]]]]));
console.log(flatten(1));
console.log(flatten([]));
console.log(flatten({}));
console.log(flatten([1, 2, [3, 4, [], 5]]));
console.log(
  flatten([
    1,
    2,
    [3],
    {
      a: 4,
      b: {
        c: 5,
        d: [6, 7, 8, [9, [10]]],
      },
    },
  ])
);
console.log(
  flatten({
    a: null,
    b: undefined,
    c: {
      d: true,
      e: 4,
      f: {},
      g: {
        h: 5,
      },
    },
  })
);
