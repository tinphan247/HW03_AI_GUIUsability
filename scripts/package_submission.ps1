# Tạo git_commit_log.txt và zip bài nộp.
# Usage: powershell -File scripts/package_submission.ps1 -Score 090
param(
  [string]$Score = "090",
  [string]$OutDir = "C:\HCMUS\hk7\Testing\hw3"
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Push-Location $Root

git log --pretty=format:"%h | %ad | %an | %s" --date=iso > git_commit_log.txt
Write-Output "Wrote git_commit_log.txt ($((Get-Content git_commit_log.txt).Count) commits)"

$Name = "23120372_HW03_AI_GUIUsability_$Score"
$Zip = Join-Path $OutDir "$Name.zip"
$Stage = Join-Path $env:TEMP "hw03_package_$([guid]::NewGuid().ToString('N').Substring(0,8))"
New-Item -ItemType Directory -Force -Path $Stage | Out-Null

# Copy toàn bộ trừ artefact nặng / riêng tư
$exclude = @("node_modules", ".git", "evidence\raw", "*.mp4", "*.zip")
robocopy $Root $Stage /E /XD node_modules .git evidence\raw __pycache__ /XF *.mp4 *.zip local.log *.pyc | Out-Null

# Không đưa recording/consent gốc vào zip công khai
Get-ChildItem -Path $Stage -Recurse -Include "recording*.mp4" -ErrorAction SilentlyContinue | Remove-Item -Force
Get-ChildItem -Path $Stage -Recurse -Include "consent-raw*" -ErrorAction SilentlyContinue | Remove-Item -Force

# Dữ liệu chứa thông tin cá nhân thật (họ tên + SĐT) — chỉ giữ local, gửi TA khi được yêu cầu
$pii = @("gform_responses.csv", "gform_responses_dedup.csv", "contacts_local.csv")
foreach ($f in $pii) {
  Get-ChildItem -Path $Stage -Recurse -Include $f -ErrorAction SilentlyContinue | ForEach-Object {
    Remove-Item $_.FullName -Force
    Write-Output "Excluded PII file: $($_.Name)"
  }
}

if (Test-Path $Zip) { Remove-Item $Zip -Force }
Compress-Archive -Path (Join-Path $Stage "*") -DestinationPath $Zip -CompressionLevel Optimal
Remove-Item -Recurse -Force $Stage

$size = [math]::Round((Get-Item $Zip).Length / 1MB, 1)
Write-Output "Wrote $Zip ($size MB)"
Pop-Location
