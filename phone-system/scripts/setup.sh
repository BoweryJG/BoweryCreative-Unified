#!/bin/bash

# Bowery Platform Setup Script

echo "🚀 Setting up Bowery Platform..."

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed. Aborting." >&2; exit 1; }
command -v psql >/dev/null 2>&1 || { echo "❌ PostgreSQL is required but not installed. Aborting." >&2; exit 1; }

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating .env file..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please edit backend/.env with your configuration before proceeding."
    echo "Press Enter to continue after editing..."
    read
fi

# Setup database
echo "🗄️  Setting up database..."
read -p "Enter PostgreSQL admin username (default: postgres): " PG_USER
PG_USER=${PG_USER:-postgres}

read -p "Enter database name (default: bowery_platform): " DB_NAME
DB_NAME=${DB_NAME:-bowery_platform}

read -p "Enter database user (default: bowery_user): " DB_USER
DB_USER=${DB_USER:-bowery_user}

read -s -p "Enter database password: " DB_PASS
echo

# Create database and user
psql -U $PG_USER <<EOF
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASS';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
EOF

# Update .env with database credentials
sed -i "s/DB_DATABASE=.*/DB_DATABASE=$DB_NAME/" backend/.env
sed -i "s/DB_USERNAME=.*/DB_USERNAME=$DB_USER/" backend/.env
sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=$DB_PASS/" backend/.env

# Run migrations
echo "🔄 Running database migrations..."
cd backend
npm run typeorm migration:run
cd ..

# Create initial admin user
echo "👤 Creating initial admin user..."
psql -U $DB_USER -d $DB_NAME < database/init.sql

echo "✅ Setup complete!"
echo ""
echo "To start the development servers, run:"
echo "  npm run dev"
echo ""
echo "Default admin credentials:"
echo "  Email: admin@boweryplatform.com"
echo "  Password: admin123"
echo ""
echo "⚠️  Remember to:"
echo "  1. Change the admin password after first login"
echo "  2. Configure your Twilio and Stripe credentials in backend/.env"
echo "  3. Set up webhook URLs in Twilio and Stripe dashboards"