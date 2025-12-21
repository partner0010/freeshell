@echo off
chcp 65001 >nul
echo ========================================
echo Vercel 직접 배포
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] Vercel CLI 확인...
where vercel >nul 2>&1
if errorlevel 1 (
    echo Vercel CLI가 설치되어 있지 않습니다.
    echo.
    echo 설치 중...
    call npm install -g vercel
    if errorlevel 1 (
        echo 오류: Vercel CLI 설치 실패
        echo 수동으로 설치하세요: npm install -g vercel
        pause
        exit /b 1
    )
)
echo ✅ Vercel CLI 확인됨
echo.

echo [2/4] 로그인 확인...
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo Vercel에 로그인해야 합니다.
    echo.
    call vercel login
    if errorlevel 1 (
        echo 오류: 로그인 실패
        pause
        exit /b 1
    )
)
echo ✅ 로그인 확인됨
echo.

echo [3/4] 프로덕션 배포...
vercel --prod
if errorlevel 1 (
    echo 오류: 배포 실패
    pause
    exit /b 1
)
echo.

echo [4/4] 배포 완료!
echo.
echo ========================================
echo 배포가 완료되었습니다.
echo Vercel 대시보드에서 배포 상태를 확인하세요.
echo ========================================
echo.
pause

