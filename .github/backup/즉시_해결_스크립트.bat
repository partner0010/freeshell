@echo off
chcp 65001 >nul
echo ========================================
echo 즉시 해결 스크립트
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo [1/3] package.json에 vercel-build 스크립트 추가...
findstr /C:"vercel-build" package.json >nul
if %errorlevel% equ 0 (
    echo ✅ vercel-build 스크립트가 이미 존재합니다
) else (
    echo ⚠️  vercel-build 스크립트를 추가합니다...
    powershell -Command "$content = Get-Content 'package.json' -Raw; $content = $content -replace '\"lint\": \"next lint\"', '\"lint\": \"next lint\",\n    \"vercel-build\": \"npx prisma generate && next build\"'; Set-Content 'package.json' -Value $content -NoNewline"
    echo ✅ vercel-build 스크립트를 추가했습니다
)
echo.

echo [2/3] vercel.json에 installCommand 추가...
findstr /C:"installCommand" vercel.json >nul
if %errorlevel% equ 0 (
    echo ✅ installCommand가 이미 존재합니다
) else (
    echo ⚠️  installCommand를 추가합니다...
    powershell -Command "$content = Get-Content 'vercel.json' -Raw; $content = $content -replace '\"buildCommand\": \"npx prisma generate && npx next build\"', '\"buildCommand\": \"npx prisma generate && npx next build\",\n  \"installCommand\": \"npm install && npx prisma generate\"'; Set-Content 'vercel.json' -Value $content -NoNewline"
    echo ✅ installCommand를 추가했습니다
)
echo.

echo [3/3] 수정된 파일 확인...
echo.
echo package.json의 scripts 섹션:
findstr /C:"\"build\"" package.json
findstr /C:"\"vercel-build\"" package.json
echo.
echo vercel.json:
type vercel.json
echo.

echo ========================================
echo 완료!
echo ========================================
echo.
echo 다음 단계:
echo 1. Git에 커밋 및 푸시
echo 2. Vercel에서 자동 재배포 대기
echo.
echo 명령어:
echo   git add package.json vercel.json
echo   git commit -m "fix: add vercel-build script and installCommand"
echo   git push origin main
echo.
pause

