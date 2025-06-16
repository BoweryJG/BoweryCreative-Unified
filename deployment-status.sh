#!/bin/bash

echo "🚀 BoweryCreative Deployment Status"
echo "=================================="
echo ""

# Check each project
check_project() {
    local dir=$1
    local name=$2
    
    echo "📁 $name ($dir)"
    if [ -d "$dir/.git" ]; then
        cd "$dir"
        echo -n "   Git Remote: "
        git remote get-url origin 2>/dev/null || echo "Not configured"
        
        echo -n "   Branch: "
        git branch --show-current 2>/dev/null || echo "Unknown"
        
        echo -n "   Status: "
        if [ -z "$(git status --porcelain 2>/dev/null)" ]; then
            echo "✅ Clean"
        else
            echo "⚠️  Uncommitted changes"
        fi
        
        # Check for deployment config
        if [ -f "netlify.toml" ]; then
            echo "   Deploy: Netlify (configured)"
        elif [ -f "render.yaml" ]; then
            echo "   Deploy: Render (configured)"
        elif [ -f "vercel.json" ]; then
            echo "   Deploy: Vercel (configured)"
        else
            echo "   Deploy: ❌ Not configured"
        fi
        
        cd ..
    else
        echo "   ❌ Not a Git repository"
    fi
    echo ""
}

check_project "frontend" "Frontend"
check_project "backend" "Backend"
check_project "payments" "Payments Portal"
check_project "dashboard" "Admin Dashboard"
check_project "social-manager" "Social Manager"

echo "=================================="
echo ""
echo "🔧 Next Steps:"
echo "1. Commit any uncommitted changes"
echo "2. Update Netlify/Render deployment settings"
echo "3. Test deployments"