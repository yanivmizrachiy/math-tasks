Stop = Stop
 = Read-Host "הקלד הודעת commit"
if ([string]::IsNullOrWhiteSpace()) {  = "Manual publish: " + (Get-Date -Format "yyyy-MM-dd HH:mm") }
& (Join-Path  "publish.ps1") -Message 
