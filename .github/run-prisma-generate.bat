@echo off
chcp 65001 >nul
echo ========================================
echo Prisma Client 생성
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo [1/2] Prisma schema 확인...
if not exist "prisma\schema.prisma" (
    echo ❌ prisma\schema.prisma 파일을 찾을 수 없습니다!
    echo.
    echo 확인 사항:
    echo 1. prisma 폴더가 프로젝트 루트에 있는지 확인
    echo 2. schema.prisma 파일이 prisma 폴더에 있는지 확인
    echo.
    pause
    exit /b 1
)
echo ✅ Prisma schema 확인됨
echo.

echo [2/2] Prisma Client 생성 중...
echo ⚠️  이 작업은 몇 분 걸릴 수 있습니다...
echo.
call npx prisma generate
if errorlevel 1 (
    echo.
    echo ❌ Prisma Client 생성 실패
    echo.
    echo 확인 사항:
    echo 1. Prisma가 설치되어 있는지: npm list prisma
    echo 2. DATABASE_URL 환경 변수가 설정되어 있는지 (선택사항)
    echo 3. schema.prisma 파일이 올바른지 확인
    echo.
    pause
    exit /b 1
)
echo.
echo ========================================
echo ✅ Prisma Client 생성 완료!
echo ========================================
echo.
echo 이제 빌드를 실행할 수 있습니다:
echo   npm run build
echo.
pause

