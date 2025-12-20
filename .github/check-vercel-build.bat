@echo off
chcp 65001 >nul
echo ========================================
echo Vercel 빌드 상태 확인
echo ========================================
echo.

echo [1/3] 로컬 빌드 테스트...
cd /d "%~dp0"
cd ..

call npm run build
if errorlevel 1 (
    echo.
    echo ❌ 로컬 빌드 실패!
    echo.
    echo Vercel에서도 실패할 가능성이 높습니다.
    echo 오류를 수정한 후 다시 시도하세요.
    echo.
    pause
    exit /b 1
) else (
    echo.
    echo ✅ 로컬 빌드 성공!
    echo.
    echo Vercel에서도 성공할 가능성이 높습니다.
    echo.
)
echo.

echo [2/3] package.json 확인...
if exist "package.json" (
    findstr /C:"bcryptjs" "package.json" >nul
    if errorlevel 1 (
        echo ❌ bcryptjs가 package.json에 없습니다.
    ) else (
        echo ✅ bcryptjs 확인됨
    )
    
    findstr /C:"next-auth" "package.json" >nul
    if errorlevel 1 (
        echo ❌ next-auth가 package.json에 없습니다.
    ) else (
        echo ✅ next-auth 확인됨
    )
) else (
    echo ❌ package.json을 찾을 수 없습니다.
)
echo.

echo [3/3] next.config.js 확인...
if exist "next.config.js" (
    findstr /C:"ignoreDuringBuilds" "next.config.js" >nul
    if errorlevel 1 (
        echo ⚠️  next.config.js에 ignoreDuringBuilds가 없습니다.
        echo    ESLint 오류가 발생할 수 있습니다.
    ) else (
        echo ✅ ignoreDuringBuilds 설정 확인됨
    )
) else (
    echo ❌ next.config.js를 찾을 수 없습니다.
)
echo.

echo ========================================
echo 확인 완료!
echo ========================================
echo.
echo 다음 단계:
echo 1. Vercel 대시보드에서 빌드 로그 확인
echo 2. 오류 메시지 확인
echo 3. 수정 후 재배포
echo.
echo Vercel 대시보드:
echo https://vercel.com/dashboard
echo.
pause

