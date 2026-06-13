# 04_Database_Design

## MongoDB document model

A single collection can represent shortened URLs (e.g., `ShortUrl`).

# MongoDB Schema

| Field | Type | Description |
| --- | --- | --- |
| id | String | Unique ID |
| originalUrl | String | Original URL |
| shortCode | String | Unique shortcode |
| createdAt | DateTime | Creation |
| expiresAt | DateTime | Expiration dat |

### Fields

- `id`
    - Primary identifier (MongoDB `_id` / ObjectId or a mapped string).
- `originalUrl`
    - The long URL provided by the client.
- `shortCode`
    - Unique code used in the redirect path.
- `createdAt`
    - When the mapping was created.
- `expiresAt`
    - When the mapping becomes invalid (10 days after creation).

## Users Collection

This collection store registered users for authentication and ownership tracking

| Field | Type | Description |
| --- | --- | --- |
| userID | String | Unique User ID |
| username | String | User Name |
| password | String | User Password |

### Fields

- `userID`
    - Primary identifier (MongoDB `_userID` a mapped string).
- `username`
    - The username provided by the client.
- `password`
    - Unique password provided by the client.

## Key design points

### Unique `shortCode`

- Enforce uniqueness at the database level via a unique index.
- Also handle uniqueness in application logic via a collision retry loop.

### Expiration handling

- Store `expiresAt` and validate it during redirects.
- Optional: use a TTL index for automatic cleanup (still validate at runtime).

### Relationships

- This project can stay **relationship-free** initially.
- Future: add a `userId` if authentication is introduced.

### Primary key concepts

- MongoDB’s native `_id` is a reliable primary key.
- `shortCode` should be treated as a **public identifier** and must be unique.

## Prisma schema example (MongoDB)

```
model url {
	id String @id @default(auto()) @map("_id")
	originalUrl String
	shortCOde String @unique
	createdAt DataTime @default(now())
	expiresAt DateTime
}
```

### Diagram placeholder

> **[Diagram]** Data model (ShortUrl document)
>