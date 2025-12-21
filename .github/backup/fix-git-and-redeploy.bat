@echo off
chcp 65001 >nul
echo ========================================
echo Git 경로 수정 및 재배포
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo [1/5] Git 경로 문제 해결...
set REPO_PATH=C:/Users/partn/OneDrive/바탕 화면/Cursor/Freeshell
git config --global --add safe.directory "%REPO_PATH%"
if errorlevel 1 (
    echo ⚠️  Git 경로 설정 실패
    echo    수동으로 설정하세요:
    echo    git config --global --add safe.directory "%REPO_PATH%"
) else (
    echo ✅ Git 경로 설정 완료
)
echo.

echo [2/5] Git 상태 확인...
git status --short
echo.

echo [3/5] 변경사항 추가...
git add .
echo ✅ 변경사항 추가 완료
echo.

echo [4/5] 커밋 생성...
git commit -m "chore: trigger redeploy - %date% %time%" 2>nul
if errorlevel 1 (
    echo 변경사항이 없어 빈 커밋으로 재배포 트리거...
    git commit --allow-empty -m "chore: force redeploy - %date% %time%"
)
echo ✅ 커밋 완료
echo.

echo [5/5] GitHub에 푸시...
git push origin main
if errorlevel 1 (
    echo.
    echo ========================================
    echo ❌ Git 푸시 실패
    echo ========================================
    echo.
    echo Vercel 대시보드에서 수동 재배포하세요:
    echo.
    echo 1. https://vercel.com/dashboard 접속
    echo 2. Freeshell 프로젝트 클릭
    echo 3. Deployments 탭 클릭
    echo 4. 최신 배포의 "..." → "Redeploy" 클릭
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
timeout /t 2 >nul
start https://vercel.com/dashboard
pause

