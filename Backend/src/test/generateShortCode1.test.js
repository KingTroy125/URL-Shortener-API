import generateShortCode from "../utils/generateShortCode1.js";

describe("Short Code Generator", () => {
  test("should generate a code", () => {
    const code = generateShortCode();

    expect(code).toBeDefined();
  });

  test("should generate a string", () => {
    const code = generateShortCode();

    expect(typeof code).toBe("string");
  });

  test("should generate a 6 character code", () => {
    const code = generateShortCode();

    expect(code.length).toBe(6);
  });

  test("should only contain base36 characters", () => {
    const code = generateShortCode();

    expect(code).toMatch(/^[a-z0-9]{6}$/);
  });
});
