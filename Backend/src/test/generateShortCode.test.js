import generateShortCode from "../utils/generateShortCode.js";

describe('generateShortCode - Random Method', () => {
    test('should generate a 6-character code', () => {
        const code = generateShortCode();
        expect(code).toHaveLength(6);
    });

    test('should generate alphanumeric codes', () => {
        const code = generateShortCode();
        expect(code).toMatch(/^[0-9a-zA-Z]{6}$/);
    });

    test('should generate different codes on multiple calls', () => {
        const codes = new Set();
        for (let i = 0; i < 100; i++) {
            codes.add(generateShortCode());
        }
        expect(codes.size).toBeGreaterThan(95);
    });
});

describe('generateShortCode - Hash Method', () => {
    test('should generate a 6-character code', () => {
        const code = generateShortCode('https://example.com');
        expect(code).toHaveLength(6);
    });

    test('should generate base62 codes', () => {
        const code = generateShortCode('https://example.com');
        expect(code).toMatch(/^[0-9a-zA-Z]{6}$/);
    });

    test('should generate consistent code for same URL and attempt', () => {
        const url = 'https://example.com';
        const code1 = generateShortCode(url, 0);
        const code2 = generateShortCode(url, 0);
        expect(code1).toBe(code2);
    });

    test('should generate different codes for different attempts', () => {
        const url = 'https://example.com';
        const code1 = generateShortCode(url, 0);
        const code2 = generateShortCode(url, 1);
        expect(code1).not.toBe(code2);
    });

    test('should generate different codes for different URLs', () => {
        const code1 = generateShortCode('https://example.com', 0);
        const code2 = generateShortCode('https://google.com', 0);
        expect(code1).not.toBe(code2);
    });
});