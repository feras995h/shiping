#!/bin/bash

# Golden Horse Shipping & Finance System Setup Script
echo "🚀 Setting up Golden Horse Shipping & Finance System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed. Please install PostgreSQL 14+ first."
    echo "   You can use Docker instead: docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15"
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo "🔧 Creating .env file..."
    cat > .env << EOF
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/shipping_finance_db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# JWT
JWT_SECRET="your-jwt-secret-here"

# Email (optional)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"

# External APIs (optional)
SHIPPING_API_KEY="your-shipping-api-key"
PAYMENT_GATEWAY_KEY="your-payment-gateway-key"

# File Upload (optional)
UPLOAD_DIR="public/uploads"
MAX_FILE_SIZE="10485760"
EOF
    echo "✅ .env file created. Please update the values as needed."
fi

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
pnpm db:generate

# Push database schema
echo "🗄️  Setting up database..."
pnpm db:push

# Seed database
echo "🌱 Seeding database with sample data..."
pnpm db:seed

echo "✅ Setup completed successfully!"
echo ""
echo "🎉 You can now start the development server:"
echo "   pnpm dev"
echo ""
echo "🔐 Default login credentials:"
echo "   Email: admin@goldenhorse.com"
echo "   Password: admin123"
echo ""
echo "📖 For more information, check the README.md file." 