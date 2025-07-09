#!/bin/bash

# SmartOutlet POS System - Development Stop Script
echo "🛑 Stopping SmartOutlet POS System - Development Environment"
echo "============================================================="

# Stop frontend if running locally
if pgrep -f "npm start" > /dev/null; then
    echo "🛑 Stopping local frontend..."
    pkill -f "npm start"
    echo "✅ Frontend stopped"
fi

# Stop all Docker services
echo "🛑 Stopping Docker services..."
docker-compose down

# Optionally remove volumes (uncomment if needed)
# echo "🧹 Removing volumes..."
# docker-compose down -v

echo "✅ All services stopped"
echo ""
echo "🔧 Additional cleanup options:"
echo "   Remove volumes:      docker-compose down -v"
echo "   Remove images:       docker-compose down --rmi all"
echo "   System cleanup:      docker system prune"
echo ""
echo "🚀 To start again:      ./scripts/start-dev.sh"