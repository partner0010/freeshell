@echo off
chcp 65001 >nul
echo ========================================
echo 빌드 오류 수정
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo [1/5] package.json 확인...
if not exist "package.json" (
    echo ❌ 오류: package.json 파일을 찾을 수 없습니다.
    echo 프로젝트 루트 디렉토리에서 실행하세요.
    pause
    exit /b 1
)
echo ✅ package.json 확인됨
echo.

echo [2/5] 필수 의존성 확인 및 설치...
set INSTALL_NEEDED=0

findstr /C:"bcryptjs" "package.json" >nul
if errorlevel 1 (
    echo ❌ bcryptjs가 package.json에 없습니다.
    set INSTALL_NEEDED=1
) else (
    echo ✅ bcryptjs가 package.json에 있습니다.
    if not exist "node_modules\bcryptjs" (
        echo   하지만 node_modules에 없습니다.
        set INSTALL_NEEDED=1
    )
)

findstr /C:"next-auth" "package.json" >nul
if errorlevel 1 (
    echo ❌ next-auth가 package.json에 없습니다.
    set INSTALL_NEEDED=1
) else (
    echo ✅ next-auth가 package.json에 있습니다.
    if not exist "node_modules\next-auth" (
        echo   하지만 node_modules에 없습니다.
        set INSTALL_NEEDED=1
    )
)

if %INSTALL_NEEDED%==1 (
    echo.
    echo 필수 의존성을 설치합니다...
    call npm install next-auth@4 bcryptjs @types/bcryptjs
    if errorlevel 1 (
        echo 오류: 의존성 설치 실패
        echo.
        echo 수동으로 설치하세요:
        echo   npm install next-auth@4 bcryptjs @types/bcryptjs
        pause
        exit /b 1
    )
    echo ✅ 필수 의존성 설치 완료
) else (
    echo ✅ 모든 필수 의존성이 설치되어 있습니다.
)
echo.

echo [3/5] next.config.js 확인...
if exist "next.config.js" (
    echo next.config.js 파일 확인 중...
    findstr /C:"experimental.serverActions" "next.config.js" >nul
    if not errorlevel 1 (
        echo 경고: experimental.serverActions 옵션이 있습니다.
        echo 이 옵션은 제거해야 합니다.
        echo.
        echo next.config.js를 열어서 다음 줄을 제거하세요:
        echo   experimental.serverActions: true,
    ) else (
        echo ✅ next.config.js 확인 완료
    )
) else (
    echo 경고: next.config.js 파일을 찾을 수 없습니다.
)
echo.

echo [4/5] 의존성 재설치...
call npm install
if errorlevel 1 (
    echo 오류: 의존성 설치 실패
    pause
    exit /b 1
)
echo ✅ 의존성 설치 완료
echo.

echo [5/5] 빌드 테스트...
call npm run build
if errorlevel 1 (
    echo.
    echo ❌ 빌드 실패!
    echo.
    echo 추가 확인 사항:
    echo 1. package.json에 next-auth와 bcryptjs가 있는지 확인
    echo 2. next.config.js에서 experimental.serverActions 제거
    echo 3. 모든 의존성이 설치되었는지 확인
    echo.
    pause
    exit /b 1
) else (
    echo.
    echo ✅ 빌드 성공!
    echo.
    echo 이제 배포할 수 있습니다.
    echo.
)
echo.

echo ========================================
echo 수정 완료!
echo ========================================
echo.
pause

