@echo off
chcp 65001 >nul
echo ========================================
echo 빠른 재배포
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo [1/4] Git 상태 확인...
git status --short
echo.

echo [2/4] 변경사항 추가...
git add .
echo ✅ 변경사항 추가 완료
echo.

echo [3/4] 커밋 생성...
git commit -m "chore: trigger redeploy - %date% %time%" 2>nul || git commit --allow-empty -m "chore: force redeploy - %date% %time%"
if errorlevel 1 (
    echo ⚠️  커밋 실패, 빈 커밋으로 재시도...
    git commit --allow-empty -m "chore: force redeploy - %date% %time%"
)
echo ✅ 커밋 완료
echo.

echo [4/4] GitHub에 푸시...
git push origin main
if errorlevel 1 (
    echo.
    echo ========================================
    echo ❌ Git 푸시 실패
    echo ========================================
    echo.
    echo Vercel 대시보드에서 수동 재배포하세요:
    echo   1. https://vercel.com/dashboard
    echo   2. Freeshell 프로젝트 클릭
    echo   3. Deployments 탭
    echo   4. 최신 배포의 "..." → "Redeploy"
    echo.
    pause
    exit /b 1
)
echo.

echo ========================================
echo ✅ 재배포 트리거 완료!
echo ========================================
echo.
echo Vercel에서 자동으로 배포가 시작됩니다.
echo.
echo 배포 상태 확인:
echo https://vercel.com/dashboard
echo.
echo 배포 완료까지 약 1-2분 소요됩니다.
echo.
timeout /t 3 >nul
start https://vercel.com/dashboard
pause

