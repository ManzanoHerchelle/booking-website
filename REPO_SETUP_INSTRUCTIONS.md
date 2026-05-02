# Booking App - Standalone Repository Setup

## Overview
This is a complete, self-contained repository for the Booking App. It includes the full backend (Node.js/Express) and frontend (React/Vite) required to run the application independently.

## What's Included (96 files)

### Backend
- Express.js server with authentication and payment processing
- MySQL database schema and migrations
- REST API controllers and routes for:
  - Room management
  - Reservations and bookings
  - Payments
  - Amenities
  - Admin operations
  - File uploads
- Environment configuration examples
- Integration tests

### Frontend
- React application with Vite bundler
- Admin panel for operations
- User-facing pages for:
  - Room booking
  - Reservation tracking
  - Payments
  - Amenities showcase
- Responsive components and styling

### Configuration Files
- `.gitignore` - Git ignore rules
- `.gitattributes` - Git attributes
- `README.md` - Project documentation
- `package.json` files for both backend and frontend
- Setup script for local development

## How to Push to a New Remote Repository

### Option 1: GitHub
```bash
# Create a new repository on GitHub (don't initialize with README)
# Then run these commands:

cd /path/to/booking-app-standalone
git remote add origin https://github.com/your-username/your-repo-name.git
git branch -M main
git push -u origin main
```

### Option 2: GitLab
```bash
cd /path/to/booking-app-standalone
git remote add origin https://gitlab.com/your-username/your-repo-name.git
git branch -M main
git push -u origin main
```

### Option 3: Bitbucket
```bash
cd /path/to/booking-app-standalone
git remote add origin https://bitbucket.org/your-username/your-repo-name.git
git branch -M main
git push -u origin main
```

## Local Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MySQL/MariaDB server

### Setup
```bash
./scripts/setup.sh
```

This script will:
- Verify Node.js and npm installation
- Install backend dependencies
- Install frontend dependencies
- Create `.env` files
- Set up the database
- Optionally seed sample data

### Run Development Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

- Frontend: http://127.0.0.1:5173
- Backend: http://127.0.0.1:5000

## Repository Location
Local path: `C:\xampp\htdocs\booking-app-standalone`

---
**Repository Status**: Clean and ready to push  
**Initial Commit**: bc36b1b  
**Files**: 96  
**Branch**: master (rename to main for GitHub)
