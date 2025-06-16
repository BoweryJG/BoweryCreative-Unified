#!/bin/bash

echo "🔄 BoweryCreative Sync Status"
echo "============================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

check_sync() {
    local dir=$1
    local name=$2
    
    if [ -d "$dir/.git" ]; then
        cd "$dir"
        
        # Fetch latest from remote
        git fetch origin &>/dev/null
        
        # Check if we're behind/ahead
        LOCAL=$(git rev-parse @)
        REMOTE=$(git rev-parse @{u} 2>/dev/null)
        BASE=$(git merge-base @ @{u} 2>/dev/null)
        
        echo -n "📁 $name: "
        
        if [ -z "$REMOTE" ]; then
            echo -e "${RED}No remote tracking${NC}"
        elif [ $LOCAL = $REMOTE ]; then
            if [ -z "$(git status --porcelain)" ]; then
                echo -e "${GREEN}✅ Fully synced${NC}"
            else
                echo -e "${YELLOW}⚠️  Local changes not pushed${NC}"
            fi
        elif [ $LOCAL = $BASE ]; then
            echo -e "${YELLOW}⬇️  Behind remote (need to pull)${NC}"
        elif [ $REMOTE = $BASE ]; then
            echo -e "${YELLOW}⬆️  Ahead of remote (need to push)${NC}"
        else
            echo -e "${RED}🔀 Diverged (need to merge)${NC}"
        fi
        
        cd ..
    else
        echo "📁 $name: ${RED}Not a Git repository${NC}"
    fi
}

check_sync "frontend" "Frontend"
check_sync "backend" "Backend"
check_sync "payments" "Payments"
check_sync "dashboard" "Dashboard"
check_sync "social-manager" "Social Manager"

echo ""
echo "============================="
echo "💡 Quick commands:"
echo "   Pull all:  git submodule foreach git pull"
echo "   Push all:  git submodule foreach git push"