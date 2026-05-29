// Utility function to generate a random short code
export function generateShortCode() {
    return Math.random().toString(36).substring(2, 8);
}