@echo off
chcp 65001 >nul
echo ========================================
echo bcryptjs 빠른 설치
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo [1/2] bcryptjs 설치 중...
call npm install bcryptjs @types/bcryptjs
if errorlevel 1 (
    echo 오류: bcryptjs 설치 실패
    pause
    exit /b 1
)
echo ✅ 설치 완료
echo.

echo [2/2] 빌드 테스트...
call npm run build
if errorlevel 1 (
    echo.
    echo ❌ 빌드 실패!
    echo.
    echo package.json에 bcryptjs가 추가되었는지 확인하세요.
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
echo 완료!
echo ========================================
echo.
pause

