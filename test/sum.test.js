const sum = require("../dist/index");

test("Test 1 + 1", () => {
  expect(sum(1, 1)).toBe(2);
});
