# Booking Website

## Prerequisites (Mac)

- Git
- Node.js (includes npm)
- MySQL or MariaDB server

Note: macOS may already use port `5000` for system services (AirPlay). If `http://127.0.0.1:5000` does not hit your Node server, use a different backend port (the setup script defaults to `5050` on macOS).

## One-time Setup

Run:

```bash
./scripts/setup.sh
```

This script:

- Checks `git`, `node`, and `npm`
- Installs dependencies for `backend/` and `frontend/`
- Creates `backend/.env` if missing
- Provisions the database using `backend/database/schema.sql` and `backend/database/migrations/*.sql`
- Optionally seeds an admin account and sample rooms

## Run Locally

In two terminals:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

Frontend: `http://127.0.0.1:5173`  
Backend: `http://127.0.0.1:5000`

If you get “permission denied” when running the setup script:

```bash
chmod +x ./scripts/setup.sh
./scripts/setup.sh
```
