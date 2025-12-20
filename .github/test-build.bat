@echo off
chcp 65001 >nul
echo ========================================
echo 빌드 테스트 및 상태 확인
echo ========================================
echo.

cd /d "%~dp0"

echo [1] 프로젝트 구조 확인...
if exist src\components\layout\GlobalHeader.tsx (
    echo ✅ GlobalHeader.tsx 존재
) else (
    echo ❌ GlobalHeader.tsx 없음
)

if exist src\lib\ai\agents.ts (
    echo ✅ agents.ts 존재
) else (
    echo ❌ agents.ts 없음
)

if exist tsconfig.json (
    echo ✅ tsconfig.json 존재
) else (
    echo ❌ tsconfig.json 없음
)
echo.

echo [2] 의존성 확인...
if exist node_modules (
    echo ✅ node_modules 존재
) else (
    echo ❌ node_modules 없음 - npm install 필요
    pause
    exit /b 1
)
echo.

echo [3] 빌드 테스트...
call npm run build
if errorlevel 1 (
    echo.
    echo ❌ 빌드 실패!
    echo.
    echo 오류를 확인하고 수정하세요.
    pause
    exit /b 1
) else (
    echo.
    echo ✅ 빌드 성공!
    echo.
    echo 배포 준비가 완료되었습니다.
    echo deploy.bat를 실행하여 서버에 배포하세요.
)
echo.
pause

