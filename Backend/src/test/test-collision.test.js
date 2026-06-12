import generateShortCode from "../utils/generateShortCode.js";

describe("Collision Test", () => {
  test("should have very few collisions", () => {
    const codes = new Set();

    let collisions = 0;

    const TOTAL = 100000;

    for (let i = 0; i < TOTAL; i++) {
      const code = generateShortCode();

      if (codes.has(code)) {
        collisions++;
      }

      codes.add(code);
    }

    console.log(
      `Generated: ${TOTAL}`
    );

    console.log(
      `Collisions: ${collisions}`
    );

    expect(collisions).toBeLessThan(50);
  });
});
