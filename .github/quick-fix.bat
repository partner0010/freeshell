@echo off
chcp 65001 >nul
echo ========================================
echo 빠른 빌드 오류 해결
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] .next 폴더 삭제...
if exist .next (
    rmdir /s /q .next
    echo .next 폴더 삭제 완료
) else (
    echo .next 폴더가 없습니다
)
echo.

echo [2/4] TypeScript 캐시 확인...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo 캐시 삭제 완료
)
echo.

echo [3/4] 빌드 테스트...
call npm run build
if errorlevel 1 (
    echo.
    echo ❌ 빌드 실패!
    echo 빌드 로그를 확인하세요.
    pause
    exit /b 1
) else (
    echo.
    echo ✅ 빌드 성공!
)
echo.

echo [4/4] 개발 서버 시작 (선택사항)...
echo.
echo 개발 서버를 시작하시겠습니까? (Y/N)
set /p START_DEV="> "
if /i "%START_DEV%"=="Y" (
    echo.
    echo 개발 서버 시작 중...
    call npm run dev
) else (
    echo.
    echo 개발 서버를 시작하지 않습니다.
    echo 수동으로 시작: npm run dev
)
echo.
pause

