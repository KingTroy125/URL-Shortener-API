# MVP_Design_Decisions (Milestone 1)

<aside>
<img src="https://app.notion.com/icons/checklist_gray.svg" alt="https://app.notion.com/icons/checklist_gray.svg" width="40px" />

**Decision:** Milestone 1 will prioritize a functional backend URL shortener that generates unique short URLs for every request, with no authentication or ownership tracking. Advanced guardrails and user systems will be introduced in future milestones.

</aside>

### Current MVP Approach

For Milestone 1, the URL shortener API focuses on building a simple and functional backend system before introducing advanced user management and security features.

**Current implementation**

- Generates a completely unique `shortCode` for every request
- Does not require user authentication
- Does not track ownership of URLs
- Allows public access to shortened URLs
- Uses expiration dates to automatically invalidate links after 10 days

This approach was selected to reduce complexity and ensure the project remains achievable within the internship timeline.

### Why This MVP Approach Was Chosen

Mentorship discussion identified that introducing the following would significantly increase project complexity:

- Login systems
- User accounts
- Authentication
- Ownership tracking
- Request limitations

To keep the scope manageable, the project was split into milestones.

**Milestone 1 focuses on**

- Core URL shortening functionality

**Future milestones may introduce**

- Authentication
- User ownership
- Rate limiting
- Analytics
- Admin controls
- Duplicate prevention

### Current MVP Pros and Cons

| Pros | Cons |
| --- | --- |
| Faster development | No user ownership |
| Easier backend setup | Anyone can access links |
| Simpler database design | No login or authentication |
| Easier to test and debug | No request limits |
| Good for learning backend fundamentals | Possible abuse or spam |
| Avoids authentication complexity | Duplicate original URLs stored |
| Allows focus on API architecture first | Database growth from repeated URLs |
|  | Cannot track which user created which URL |

### Current Limitations

#### No User Authentication

Currently:

- No user accounts exist

This means:

- No signup or login system
- No JWT authentication
- No user sessions
- No ownership tracking

Because of this:

- Any user can access any public short URL

#### No User ID Relationship

The database currently does **not** link URLs to users.

**Example current structure**

```
shortCode | originalUrl
ab12cd    | http://google.com/
```

**Future structure with authentication**

```
shortCode | originalUrl        | userId
ab12cd    | http://google.com/ | user123
```

This would allow:

- Ownership tracking
- User dashboards
- Personal URL management
- Analytics per user

#### No Request Limits

Currently:

- Users can generate unlimited URLs

Potential risks:

- Spam requests
- Abuse of the API
- Unnecessary database growth
- Duplicate links

Future improvements may include:

- Rate limiting
- IP-based restrictions
- User quotas
- API keys

### Future Milestone Improvements (Planned)

#### Authentication System

Would require:

- Signup endpoint
- Login endpoint
- Password hashing
- JWT tokens
- Protected routes

#### Ownership Tracking

Each URL linked to a specific user:

- User owns multiple short URLs

#### Rate Limiting

Prevent abuse by limiting:

- Requests per minute
- URLs per user
- Duplicate submissions

#### Duplicate URL Handling

Possible future logic:

- Same user shortens same URL
    - Return existing `shortCode`
    - Instead of creating duplicates

### Final MVP Decision

> Milestone 1 will prioritize a functional backend API that generates unique short URLs for every request without implementing authentication or advanced ownership features. More advanced guardrails and user systems will be introduced in future milestones.
>