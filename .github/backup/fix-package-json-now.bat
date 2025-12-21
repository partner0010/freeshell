@echo off
chcp 65001 >nul
echo ========================================
echo package.json 즉시 수정 스크립트
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] .github/package.json 수정...
findstr /C:"\"build\"" package.json | findstr /C:"prisma generate" >nul
if %errorlevel% equ 0 (
    echo ✅ build 스크립트가 이미 올바르게 설정되어 있습니다
) else (
    echo ⚠️  build 스크립트를 수정합니다...
    powershell -Command "(Get-Content package.json) -replace '\"build\": \"next build\",', '\"build\": \"npx prisma generate && next build\",' | Set-Content package.json"
    echo ✅ package.json을 수정했습니다
)
echo.

echo [2/3] 수정된 build 스크립트 확인...
findstr /C:"\"build\"" package.json
echo.

echo [3/3] 프로젝트 루트로 복사...
cd ..
if not exist "package.json" (
    copy ".github\package.json" "package.json" >nul
    echo ✅ 프로젝트 루트에 package.json을 생성했습니다
) else (
    copy ".github\package.json" "package.json" /Y >nul
    echo ✅ 프로젝트 루트의 package.json을 업데이트했습니다
)
echo.

echo ========================================
echo 완료!
echo ========================================
echo.
echo 다음 단계:
echo 1. Git에 커밋 및 푸시
echo 2. Vercel에서 재배포
echo.
pause

