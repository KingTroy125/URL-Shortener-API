# 11_Error Handling

## Error categories

- Invalid URLs (validation failures)
- Expired URLs
- Missing short codes (not found)
- Server errors (unexpected exceptions, DB failures)

## Suggested error response format (JSON)

### 400 Bad Request (invalid URL)

```json
{
  "error": "Invalid URL",
  "details": "originalUrl must be a valid http(s) URL"
}
```

### 404 Not Found (unknown shortCode)

```json
{
  "error": "Not Found",
  "details": "shortCode does not exist"
}
```

### 410 Gone (expired)

```json
{
  "error": "Expired",
  "details": "This short URL has expired"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal Server Error"
}
```

## Implementation notes

- Centralize errors in a global Express error-handling middleware.
- Avoid leaking internal exception details in production.
- Log correlation IDs to trace failing requests.