import generateShortCode from "../utils/generateShortCode.js";

describe("Hash Generator", () => {
  test("should generate a code", () => {
    const code = generateShortCode(
      "https://google.com"
    );

    expect(code).toBeDefined();
  });

  test("should generate a 6 character code", () => {
    const code = generateShortCode(
      "https://google.com"
    );

    expect(code.length).toBe(6);
  });
});
