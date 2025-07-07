# Remove console.error statements from TypeScript/React files
$ErrorActionPreference = "Continue"

# Get all TypeScript and TSX files in src directory
$files = Get-ChildItem -Path "src" -Recurse -Include "*.ts", "*.tsx" | Where-Object { 
    $_.Name -ne "FinancialErrorBoundary.tsx" -and 
    $_.Name -ne "error.tsx"
}

foreach ($file in $files) {
    Write-Host "Processing: $($file.FullName)"
    
    # Read the file content
    $content = Get-Content $file.FullName -Raw
    
    if ($content) {
        # Remove console.error lines but preserve user-friendly error handling
        $updatedContent = $content -replace "(?m)^\s*console\.error\([^;]*\);?\s*\r?\n", ""
        
        # If content changed, write it back
        if ($content -ne $updatedContent) {
            Set-Content $file.FullName -Value $updatedContent -NoNewline
            Write-Host "  Updated: $($file.Name)"
        }
    }
}

Write-Host "Console.error cleanup complete!"
