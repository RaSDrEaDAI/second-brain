# PowerShell Cleanup Script

# Remove large files
Get-ChildItem -Path . -Recurse | Where-Object {$_.Length -gt 10MB} | ForEach-Object {
    Write-Host "Removing large file: $($_.FullName)"
    Remove-Item $_.FullName -Force
}

# Remove node_modules completely
if (Test-Path "node_modules") {
    Remove-Item "node_modules" -Recurse -Force
}

# Remove .next cache
if (Test-Path ".next") {
    Remove-Item ".next" -Recurse -Force
}

# Clean npm cache
npm cache clean --force

# Recreate minimal package.json
@"
{
  "name": "second-brain",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.1.0",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  }
}
"@ | Set-Content package.json

# Reinstall minimal dependencies
npm ci