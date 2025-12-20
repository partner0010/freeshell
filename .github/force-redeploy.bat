@echo off
chcp 65001 >nul
echo ========================================
echo 강제 재배포
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo [방법 1] Git 경로 문제 해결 후 푸시
echo.
echo Git 경로 문제를 해결합니다...
git config --global --add safe.directory "C:/Users/partn/OneDrive/바탕 화면/Cursor/Freeshell"
if errorlevel 1 (
    echo ⚠️  Git 경로 설정 실패
) else (
    echo ✅ Git 경로 설정 완료
)
echo.

echo [방법 2] 변경사항 확인 및 커밋
echo.
git status --short
echo.

echo 변경사항이 있으면 커밋합니다...
git add .
git commit -m "chore: trigger redeploy - %date% %time%"
if errorlevel 1 (
    echo ⚠️  커밋 실패 (변경사항이 없을 수 있음)
    echo 빈 커밋으로 재배포를 트리거합니다...
    git commit --allow-empty -m "chore: force redeploy - %date% %time%"
)
echo.

echo [방법 3] GitHub에 푸시
echo.
git push origin main
if errorlevel 1 (
    echo.
    echo ========================================
    echo Git 푸시 실패
    echo ========================================
    echo.
    echo 수동으로 다음을 실행하세요:
    echo   1. git add .
    echo   2. git commit -m "chore: redeploy"
    echo   3. git push origin main
    echo.
    echo 또는 Vercel 대시보드에서 수동 재배포:
    echo   1. https://vercel.com/dashboard 접속
    echo   2. Freeshell 프로젝트 클릭
    echo   3. Deployments 탭
    echo   4. 최신 배포의 "..." 메뉴 클릭
    echo   5. "Redeploy" 선택
    echo.
    pause
    exit /b 1
)
echo.

echo ========================================
echo 재배포 트리거 완료!
echo ========================================
echo.
echo Vercel에서 자동으로 배포가 시작됩니다.
echo.
echo 배포 상태 확인:
echo https://vercel.com/dashboard
echo.
pause
