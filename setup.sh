#!/bin/bash

# BrewSpot Booking App - macOS Automated Setup Script
# This script handles the complete setup process including:
# - Installing prerequisites (Node.js, MySQL)
# - Creating database and user
# - Running migrations
# - Setting up backend and frontend

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DB_USER="booking_user"
DB_PASSWORD="booking123"
DB_NAME="resort_booking_db"
DB_HOST="localhost"
JWT_SECRET="your_jwt_secret_key_here"

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  BrewSpot Booking App - Setup Script       ║${NC}"
echo -e "${BLUE}║  macOS Edition                             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print section headers
print_section() {
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}$1${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Check for Homebrew
print_section "Checking Prerequisites"

if ! command_exists brew; then
    echo -e "${YELLOW}Installing Homebrew...${NC}"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    echo -e "${GREEN}✓ Homebrew installed${NC}"
fi

# Install Node.js if not present
if ! command_exists node; then
    echo -e "${YELLOW}Installing Node.js...${NC}"
    brew install node
    echo -e "${GREEN}✓ Node.js installed${NC}"
else
    echo -e "${GREEN}✓ Node.js installed ($(node -v))${NC}"
fi

# Install MySQL if not present
if ! command_exists mysql; then
    echo -e "${YELLOW}Installing MySQL...${NC}"
    brew install mysql
    echo -e "${GREEN}✓ MySQL installed${NC}"
else
    echo -e "${GREEN}✓ MySQL installed ($(mysql --version))${NC}"
fi

# Start MySQL
print_section "Starting MySQL"
if brew services start mysql 2>/dev/null || brew services restart mysql; then
    echo -e "${GREEN}✓ MySQL started${NC}"
else
    echo -e "${YELLOW}MySQL already running${NC}"
fi

# Wait for MySQL to be ready
sleep 2

# Create Database and User
print_section "Setting Up Database"

# Drop database if exists (for clean setup)
mysql -u root <<EOF
DROP DATABASE IF EXISTS $DB_NAME;
DROP USER IF EXISTS '$DB_USER'@'$DB_HOST';
EOF

# Create database and user
mysql -u root <<EOF
CREATE DATABASE $DB_NAME;
CREATE USER '$DB_USER'@'$DB_HOST' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'$DB_HOST';
FLUSH PRIVILEGES;
EOF

echo -e "${GREEN}✓ Database '$DB_NAME' created (fresh)${NC}"
echo -e "${GREEN}✓ User '$DB_USER' created${NC}"

# Run migrations
print_section "Running Database Migrations"

if [ -f "backend/database/schema.sql" ]; then
    mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < backend/database/schema.sql
    echo -e "${GREEN}✓ Main schema imported${NC}"
fi

# Run migration files in order
MIGRATIONS=(
    "backend/database/migrations/2026-03-14-amenities-cards.sql"
    "backend/database/migrations/2026-03-14-amenities-content.sql"
    "backend/database/migrations/2026-03-14-homepage-slides.sql"
    "backend/database/migrations/2026-03-14-landing-content.sql"
    "backend/database/migrations/2026-04-28-booking-ops-upgrades.sql"
    "backend/database/migrations/2026-05-15-inquiries.sql"
)

for migration in "${MIGRATIONS[@]}"; do
    if [ -f "$migration" ]; then
        mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$migration"
        echo -e "${GREEN}✓ Migration $(basename $migration) completed${NC}"
    fi
done

# Setup Backend
print_section "Setting Up Backend"

cd backend

# Create .env file
cat > .env << EOF
DB_HOST=$DB_HOST
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=$DB_NAME
PORT=5000
JWT_SECRET=$JWT_SECRET
NODE_ENV=development
EOF

# Verify .env was created
if [ -f ".env" ]; then
    echo -e "${GREEN}✓ Backend .env file created${NC}"
else
    echo -e "${RED}✗ Failed to create .env file${NC}"
    exit 1
fi

# Install dependencies
if [ -f "package.json" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    npm install --silent
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
fi

cd ..

# Setup Frontend
print_section "Setting Up Frontend"

cd frontend

# Install dependencies
if [ -f "package.json" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    npm install --silent
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
fi

cd ..

# Success message
echo ""
print_section "Setup Complete! 🎉"
echo ""
echo -e "${GREEN}Your BrewSpot Booking App is ready!${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo ""
echo -e "${YELLOW}Terminal 1 - Start Backend:${NC}"
echo "  cd backend"
echo "  npm start"
echo ""
echo -e "${YELLOW}Terminal 2 - Start Frontend:${NC}"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo -e "${BLUE}Access Your App:${NC}"
echo "  🌐 Website: http://localhost:5173"
echo "  🔐 Admin Panel: http://localhost:5173/admin/login"
echo "  📧 Email: admin@brewspot.local"
echo "  🔑 Password: admin123"
echo ""
echo -e "${BLUE}Database Credentials:${NC}"
echo "  Host: $DB_HOST"
echo "  User: $DB_USER"
echo "  Password: $DB_PASSWORD"
echo "  Database: $DB_NAME"
echo ""
echo -e "${GREEN}Happy hosting! 🚀${NC}"
