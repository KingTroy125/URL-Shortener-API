# 02_Frontend_Architecture

## Data flow

```mermaid
flowchart LR
UA([User action]) --> Frontend[Next.js Frontend]
Frontend --> API(API request)
API --> EB[Express Backend]
EB --> DB[(DataBase)]
DB --> UI(UI state update)

```

## Key decisions

- Client vs server components
- Where to place API calls
- Error boundaries and loading states

# Responsibilities

## Frontend

- Collect user input
- Validate URLs
- Display results

## Backend

- Generate short codes
- Save URLs
- Handle redirects

## Database

- Store URL records
- Store expiry dates
