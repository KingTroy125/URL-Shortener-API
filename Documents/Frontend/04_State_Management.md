# 04_State_Management

## State model

- url
- isLoading
- error
- shortenedUrl
- copied

## State model Table

| States | Code | Purpose |
| --- | --- | --- |
| URL State | const [url, setUrl] = useState("") | Store user-entered URL. |
| Loading State | const [loading, setLoading] = useState(false) | Track API requests |
| Error State | const [error, setError] = useState("") | Display validation and API errors |

## Where state lives

- Local component state (useState)
- Optional: server actions / React Query (future)

## Edge cases

- Multiple submissions
- Clearing state on new input
- Copy reset timer