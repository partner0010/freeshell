@echo off
chcp 65001 >nul
echo ========================================
echo 로컬 빌드 테스트
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo [1/4] package.json 확인...
if exist "package.json" (
    echo ✅ package.json 확인됨
    
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

echo [2/4] next.config.js 확인...
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

echo [3/4] 의존성 설치 확인...
if not exist "node_modules" (
    echo ⚠️  node_modules가 없습니다. 설치 중...
    call npm install
    if errorlevel 1 (
        echo ❌ 의존성 설치 실패
        pause
        exit /b 1
    )
) else (
    echo ✅ node_modules 확인됨
)
echo.

echo [4/4] 빌드 테스트...
call npm run build
if errorlevel 1 (
    echo.
    echo ❌ 로컬 빌드 실패!
    echo.
    echo Vercel에서도 동일한 오류가 발생할 것입니다.
    echo 오류를 수정한 후 다시 시도하세요.
    echo.
    pause
    exit /b 1
) else (
    echo.
    echo ✅ 로컬 빌드 성공!
    echo.
    echo Vercel에서도 성공할 가능성이 높습니다.
    echo 변경사항을 커밋하고 푸시하세요.
    echo.
)
echo.

echo ========================================
echo 테스트 완료!
echo ========================================
echo.
pause

