@echo off
chcp 65001 >nul
echo ========================================
echo 새 배포 생성
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo [1/3] Git 상태 확인...
git status --short
echo.

echo [2/3] 빈 커밋 생성 (새 배포 트리거)...
git commit --allow-empty -m "trigger fresh deployment"
if errorlevel 1 (
    echo 커밋 실패 (변경사항이 없을 수 있음)
    echo 계속 진행합니다...
)
echo.

echo [3/3] GitHub에 푸시...
git push origin main
if errorlevel 1 (
    echo 오류: git push 실패
    echo.
    echo 수동으로 푸시하세요:
    echo   git push origin main
    pause
    exit /b 1
)
echo.

echo ========================================
echo 새 배포 트리거 완료!
echo ========================================
echo.
echo Vercel에서 자동으로 새 배포가 시작됩니다.
echo.
echo 다음 단계:
echo 1. Vercel 대시보드에서 배포 상태 확인
echo 2. 배포 완료 후 새 URL 확인
echo 3. 새 URL로 접속 시도
echo.
echo Vercel 대시보드:
echo https://vercel.com/dashboard
echo.
pause

