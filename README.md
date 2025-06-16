# BoweryCreative Unified Project

All BoweryCreative projects organized in one place.

## 📁 Project Structure

```
BoweryCreative-Unified/
├── frontend/         → Main website (bowerycreativeagency.com)
├── backend/          → API & backend services  
├── payments/         → Payment portal (start.bowerycreativeagency.com)
├── dashboard/        → Admin dashboard (bowerycreative-dashboard.netlify.app)
├── social-manager/   → AI-powered social media manager (NEW)
└── docs/            → Shared documentation
```

## 🚀 Quick Links

| Project | Local Dev | Production | GitHub |
|---------|-----------|------------|---------|
| Frontend | localhost:5173 | [bowerycreativeagency.com](https://bowerycreativeagency.com) | [GitHub](https://github.com/BoweryJG/BoweryCreative) |
| Backend | localhost:3000 | TBD | [GitHub](https://github.com/BoweryJG/BoweryCreative-backend) |
| Payments | localhost:5174 | [start.bowerycreativeagency.com](https://start.bowerycreativeagency.com) | TBD |
| Dashboard | localhost:5175 | [bowerycreative-dashboard.netlify.app](https://bowerycreative-dashboard.netlify.app) | [GitHub](https://github.com/BoweryJG/missioncontrolbowerycreative) |
| Social Manager | localhost:8080 | Coming Soon | TBD |

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase CLI (optional)

### Quick Start
```bash
# Install dependencies for all projects
cd BoweryCreative-Unified
for dir in */; do
  if [ -f "$dir/package.json" ]; then
    echo "Installing dependencies for $dir"
    cd "$dir" && npm install && cd ..
  fi
done
```

### Running Projects
```bash
# Frontend
cd frontend && npm run dev

# Backend
cd backend && npm start

# Payments
cd payments && npm run dev

# Dashboard
cd dashboard && npm run dev

# Social Manager
cd social-manager && npm run dev
```

## 🔑 Environment Variables

Each project needs its own `.env` file. Check each project's `.env.example` for required variables.

## 📦 Shared Resources

- **Supabase Projects**:
  - Agency: `fiozmyoedptukpkzuhqm` (tracking & config)
  - Apps: Various per project
  
- **Domains**:
  - Main: bowerycreativeagency.com
  - Payments: start.bowerycreativeagency.com
  - Dashboard: bowerycreative-dashboard.netlify.app

## 🚦 Status

- ✅ Frontend - Live
- ✅ Backend - Live
- ✅ Payments - Live
- ✅ Dashboard - Live (internal only)
- 🚧 Social Manager - In development