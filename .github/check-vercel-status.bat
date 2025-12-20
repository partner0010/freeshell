@echo off
chcp 65001 >nul
echo ========================================
echo Vercel 배포 상태 확인
echo ========================================
echo.

echo [1] 로컬 빌드 테스트...
echo.
cd /d "%~dp0"
if exist package.json (
    echo npm run build 실행 중...
    call npm run build
    if errorlevel 1 (
        echo.
        echo ❌ 빌드 실패! 오류를 확인하세요.
        echo.
    ) else (
        echo.
        echo ✅ 로컬 빌드 성공!
        echo.
    )
) else (
    echo package.json을 찾을 수 없습니다.
)
echo.

echo [2] Git 상태 확인...
git status --short
echo.

echo [3] 최근 커밋 확인...
git log --oneline -3
echo.

echo [4] 원격 저장소 확인...
git remote -v
echo.

echo ========================================
echo 다음 단계:
echo ========================================
echo.
echo 1. Vercel 대시보드 확인:
echo    https://vercel.com/dashboard
echo.
echo 2. 배포 상태 확인:
echo    - Ready (초록색) = 정상
echo    - Building = 빌드 중
echo    - Error = 빌드 실패
echo.
echo 3. 배포 URL 확인:
echo    https://your-project.vercel.app
echo.
echo 4. 빌드 로그 확인:
echo    Vercel 대시보드 → Deployments → 최근 배포 → Build Logs
echo.
echo ========================================
pause

