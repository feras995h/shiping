#!/bin/bash

# Golden Horse Shipping & Finance System Docker Setup Script
echo "🐳 Setting up Golden Horse Shipping & Finance System with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "🔧 Creating .env file for Docker..."
    cat > .env << EOF
# Database
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/shipping_finance_db"

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
    echo "✅ .env file created for Docker."
fi

# Build and start services
echo "🐳 Building and starting Docker services..."
docker-compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose exec app npx prisma db push

# Seed database
echo "🌱 Seeding database with sample data..."
docker-compose exec app npx prisma db seed

echo "✅ Docker setup completed successfully!"
echo ""
echo "🎉 Services are now running:"
echo "   - Application: http://localhost:3000"
echo "   - Database: localhost:5432"
echo "   - Redis: localhost:6379"
echo ""
echo "🔐 Default login credentials:"
echo "   Email: admin@goldenhorse.com"
echo "   Password: admin123"
echo ""
echo "📋 Useful commands:"
echo "   - View logs: docker-compose logs -f"
echo "   - Stop services: docker-compose down"
echo "   - Restart services: docker-compose restart"
echo "   - Access database: docker-compose exec postgres psql -U postgres -d shipping_finance_db"
echo ""
echo "📖 For more information, check the README.md file." 