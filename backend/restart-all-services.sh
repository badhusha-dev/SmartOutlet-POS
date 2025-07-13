#!/bin/bash

# SmartOutlet POS - Restart All Services Script
# This script stops and then starts all services

echo "🔄 Restarting SmartOutlet POS - All Services..."
echo "=============================================="

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🛑 First, stopping all services..."
"$SCRIPT_DIR/stop-all-services.sh"

echo ""
echo "⏳ Waiting 3 seconds before starting services..."
sleep 3

echo ""
echo "🚀 Now starting all services..."
"$SCRIPT_DIR/run-all-services.sh" 