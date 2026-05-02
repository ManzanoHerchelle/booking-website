#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

need_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing prerequisite: $1"
    exit 1
  fi
}

need_cmd git
need_cmd node
need_cmd npm

echo "Git: $(git --version)"
echo "Node: $(node -v)"
echo "npm:  $(npm -v)"

if [[ ! -f "$BACKEND_DIR/.env" ]]; then
  echo "Creating backend/.env"

  read -r -p "DB host [127.0.0.1]: " DB_HOST
  DB_HOST="${DB_HOST:-127.0.0.1}"

  read -r -p "DB user [root]: " DB_USER
  DB_USER="${DB_USER:-root}"

  read -r -s -p "DB password (blank allowed): " DB_PASSWORD
  echo ""

  read -r -p "DB name [resort_booking_db]: " DB_NAME
  DB_NAME="${DB_NAME:-resort_booking_db}"

  DEFAULT_PORT="5000"
  if [[ "$(uname -s)" == "Darwin" ]]; then
    DEFAULT_PORT="5050"
  fi

  read -r -p "Backend port [$DEFAULT_PORT]: " PORT
  PORT="${PORT:-$DEFAULT_PORT}"

  DEFAULT_JWT_SECRET="$(node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))")"
  read -r -p "JWT secret [auto-generated]: " JWT_SECRET
  JWT_SECRET="${JWT_SECRET:-$DEFAULT_JWT_SECRET}"

  cat > "$BACKEND_DIR/.env" <<EOF
PORT=$PORT
DB_HOST=$DB_HOST
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=$DB_NAME
JWT_SECRET=$JWT_SECRET
EOF
fi

if [[ ! -f "$FRONTEND_DIR/.env" ]]; then
  BACKEND_ORIGIN="http://127.0.0.1:${PORT:-5000}"
  cat > "$FRONTEND_DIR/.env" <<EOF
VITE_API_BASE=$BACKEND_ORIGIN
EOF
fi

echo "Installing backend dependencies..."
(cd "$BACKEND_DIR" && npm install)

echo "Installing frontend dependencies..."
(cd "$FRONTEND_DIR" && npm install)

echo "Database provisioning (optional admin seed)."
read -r -p "Create an admin account now? [Y/n]: " CREATE_ADMIN
CREATE_ADMIN="${CREATE_ADMIN:-Y}"

SEED_ADMIN_EMAIL=""
SEED_ADMIN_PASSWORD=""
SEED_ADMIN_FULL_NAME="Administrator"

if [[ "$CREATE_ADMIN" =~ ^[Yy]$ ]]; then
  read -r -p "Admin full name [Administrator]: " SEED_ADMIN_FULL_NAME
  SEED_ADMIN_FULL_NAME="${SEED_ADMIN_FULL_NAME:-Administrator}"

  read -r -p "Admin email [admin@resort.com]: " SEED_ADMIN_EMAIL
  SEED_ADMIN_EMAIL="${SEED_ADMIN_EMAIL:-admin@resort.com}"

  read -r -s -p "Admin password: " SEED_ADMIN_PASSWORD
  echo ""
fi

read -r -p "Seed sample rooms for testing? [Y/n]: " SEED_SAMPLE_DATA
SEED_SAMPLE_DATA="${SEED_SAMPLE_DATA:-Y}"

export SEED_ADMIN_EMAIL
export SEED_ADMIN_PASSWORD
export SEED_ADMIN_FULL_NAME
export SEED_SAMPLE_DATA

(cd "$BACKEND_DIR" && node scripts/provision-db.js)

echo ""
echo "Setup complete."
echo "Start the servers in two terminals:"
echo "  Backend:  cd backend  && npm run dev"
echo "  Frontend: cd frontend && npm run dev"
