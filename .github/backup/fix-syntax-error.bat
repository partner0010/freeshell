@echo off
chcp 65001 >nul
echo ========================================
echo 구문 오류 수정 및 재배포
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo [문제] route.ts 파일의 satisfies 키워드 구문 오류
echo [해결] 파일 확인 및 수정 후 재배포
echo.

echo [1/4] 파일 확인...
if not exist "src\app\api\auth\[...nextauth]\route.ts" (
    echo ❌ route.ts 파일을 찾을 수 없습니다!
    pause
    exit /b 1
)
echo ✅ 파일 확인됨
echo.

echo [2/4] satisfies 키워드 확인...
findstr /C:"satisfies" "src\app\api\auth\[...nextauth]\route.ts" >nul
if errorlevel 1 (
    echo ✅ satisfies 키워드가 없습니다. (이미 수정됨)
) else (
    echo ⚠️  satisfies 키워드가 발견되었습니다. 제거합니다...
    REM 파일 수정은 수동으로 해야 합니다.
    echo    파일을 열어서 다음 줄을:
    echo    export { handler as GET, handler as POST } satisfies ...;
    echo    다음으로 변경:
    echo    export { handler as GET, handler as POST };
    echo.
    pause
    exit /b 1
)
echo.

echo [3/4] 변경사항 커밋...
git add src/app/api/auth/[...nextauth]/route.ts
git commit -m "fix: remove satisfies keyword from route.ts to resolve syntax error"
if errorlevel 1 (
    echo ⚠️  커밋 실패 (변경사항이 없을 수 있음)
    echo    빈 커밋으로 재배포를 트리거합니다...
    git commit --allow-empty -m "fix: trigger redeploy after syntax error fix"
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
    echo 수동으로 푸시하거나 Vercel에서 수동 재배포하세요:
    echo   1. git push origin main
    echo   2. 또는 Vercel 대시보드에서 Redeploy
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

