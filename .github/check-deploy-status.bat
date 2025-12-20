@echo off
chcp 65001 >nul
echo ========================================
echo 배포 상태 확인
echo ========================================
echo.

cd /d "%~dp0"

echo [1] Git 상태 확인...
git status --short
echo.

echo [2] 최근 커밋 확인...
git log --oneline -5
echo.

echo [3] 원격 저장소 확인...
git remote -v
echo.

echo [4] 로컬과 원격 차이 확인...
git fetch origin
git log HEAD..origin/main --oneline 2>nul
if %errorlevel% equ 0 (
    echo 원격에 새로운 커밋이 있습니다.
) else (
    echo 로컬과 원격이 동기화되어 있습니다.
)
echo.

echo [5] 로컬 변경사항 확인...
git diff --stat
echo.

echo ========================================
echo 확인 완료
echo ========================================
echo.
echo 배포하려면 deploy.bat를 실행하세요.
echo.
pause

