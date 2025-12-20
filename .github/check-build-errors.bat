@echo off
chcp 65001 >nul
echo ========================================
echo 빌드 오류 확인 및 수정
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo [문제] 모든 최근 배포가 Error 상태입니다.
echo [해결] 빌드 오류를 확인하고 수정해야 합니다.
echo.

echo [1/5] package.json 확인...
if not exist "package.json" (
    echo ❌ package.json 파일을 찾을 수 없습니다!
    echo    프로젝트 루트에서 실행하세요.
    pause
    exit /b 1
)
echo ✅ package.json 확인됨
echo.

echo [2/5] 필수 의존성 확인...
set MISSING=0

findstr /C:"\"bcryptjs\"" "package.json" >nul
if errorlevel 1 (
    echo ❌ bcryptjs가 없습니다.
    set MISSING=1
) else (
    echo ✅ bcryptjs 확인됨
)

findstr /C:"\"next-auth\"" "package.json" >nul
if errorlevel 1 (
    echo ❌ next-auth가 없습니다.
    set MISSING=1
) else (
    echo ✅ next-auth 확인됨
)

findstr /C:"\"@prisma/client\"" "package.json" >nul
if errorlevel 1 (
    echo ❌ @prisma/client가 없습니다.
    set MISSING=1
) else (
    echo ✅ @prisma/client 확인됨
)

if %MISSING%==1 (
    echo.
    echo ⚠️  누락된 의존성이 있습니다. 설치합니다...
    call npm install bcryptjs @types/bcryptjs next-auth@4 @prisma/client prisma
    if errorlevel 1 (
        echo ❌ 의존성 설치 실패
        pause
        exit /b 1
    )
    echo ✅ 의존성 설치 완료
    echo.
    echo ⚠️  package.json을 커밋해야 합니다:
    echo    git add package.json package-lock.json
    echo    git commit -m "fix: add missing dependencies"
    echo    git push origin main
) else (
    echo ✅ 모든 필수 의존성 확인됨
)
echo.

echo [3/5] next.config.js 확인...
if exist "next.config.js" (
    findstr /C:"ignoreDuringBuilds" "next.config.js" >nul
    if errorlevel 1 (
        echo ⚠️  ignoreDuringBuilds가 없습니다.
        echo    next.config.js를 수정해야 합니다.
    ) else (
        echo ✅ ignoreDuringBuilds 설정 확인됨
    )
) else (
    echo ❌ next.config.js를 찾을 수 없습니다.
)
echo.

echo [4/5] 의존성 재설치...
call npm install
if errorlevel 1 (
    echo ❌ 의존성 설치 실패
    pause
    exit /b 1
)
echo ✅ 의존성 설치 완료
echo.

echo [5/5] 로컬 빌드 테스트...
echo.
echo ⚠️  빌드 테스트를 시작합니다. 시간이 걸릴 수 있습니다...
echo.
call npm run build
if errorlevel 1 (
    echo.
    echo ========================================
    echo ❌ 빌드 실패!
    echo ========================================
    echo.
    echo 위의 오류 메시지를 확인하세요.
    echo.
    echo 일반적인 해결 방법:
    echo 1. Vercel Build Logs에서 정확한 오류 확인
    echo 2. package.json에 누락된 의존성 추가
    echo 3. TypeScript 오류 수정
    echo 4. next.config.js 설정 확인
    echo.
    echo 자세한 내용:
    echo   .github\BUILD_ERRORS.md
    echo.
    echo Vercel Build Logs 확인:
    echo   1. https://vercel.com/dashboard
    echo   2. Freeshell 프로젝트 → Deployments
    echo   3. 최신 Error 배포 클릭 → Build Logs
    echo.
    pause
    exit /b 1
) else (
    echo.
    echo ========================================
    echo ✅ 빌드 성공!
    echo ========================================
    echo.
    echo 이제 배포할 수 있습니다.
    echo.
    set /p DEPLOY="지금 배포하시겠습니까? (Y/N): "
    if /i "%DEPLOY%"=="Y" (
        echo.
        echo 변경사항 커밋 및 푸시...
        git add .
        git commit -m "fix: resolve build errors"
        git push origin main
        if errorlevel 1 (
            echo ⚠️  Git 푸시 실패
            echo    수동으로 푸시하거나 Vercel에서 수동 재배포하세요.
        ) else (
            echo ✅ 푸시 완료! Vercel에서 자동 배포가 시작됩니다.
        )
    )
)
echo.

pause

