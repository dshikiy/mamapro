# MamaPro Production Environment Variables

## Backend (Render / Railway / VPS)
Set these variables in your hosting provider's dashboard:

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Port for the server | `5000` (Render handles this automatically) |
| `DATABASE_URL` | PostgreSQL Connection String | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret key for auth tokens | `a_long_random_string` |
| `CORS_ORIGIN` | Allowed frontend domains (comma-separated) | `https://mamapro.vercel.app,http://localhost:3000` |

## Frontend (Vercel)
Set these variables in Vercel settings:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://mamapro-api.onrender.com/api` |

---

### Deployment Steps:
1. **Database**: Create a PostgreSQL instance (e.g., on Render or Supabase).
2. **Backend**: 
   - Connect your GitHub repo.
   - Set the Root Directory to `backend/`.
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
3. **Frontend**:
   - Connect your GitHub repo.
   - Set the Root Directory to `frontend/`.
   - Framework: Next.js.
   - Set `NEXT_PUBLIC_API_URL` to your Backend URL.
