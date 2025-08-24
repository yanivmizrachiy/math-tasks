param([string] =  Quick publish:  + (Get-Date -Format "yyyy-MM-dd HH:mm"))
Stop =  Stop
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw Git לא מותקן }
Set-Location -LiteralPath 
git pull --ff-only origin main | Out-Null
git add -A
 = git status --porcelain
if ([string]::IsNullOrWhiteSpace()) {
  Write-Host "אין שינויים לקמיטת — ממשיך ל-push." -ForegroundColor Yellow
} else {
  git commit -m  | Out-Null
}
git push origin main | Out-Null
Write-Host "✅ Published" -ForegroundColor Green
