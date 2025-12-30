# 배치 파일 실행 모니터링 스크립트
# PowerShell에서 실행: .github\monitor-deploy.ps1

$LogFile = "deploy.log"
$ScriptPath = Join-Path $PSScriptRoot "deploy.bat"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "배치 파일 실행 모니터링" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "로그 파일: $LogFile" -ForegroundColor Yellow
Write-Host "배치 파일: $ScriptPath" -ForegroundColor Yellow
Write-Host ""
Write-Host "배치 파일을 시작합니다..." -ForegroundColor Green
Write-Host ""

# 로그 파일이 없으면 생성
if (-not (Test-Path $LogFile)) {
    New-Item -Path $LogFile -ItemType File | Out-Null
}

# 배치 파일을 백그라운드에서 실행
$Process = Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "`"$ScriptPath`"" -NoNewWindow -PassThru

Write-Host "배치 파일 프로세스 ID: $($Process.Id)" -ForegroundColor Cyan
Write-Host ""
Write-Host "로그 파일을 실시간으로 모니터링합니다..." -ForegroundColor Green
Write-Host "종료하려면 Ctrl+C를 누르세요." -ForegroundColor Yellow
Write-Host ""

# 로그 파일 모니터링
$LastSize = 0
while (-not $Process.HasExited) {
    if (Test-Path $LogFile) {
        $CurrentSize = (Get-Item $LogFile).Length
        if ($CurrentSize -gt $LastSize) {
            # 새로 추가된 내용만 읽기
            $Stream = [System.IO.File]::Open($LogFile, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
            $Stream.Position = $LastSize
            $Reader = New-Object System.IO.StreamReader($Stream)
            $NewContent = $Reader.ReadToEnd()
            $Reader.Close()
            $Stream.Close()
            
            if ($NewContent.Trim()) {
                Write-Host $NewContent -NoNewline
            }
            $LastSize = $CurrentSize
        }
    }
    Start-Sleep -Milliseconds 500
}

# 프로세스 종료 후 남은 로그 읽기
if (Test-Path $LogFile) {
    $Stream = [System.IO.File]::Open($LogFile, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
    $Stream.Position = $LastSize
    $Reader = New-Object System.IO.StreamReader($Stream)
    $RemainingContent = $Reader.ReadToEnd()
    $Reader.Close()
    $Stream.Close()
    
    if ($RemainingContent.Trim()) {
        Write-Host $RemainingContent -NoNewline
    }
}

Write-Host ""
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "배치 파일 실행 완료" -ForegroundColor Cyan
Write-Host "종료 코드: $($Process.ExitCode)" -ForegroundColor $(if ($Process.ExitCode -eq 0) { "Green" } else { "Red" })
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "전체 로그 보기:" -ForegroundColor Yellow
Write-Host "Get-Content $LogFile -Tail 50" -ForegroundColor Gray
Write-Host ""
Write-Host "아무 키나 누르면 종료합니다..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

