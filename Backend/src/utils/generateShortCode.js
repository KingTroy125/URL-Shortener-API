import crypto from "crypto";

// Base62 characters for the short code
const BASE62_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

// converts a buffer to a base62 string
function toBase62(buffer) {
    let value = BigInt("0x" + buffer.toString("hex")); // converts the buffer to a bigInt
    let result = ""; // initialize the result string
    while (value > 0n) { // while the value is greater than 0
        result = BASE62_CHARS[Number(value % 62n)] + result; // add the last digit to the result
        value = value / 62n; // divide the value by 62
    }
    return result;
}

// Utility function to generate a Base62 hash-based short code
export default function generateShortCode(url = "", attempt = 0) {
    const seed = url || Math.random().toString(36); // if no url is provided, use a random string
    const input = `${seed}-${attempt}`; // create the input string with the seed and attempt number

    const hashBuffer = crypto
        .createHash("sha256") // create a hash object
        .update(input)
        .digest(); // generate the hash buffer

    const base62 = toBase62(hashBuffer); // convert the hash buffer to a base62 string

    return base62.substring(0, 6); // return the first 6 characters of the base62 string
}
