# 10_Environment_Variables

## .env configuration

```bash
DATABASE_URL="mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority"
PORT=3000
BASE_URL="https://localhost:{PORT}"
```

## Why environment variables matter

- Keep secrets out of source control.
- Support different settings per environment (local, staging, production).
- Enable safer deployments (Vercel environment configuration).

## Notes

- Never commit real credentials.
- Consider separate DBs/collections for non-production environments.