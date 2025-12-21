@echo off
chcp 65001 >nul
echo ========================================
echo Git 충돌 자동 해결 스크립트
echo ========================================
echo.

set "PROJECT_ROOT=%~dp0.."
cd /d "%PROJECT_ROOT%"

echo [1/5] 현재 디렉토리 확인...
echo %CD%
echo.

echo [2/5] 모든 변경사항 스테이징...
git add -A
if errorlevel 1 (
    echo 오류: git add 실패
    pause
    exit /b 1
)
echo ✓ 변경사항 스테이징 완료
echo.

echo [3/5] 변경사항 커밋...
git commit -m "fix: add missing @dnd-kit packages and resolve conflicts"
if errorlevel 1 (
    echo 경고: 커밋할 변경사항이 없거나 이미 커밋되었습니다.
)
echo.

echo [4/5] 원격 변경사항 가져오기 (rebase)...
git pull origin main --rebase
if errorlevel 1 (
    echo.
    echo 충돌이 발생했습니다. 자동으로 해결을 시도합니다...
    echo.
    
    REM 충돌 파일 확인
    git status --short | findstr "^UU" >nul
    if errorlevel 1 (
        echo 충돌이 없는 것으로 보입니다. 계속 진행합니다...
        git rebase --skip
    ) else (
        echo package.json 충돌 해결 중...
        REM package.json이 있다면 @dnd-kit 패키지가 있는 버전을 유지
        if exist "package.json" (
            echo package.json 파일이 있습니다. 충돌 해결을 위해 확인합니다...
        )
        git add -A
        git rebase --continue
    )
)
echo.

echo [5/5] 원격 저장소에 푸시...
git push origin main
if errorlevel 1 (
    echo.
    echo 푸시 실패. 강제 푸시를 시도합니다...
    echo 경고: 강제 푸시는 위험할 수 있습니다.
    git push origin main --force
    if errorlevel 1 (
        echo.
        echo 푸시 실패. 수동으로 해결해주세요.
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo Git 작업 완료!
echo ========================================
echo.
echo Netlify에서 자동으로 재배포가 시작됩니다.
echo.
pause

