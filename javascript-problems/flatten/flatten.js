function flattenArray(value) {
  let flatArray = [];
  value.forEach((el) => {
    if (el !== Object(el)) {
      flatArray.push(el);
    } else if (Array.isArray(el)) {
      flatArray.push(...flattenArray(el));
    } else {
      flatArray.push(flattenPlainObject(el));
    }
  });
  return flatArray;
}

function flattenPlainObject(value) {
  let flatObject = {};
  for (const [objKey, objectValue] of Object.entries(value)) {
    if (objectValue !== Object(objectValue)) {
      flatObject[objKey] = objectValue;
    } else if (Array.isArray(objectValue)) {
      flatObject[objKey] = flattenArray(objectValue);
    } else {
      const flatChildObject = flattenPlainObject(objectValue);
      for (const [ck, cv] of Object.entries(flatChildObject)) {
        flatObject[ck] = cv;
      }
    }
  }
  return flatObject;
}

function flatten(value) {
  if (value !== Object(value)) {
    return value;
  } else if (Array.isArray(value)) {
    return flattenArray(value);
  } else {
    return flattenPlainObject(value);
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
