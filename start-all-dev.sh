#!/bin/bash

# Start all BoweryCreative development servers
echo "🚀 Starting BoweryCreative Development Environment"

# Function to start a project in a new terminal tab
start_project() {
    local dir=$1
    local name=$2
    local port=$3
    
    if [ -d "$dir" ] && [ -f "$dir/package.json" ]; then
        echo "Starting $name on port $port..."
        osascript -e "tell application \"Terminal\" to do script \"cd $(pwd)/$dir && npm run dev\""
    else
        echo "⚠️  $name not found at $dir"
    fi
}

# Start each project
start_project "frontend" "Frontend" "5173"
start_project "backend" "Backend" "3000"
start_project "payments" "Payments" "5174"
start_project "dashboard" "Dashboard" "5175"
start_project "social-manager/backend" "Social Manager" "8080"

echo "✅ All projects starting..."
echo ""
echo "📱 Access your projects at:"
echo "   Frontend:  http://localhost:5173"
echo "   Backend:   http://localhost:3000"
echo "   Payments:  http://localhost:5174"
echo "   Dashboard: http://localhost:5175"
echo "   Social:    http://localhost:8080"