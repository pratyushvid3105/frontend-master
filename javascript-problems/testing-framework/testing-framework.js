function describe(testSuiteName, func) {
  console.log(`beginning test suite ${testSuiteName}`);
  try {
    func();
    console.log(`successfully completed test suite ${testSuiteName}`);
  } catch (error) {
    console.error(
      `failed running test suite ${testSuiteName} on test case ${error.testCaseName} with error message ${error.errorMessage}`
    );
  }
}

function it(testCaseName, func) {
  console.log(`beginning test case ${testCaseName}`);
  try {
    func();
    console.log(`successfully completed test case ${testCaseName}`);
  } catch (errorMessage) {
    throw { testCaseName, errorMessage };
  }
}

function expect(actual) {
  const toExist = () => {
    if (actual == null) {
      throw `expected value to exist but got ${JSON.stringify(actual)}`;
    }
  };

  const toBe = (expected) => {
    if (actual !== expected) {
      throw `expected ${JSON.stringify(actual)} to be ${JSON.stringify(
        expected
      )}`;
    }
  };

  const toBeType = (type) => {
    const typeOfActual = typeof actual;
    if (typeOfActual !== type) {
      throw `expected ${JSON.stringify(
        actual
      )} to be of type ${type} but got ${typeOfActual}`;
    }
  };

  return { toExist, toBe, toBeType };
}

/* Sample Usage #1 */
describe("Passing Test Suite", () => {
  it("Passing Test Case #1", () => {
    expect("foo").toExist();
    expect(1 + 1).toBe(2);
  });

  it("Passing Test Case #2", () => {
    expect({}).toBeType("object");
  });
});

/* Sample Usage #2 */
describe("Failing Test Suite", () => {
  it("Passing Test Case", () => {
    expect(0).toBe(0);
  });

  it("Failing Test Case", () => {
    expect(true).toBe(true);
    expect(true).toBe(false);
  });

  it("Unreachable Test Case", () => {
    expect("foo").toBe("bar");
  });
});
