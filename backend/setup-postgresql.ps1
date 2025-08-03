# SmartOutlet POS PostgreSQL Setup Script
# This script helps set up PostgreSQL and create required databases

Write-Host "=== SmartOutlet POS PostgreSQL Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if PostgreSQL is installed
Write-Host "Checking PostgreSQL installation..." -ForegroundColor Yellow
try {
    $psqlVersion = psql --version 2>$null
    if ($psqlVersion) {
        Write-Host "✅ PostgreSQL is installed: $psqlVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ PostgreSQL is not installed or not in PATH" -ForegroundColor Red
        Write-Host "Please install PostgreSQL from: https://www.postgresql.org/download/" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ PostgreSQL is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install PostgreSQL from: https://www.postgresql.org/download/" -ForegroundColor Yellow
    exit 1
}

# Check if PostgreSQL service is running
Write-Host ""
Write-Host "Checking PostgreSQL service status..." -ForegroundColor Yellow
$pgService = Get-Service -Name "*postgresql*" -ErrorAction SilentlyContinue
if ($pgService) {
    if ($pgService.Status -eq "Running") {
        Write-Host "✅ PostgreSQL service is running" -ForegroundColor Green
    } else {
        Write-Host "⚠️  PostgreSQL service is not running. Starting..." -ForegroundColor Yellow
        Start-Service $pgService.Name
        Write-Host "✅ PostgreSQL service started" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  Could not find PostgreSQL service. Please ensure PostgreSQL is properly installed." -ForegroundColor Yellow
}

# Test connection to PostgreSQL
Write-Host ""
Write-Host "Testing PostgreSQL connection..." -ForegroundColor Yellow
try {
    $testConnection = psql -U postgres -h localhost -c "SELECT version();" 2>$null
    if ($testConnection) {
        Write-Host "✅ PostgreSQL connection successful" -ForegroundColor Green
    } else {
        Write-Host "❌ PostgreSQL connection failed" -ForegroundColor Red
        Write-Host "Please ensure PostgreSQL is running and accessible" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ PostgreSQL connection failed" -ForegroundColor Red
    Write-Host "Please ensure PostgreSQL is running and accessible" -ForegroundColor Yellow
    exit 1
}

# Create databases
Write-Host ""
Write-Host "Creating SmartOutlet POS databases..." -ForegroundColor Yellow

$databases = @(
    "smartoutlet_auth",
    "smartoutlet_gateway", 
    "smartoutlet_product",
    "smartoutlet_outlet",
    "smartoutlet_pos",
    "smartoutlet_inventory",
    "smartoutlet_recipe",
    "smartoutlet_expense"
)

foreach ($db in $databases) {
    Write-Host "Creating database: $db" -ForegroundColor White
    try {
        $result = psql -U postgres -h localhost -c "CREATE DATABASE $db;" 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✅ Created: $db" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  Database $db might already exist" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  ❌ Failed to create: $db" -ForegroundColor Red
    }
}

# Grant privileges
Write-Host ""
Write-Host "Granting privileges..." -ForegroundColor Yellow
foreach ($db in $databases) {
    try {
        $result = psql -U postgres -h localhost -c "GRANT ALL PRIVILEGES ON DATABASE $db TO postgres;" 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✅ Granted privileges on: $db" -ForegroundColor Green
        }
    } catch {
        Write-Host "  ❌ Failed to grant privileges on: $db" -ForegroundColor Red
    }
}

# List created databases
Write-Host ""
Write-Host "Listing SmartOutlet databases:" -ForegroundColor Yellow
try {
    $dbList = psql -U postgres -h localhost -c "SELECT datname FROM pg_database WHERE datname LIKE 'smartoutlet_%';" 2>$null
    Write-Host $dbList -ForegroundColor White
} catch {
    Write-Host "Could not list databases" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== PostgreSQL Setup Complete ===" -ForegroundColor Cyan
Write-Host "You can now start the SmartOutlet POS services!" -ForegroundColor Green
Write-Host ""
Write-Host "To start all services, run:" -ForegroundColor Yellow
Write-Host "  .\run-all-services.sh" -ForegroundColor White
Write-Host ""
Write-Host "Or start individual services:" -ForegroundColor Yellow
Write-Host "  cd auth-service && powershell -ExecutionPolicy Bypass -File download-maven.ps1" -ForegroundColor White 