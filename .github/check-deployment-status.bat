@echo off
chcp 65001 >nul
echo ========================================
echo 배포 상태 종합 확인
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo [1/4] Git 최신 커밋 확인...
git log --oneline -5
echo.

echo [2/4] Vercel CLI 확인...
where vercel >nul 2>&1
if errorlevel 1 (
    echo Vercel CLI가 설치되어 있지 않습니다.
    echo npm install -g vercel 로 설치하세요.
) else (
    echo ✅ Vercel CLI 확인됨
    echo.
    echo Vercel 배포 목록 확인 중...
    vercel ls 2>nul
    if errorlevel 1 (
        echo Vercel에 로그인되어 있지 않습니다.
        echo vercel login 으로 로그인하세요.
    )
)
echo.

echo [3/4] 최근 배포 확인...
echo.
echo Vercel 대시보드에서 확인:
echo https://vercel.com/dashboard
echo.
echo 또는 Vercel CLI로 확인:
echo   vercel ls
echo   vercel inspect [배포URL]
echo.

echo [4/4] 도메인 접속 테스트...
echo.
set VERCEL_URL=https://freeshell.vercel.app
echo 테스트 URL: %VERCEL_URL%
echo.

powershell -Command "try { $response = Invoke-WebRequest -Uri '%VERCEL_URL%' -Method Head -TimeoutSec 10 -ErrorAction Stop; Write-Host '✅ 접속 가능! 상태 코드:' $response.StatusCode; Write-Host '서버:' $response.Headers['Server'] } catch { Write-Host '❌ 접속 불가:' $_.Exception.Message; Write-Host '   - 배포가 아직 진행 중일 수 있습니다.'; Write-Host '   - Vercel 대시보드에서 배포 상태를 확인하세요.' }"
echo.

echo ========================================
echo 배포 상태 요약
echo ========================================
echo.
echo 1. Vercel 기본 도메인 (.vercel.app)
echo    - 배포 완료 후 즉시 접속 가능 (1-2분)
echo    - 전 세계 어디서나 접속 가능
echo.
echo 2. 커스텀 도메인
echo    - DNS 설정 후 24-48시간 소요
echo    - 지역별로 전파 시간 다름
echo.
echo 3. 확인 방법
echo    - Vercel 대시보드: https://vercel.com/dashboard
echo    - 배포 로그에서 URL 확인
echo    - vercel ls 명령어로 확인
echo.
echo ========================================
echo.
pause

