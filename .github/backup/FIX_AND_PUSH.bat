@echo off
chcp 65001 >nul
echo ========================================
echo 파일 확인 및 Git 푸시 스크립트
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo [1/4] 파일 확인...
if exist "vercel.json" (
    echo ✅ vercel.json 파일이 존재합니다
) else (
    echo ❌ vercel.json 파일이 없습니다. 생성 중...
    (
        echo {
        echo   "buildCommand": "npx prisma generate && npx next build"
        echo }
    ) > vercel.json
    echo ✅ vercel.json 파일 생성 완료
)

if exist "prisma\schema.prisma" (
    echo ✅ prisma\schema.prisma 파일이 존재합니다
) else (
    echo ❌ prisma\schema.prisma 파일이 없습니다.
    if not exist "prisma" mkdir prisma
    if exist ".github\prisma\schema.prisma" (
        copy ".github\prisma\schema.prisma" "prisma\schema.prisma" /Y
        echo ✅ prisma\schema.prisma 파일 생성 완료
    ) else (
        echo ⚠️  .github\prisma\schema.prisma 파일도 없습니다.
    )
)
echo.

echo [2/4] Git 상태 확인...
git status --short vercel.json prisma/schema.prisma 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  Git 저장소가 초기화되지 않았거나 파일이 없습니다.
    echo.
    pause
    exit /b 1
)
echo.

echo [3/4] Git에 추가...
git add vercel.json prisma/schema.prisma
if %errorlevel% neq 0 (
    echo ⚠️  Git add 실패
    pause
    exit /b 1
)
echo ✅ Git에 추가 완료
echo.

echo [4/4] Git에 커밋 및 푸시...
git commit -m "fix: add vercel.json and prisma schema for Vercel build"
if %errorlevel% neq 0 (
    echo ⚠️  Git commit 실패 (변경사항이 없을 수 있음)
) else (
    echo ✅ Git commit 완료
)

git push origin main
if %errorlevel% neq 0 (
    echo ⚠️  Git push 실패
    echo    수동으로 푸시하세요: git push origin main
) else (
    echo ✅ Git push 완료
)
echo.

echo ========================================
echo 완료!
echo ========================================
echo.
echo 이제 Vercel에서:
echo 1. 프로젝트 재연결 (필요한 경우)
echo 2. 재배포
echo.
pause

