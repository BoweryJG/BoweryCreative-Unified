#!/bin/bash

# Pre-push build checker for Bowery Creative
# This script ensures both sites build successfully before pushing

echo "🔍 Checking builds before push..."
echo "================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo -e "${RED}❌ Error: You have uncommitted changes. Commit or stash them first.${NC}"
    exit 1
fi

# Test Mission Control build
echo "📦 Building Mission Control..."
cd mission-control
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Mission Control build successful${NC}"
else
    echo -e "${RED}❌ Mission Control build failed${NC}"
    echo "Run 'cd mission-control && npm run build' to see errors"
    exit 1
fi

# Test main site build
echo "📦 Building Main Site..."
cd ../bowerycreativefrontend
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Main site build successful${NC}"
else
    echo -e "${RED}❌ Main site build failed${NC}"
    echo "Run 'cd bowerycreativefrontend && npm run build' to see errors"
    exit 1
fi

cd ..
echo ""
echo -e "${GREEN}✅ All builds successful! Safe to push.${NC}"
echo ""
echo "To push your changes, run:"
echo "  git push"