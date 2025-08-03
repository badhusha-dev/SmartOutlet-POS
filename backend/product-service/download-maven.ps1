# Download and setup Maven for running the product service
Write-Host "Downloading Maven..." -ForegroundColor Green

# Create temp directory
$tempDir = "temp-maven"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir

# Download Maven
$mavenUrl = "https://archive.apache.org/dist/maven/maven-3/3.9.5/binaries/apache-maven-3.9.5-bin.zip"
$mavenZip = "$tempDir\maven.zip"

try {
    Invoke-WebRequest -Uri $mavenUrl -OutFile $mavenZip
    Write-Host "Maven downloaded successfully" -ForegroundColor Green
    
    # Extract Maven
    Expand-Archive -Path $mavenZip -DestinationPath $tempDir -Force
    
    # Find the extracted Maven directory
    $mavenDir = Get-ChildItem -Path $tempDir -Directory | Where-Object { $_.Name -like "apache-maven*" } | Select-Object -First 1
    
    if ($mavenDir) {
        Write-Host "Maven setup complete. Running product service..." -ForegroundColor Green
        
        # Set JAVA_HOME if not already set
        if (-not $env:JAVA_HOME) {
            $javaPath = (Get-Command java).Source
            $env:JAVA_HOME = Split-Path -Parent (Split-Path -Parent $javaPath)
        }
        
        # Run the product service
        & "$($mavenDir.FullName)\bin\mvn.cmd" spring-boot:run
    } else {
        Write-Host "Failed to find Maven directory" -ForegroundColor Red
    }
} catch {
    Write-Host "Error downloading Maven: $($_.Exception.Message)" -ForegroundColor Red
} 