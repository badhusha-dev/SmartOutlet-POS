#!/bin/bash

# SmartOutlet Frontend Management Script
# Usage: ./scripts/frontend.sh [command]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(dirname "$SCRIPT_DIR")"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_success "Node.js $(node --version) and npm $(npm --version) are installed"
}

# Function to check if we're in the frontend directory
check_directory() {
    if [[ ! -f "$FRONTEND_DIR/package.json" ]]; then
        print_error "This script must be run from the frontend directory or its subdirectories"
        exit 1
    fi
    
    cd "$FRONTEND_DIR"
    print_status "Working directory: $(pwd)"
}

# Function to install dependencies
install_deps() {
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed successfully"
}

# Function to start development server
start_dev() {
    print_status "Starting development server..."
    print_status "Server will be available at: http://localhost:3000"
    print_status "Press Ctrl+C to stop the server"
    npm run dev
}

# Function to start development server without auth
start_dev_no_auth() {
    print_status "Starting development server without authentication..."
    print_status "Server will be available at: http://localhost:3000"
    print_status "Press Ctrl+C to stop the server"
    npm run dev:no-auth
}

# Function to build for production
build_prod() {
    print_status "Building for production..."
    npm run build
    print_success "Production build completed"
    print_status "Build output: $FRONTEND_DIR/dist"
}

# Function to preview production build
preview_build() {
    print_status "Starting preview server for production build..."
    print_status "Server will be available at: http://localhost:4173"
    print_status "Press Ctrl+C to stop the server"
    npm run preview
}

# Function to run linting
run_lint() {
    print_status "Running ESLint..."
    npm run lint
    print_success "Linting completed"
}

# Function to fix linting issues
fix_lint() {
    print_status "Fixing ESLint issues..."
    npm run lint -- --fix
    print_success "Linting issues fixed"
}

# Function to clean build artifacts
clean_build() {
    print_status "Cleaning build artifacts..."
    if [[ -d "$FRONTEND_DIR/dist" ]]; then
        rm -rf "$FRONTEND_DIR/dist"
        print_success "Build artifacts cleaned"
    else
        print_warning "No build artifacts found to clean"
    fi
}

# Function to clean node_modules
clean_deps() {
    print_status "Cleaning node_modules..."
    if [[ -d "$FRONTEND_DIR/node_modules" ]]; then
        rm -rf "$FRONTEND_DIR/node_modules"
        print_success "node_modules cleaned"
    else
        print_warning "No node_modules found to clean"
    fi
}

# Function to clean all (node_modules, dist, package-lock.json)
clean_all() {
    print_status "Cleaning all generated files..."
    clean_build
    clean_deps
    if [[ -f "$FRONTEND_DIR/package-lock.json" ]]; then
        rm -f "$FRONTEND_DIR/package-lock.json"
        print_success "package-lock.json cleaned"
    fi
    print_success "All generated files cleaned"
}

# Function to check for outdated packages
check_updates() {
    print_status "Checking for outdated packages..."
    npm outdated
}

# Function to update dependencies
update_deps() {
    print_status "Updating dependencies..."
    npm update
    print_success "Dependencies updated"
}

# Function to audit dependencies
audit_deps() {
    print_status "Auditing dependencies for security issues..."
    npm audit
}

# Function to fix audit issues
fix_audit() {
    print_status "Fixing security audit issues..."
    npm audit fix
    print_success "Security audit issues fixed"
}

# Function to show project info
show_info() {
    print_status "Project Information:"
    echo "  Name: $(node -p "require('./package.json').name")"
    echo "  Version: $(node -p "require('./package.json').version")"
    echo "  Description: $(node -p "require('./package.json').description")"
    echo "  Node.js: $(node --version)"
    echo "  npm: $(npm --version)"
    echo "  Working Directory: $(pwd)"
}

# Function to check environment variables
check_env() {
    print_status "Checking environment variables..."
    if [[ -f ".env" ]]; then
        print_success ".env file found"
        echo "  Environment variables:"
        grep -v '^#' .env | grep -v '^$' | while read -r line; do
            echo "    $line"
        done
    else
        print_warning ".env file not found"
    fi
    
    if [[ -f ".env.development" ]]; then
        print_success ".env.development file found"
    fi
    
    if [[ -f ".env.production" ]]; then
        print_success ".env.production file found"
    fi
}

# Function to show help
show_help() {
    echo "SmartOutlet Frontend Management Script"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  install     Install dependencies"
    echo "  dev         Start development server"
    echo "  dev:no-auth Start development server without authentication"
    echo "  build       Build for production"
    echo "  preview     Preview production build"
    echo "  lint        Run ESLint"
    echo "  lint:fix    Fix ESLint issues"
    echo "  clean       Clean build artifacts"
    echo "  clean:deps  Clean node_modules"
    echo "  clean:all   Clean all generated files"
    echo "  check       Check for outdated packages"
    echo "  update      Update dependencies"
    echo "  audit       Audit dependencies for security issues"
    echo "  audit:fix   Fix security audit issues"
    echo "  info        Show project information"
    echo "  env         Check environment variables"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 install    # Install dependencies"
    echo "  $0 dev        # Start development server"
    echo "  $0 build      # Build for production"
    echo "  $0 clean:all  # Clean all generated files"
}

# Main script logic
main() {
    # Check prerequisites
    check_node
    check_directory
    
    # Parse command
    case "${1:-help}" in
        install)
            install_deps
            ;;
        dev)
            start_dev
            ;;
        dev:no-auth)
            start_dev_no_auth
            ;;
        build)
            build_prod
            ;;
        preview)
            preview_build
            ;;
        lint)
            run_lint
            ;;
        lint:fix)
            fix_lint
            ;;
        clean)
            clean_build
            ;;
        clean:deps)
            clean_deps
            ;;
        clean:all)
            clean_all
            ;;
        check)
            check_updates
            ;;
        update)
            update_deps
            ;;
        audit)
            audit_deps
            ;;
        audit:fix)
            fix_audit
            ;;
        info)
            show_info
            ;;
        env)
            check_env
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@" 