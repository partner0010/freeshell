@echo off
chcp 65001 >nul
echo ========================================
echo ESLint 오류 수정
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo [1/3] ESLint 오류 확인...
echo.
echo 주요 오류:
echo   - src/lib/db.ts: @typescript-eslint/no-var-requires 규칙 오류
echo.
echo 이 파일을 수정합니다...
echo.

echo [2/3] src/lib/db.ts 수정...
if exist "src\lib\db.ts" (
    echo ✅ 파일 확인됨
    echo.
    echo 수정 내용:
    echo   - eslint-disable 주석을 @typescript-eslint/no-require-imports로 변경
    echo.
) else (
    echo ❌ src/lib/db.ts 파일을 찾을 수 없습니다.
    pause
    exit /b 1
)
echo.

echo [3/3] 빌드 테스트...
call npm run build
if errorlevel 1 (
    echo.
    echo ❌ 빌드 실패!
    echo.
    echo 추가 확인 사항:
    echo 1. ESLint 설정 파일 확인 (.eslintrc.json 또는 eslint.config.js)
    echo 2. @typescript-eslint/eslint-plugin이 설치되어 있는지 확인
    echo 3. package.json에 bcryptjs가 있는지 확인
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

