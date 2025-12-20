@echo off
chcp 65001 >nul
echo ========================================
echo ESLint 오류 최종 수정
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo [1/3] src/lib/db.ts 수정 확인...
if exist "src\lib\db.ts" (
    echo ✅ 파일 확인됨
    echo   - ESLint 주석을 간단한 형태로 변경
) else (
    echo ❌ src/lib/db.ts 파일을 찾을 수 없습니다.
    pause
    exit /b 1
)
echo.

echo [2/3] ESLint 설정 확인...
if exist ".eslintrc.json" (
    echo ✅ .eslintrc.json 확인됨
) else if exist ".github\.eslintrc.json" (
    echo ✅ .github/.eslintrc.json 확인됨
    echo   - 프로젝트 루트로 복사 필요할 수 있음
) else (
    echo ⚠️  ESLint 설정 파일을 찾을 수 없습니다.
    echo   - 프로젝트 루트에 .eslintrc.json 생성 필요
)
echo.

echo [3/3] 빌드 테스트...
call npm run build
if errorlevel 1 (
    echo.
    echo ❌ 빌드 실패!
    echo.
    echo 해결 방법:
    echo 1. src/lib/db.ts 파일의 ESLint 주석을 확인
    echo 2. 프로젝트 루트에 .eslintrc.json 파일이 있는지 확인
    echo 3. package.json에 bcryptjs가 있는지 확인
    echo.
    echo 또는 ESLint를 완전히 비활성화:
    echo   next.config.js에 다음 추가:
    echo   eslint: { ignoreDuringBuilds: true }
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

