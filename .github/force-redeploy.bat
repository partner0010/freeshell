@echo off
chcp 65001 >nul
echo ========================================
echo Vercel 강제 재배포
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] Git 상태 확인...
git status --short
echo.

echo [2/4] 빈 커밋 생성 (재배포 트리거)...
git commit --allow-empty -m "chore: force redeploy - $(date /t)"
if errorlevel 1 (
    echo 커밋 실패 (변경사항이 없을 수 있음)
    echo 계속 진행합니다...
)
echo.

echo [3/4] 원격 저장소로 푸시...
git push origin main
if errorlevel 1 (
    echo main 브랜치가 없습니다. master 브랜치를 시도합니다...
    git push origin master
    if errorlevel 1 (
        echo 오류: git push 실패
        echo.
        echo 현재 브랜치 확인: git branch
        echo 수동으로 푸시하세요
        pause
        exit /b 1
    )
)
echo.

echo [4/4] 배포 트리거 완료!
echo.
echo ========================================
echo GitHub에 푸시되었습니다.
echo Vercel에서 자동 배포가 시작됩니다.
echo.
echo Vercel 대시보드에서 배포 상태를 확인하세요:
echo https://vercel.com/dashboard
echo ========================================
echo.
pause

