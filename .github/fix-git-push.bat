@echo off
chcp 65001 >nul
echo ========================================
echo Git 푸시 오류 해결 스크립트
echo ========================================
echo.

set "PROJECT_ROOT=%~dp0.."
cd /d "%PROJECT_ROOT%"

echo 현재 디렉토리: %CD%
echo.

echo [1/4] Git 상태 확인...
git status
echo.

echo [2/4] package.json 변경사항 커밋...
git add package.json
if exist ".github\package.json" (
    git add .github\package.json
)
git commit -m "fix: add missing @dnd-kit packages"
echo.

echo [3/4] 원격 변경사항 가져오기...
git pull origin main --rebase
if errorlevel 1 (
    echo.
    echo 충돌이 발생했습니다. 수동으로 해결해주세요.
    pause
    exit /b 1
)
echo.

echo [4/4] 원격 저장소에 푸시...
git push origin main
if errorlevel 1 (
    echo.
    echo 푸시 실패. 다시 시도해주세요.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Git 푸시 완료!
echo ========================================
echo.
echo Netlify에서 자동으로 재배포가 시작됩니다.
echo.
pause

