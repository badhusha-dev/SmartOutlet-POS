#!/bin/bash

# SmartOutlet Frontend Development Script
# Quick commands for frontend development

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(dirname "$SCRIPT_DIR")"

echo -e "${BLUE}SmartOutlet Frontend Development Script${NC}"
echo "=============================================="

# Check if we're in the right directory
if [[ ! -f "$FRONTEND_DIR/package.json" ]]; then
    echo -e "${RED}Error: This script must be run from the frontend directory${NC}"
    exit 1
fi

cd "$FRONTEND_DIR"

# Function to show menu
show_menu() {
    echo ""
    echo "Available commands:"
    echo "1) Install dependencies"
    echo "2) Start development server"
    echo "3) Start dev server (no auth)"
    echo "4) Build for production"
    echo "5) Preview production build"
    echo "6) Run linting"
    echo "7) Fix linting issues"
    echo "8) Clean build files"
    echo "9) Show project info"
    echo "0) Exit"
    echo ""
    read -p "Enter your choice (0-9): " choice
}

# Function to execute command
execute_command() {
    case $1 in
        1)
            echo -e "${GREEN}Installing dependencies...${NC}"
            npm install
            ;;
        2)
            echo -e "${GREEN}Starting development server...${NC}"
            echo "Server will be available at: http://localhost:3000"
            npm run dev
            ;;
        3)
            echo -e "${GREEN}Starting development server without auth...${NC}"
            echo "Server will be available at: http://localhost:3000"
            npm run dev:no-auth
            ;;
        4)
            echo -e "${GREEN}Building for production...${NC}"
            npm run build
            echo "Build completed in dist/ directory"
            ;;
        5)
            echo -e "${GREEN}Starting preview server...${NC}"
            echo "Server will be available at: http://localhost:4173"
            npm run preview
            ;;
        6)
            echo -e "${GREEN}Running ESLint...${NC}"
            npm run lint
            ;;
        7)
            echo -e "${GREEN}Fixing linting issues...${NC}"
            npm run lint -- --fix
            ;;
        8)
            echo -e "${GREEN}Cleaning build files...${NC}"
            if [[ -d "dist" ]]; then
                rm -rf dist
                echo "Build files cleaned"
            else
                echo "No build files to clean"
            fi
            ;;
        9)
            echo -e "${GREEN}Project Information:${NC}"
            echo "Name: $(node -p "require('./package.json').name")"
            echo "Version: $(node -p "require('./package.json').version")"
            echo "Node.js: $(node --version)"
            echo "npm: $(npm --version)"
            ;;
        0)
            echo -e "${GREEN}Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice. Please try again.${NC}"
            ;;
    esac
}

# Main script
if [[ $# -eq 0 ]]; then
    # Interactive mode
    while true; do
        show_menu
        execute_command $choice
    done
else
    # Command line mode
    case $1 in
        install)
            npm install
            ;;
        dev)
            npm run dev
            ;;
        dev:no-auth)
            npm run dev:no-auth
            ;;
        build)
            npm run build
            ;;
        preview)
            npm run preview
            ;;
        lint)
            npm run lint
            ;;
        lint:fix)
            npm run lint -- --fix
            ;;
        clean)
            rm -rf dist
            echo "Build files cleaned"
            ;;
        info)
            echo "Name: $(node -p "require('./package.json').name")"
            echo "Version: $(node -p "require('./package.json').version")"
            echo "Node.js: $(node --version)"
            echo "npm: $(npm --version)"
            ;;
        *)
            echo "Usage: $0 [install|dev|dev:no-auth|build|preview|lint|lint:fix|clean|info]"
            echo "Or run without arguments for interactive mode"
            exit 1
            ;;
    esac
fi 