@echo off
chcp 65001 >nul
echo ========================================
echo 도메인 접속 가능 여부 확인
echo ========================================
echo.

REM Vercel 프로젝트 이름 확인 (환경 변수 또는 설정 파일에서)
set VERCEL_PROJECT=%~1
if "%VERCEL_PROJECT%"=="" (
    echo Vercel 프로젝트 이름을 확인하는 중...
    REM package.json에서 확인하거나 사용자에게 입력받기
    set VERCEL_PROJECT=freeshell
)

set VERCEL_URL=https://%VERCEL_PROJECT%.vercel.app

echo [1/3] Vercel 배포 상태 확인...
echo Vercel URL: %VERCEL_URL%
echo.
echo Vercel 대시보드에서 배포 상태를 확인하세요:
echo https://vercel.com/dashboard
echo.

echo [2/3] 도메인 접속 테스트...
echo.
echo Vercel 기본 도메인 (%VERCEL_URL%) 테스트 중...
curl -I %VERCEL_URL% 2>nul
if errorlevel 1 (
    echo curl이 설치되어 있지 않습니다.
    echo PowerShell로 테스트합니다...
    powershell -Command "try { $response = Invoke-WebRequest -Uri '%VERCEL_URL%' -Method Head -TimeoutSec 10 -ErrorAction Stop; Write-Host '✅ 접속 가능! 상태 코드:' $response.StatusCode } catch { Write-Host '❌ 접속 불가:' $_.Exception.Message }"
) else (
    echo ✅ curl 테스트 완료
)
echo.

echo [3/3] DNS 전파 상태 확인...
echo.
echo DNS 전파는 보통 24-48시간이 소요됩니다.
echo 현재 시간: %date% %time%
echo.
echo DNS 전파 확인 방법:
echo 1. https://www.whatsmydns.net 에서 도메인 확인
echo 2. https://dnschecker.org 에서 전 세계 DNS 전파 상태 확인
echo 3. nslookup 명령어로 확인
echo.

echo ========================================
echo 도메인 접속 가능 여부
echo ========================================
echo.
echo Vercel 기본 도메인:
echo   %VERCEL_URL%
echo   - 배포 완료 후 즉시 접속 가능 (보통 1-2분)
echo.
echo 커스텀 도메인:
echo   - DNS 설정 후 24-48시간 소요
echo   - 전 세계 전파 완료까지 최대 48시간
echo.
echo 현재 상태 확인:
echo   1. Vercel 대시보드: https://vercel.com/dashboard
echo   2. 배포 로그 확인
echo   3. 도메인 설정 확인
echo.
echo ========================================
echo.
pause

