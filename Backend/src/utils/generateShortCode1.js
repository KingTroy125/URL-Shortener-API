// Utility function to generate a random short code
export default function generateShortCode() {
    return Math.random().toString(36).substring(2, 8);
}
