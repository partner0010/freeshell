@echo off
chcp 65001 >nul
echo ========================================
echo Prisma Schema 설정 및 Client 생성
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo [1/3] Prisma schema 확인...
if exist ".github\prisma\schema.prisma" (
    echo ✅ .github\prisma\schema.prisma 확인됨
) else (
    echo ❌ Prisma schema 파일을 찾을 수 없습니다!
    pause
    exit /b 1
)
echo.

echo [2/3] prisma 폴더 생성 및 schema 복사...
if not exist "prisma" (
    mkdir prisma
    echo ✅ prisma 폴더 생성됨
) else (
    echo ✅ prisma 폴더 이미 존재
)

copy /Y ".github\prisma\schema.prisma" "prisma\schema.prisma" >nul
if errorlevel 1 (
    echo ❌ schema 파일 복사 실패
    pause
    exit /b 1
)
echo ✅ schema 파일 복사 완료
echo.

echo [3/3] Prisma Client 생성...
call npx prisma generate
if errorlevel 1 (
    echo ❌ Prisma Client 생성 실패
    echo.
    echo 확인 사항:
    echo 1. Prisma가 설치되어 있는지 확인: npm list prisma
    echo 2. DATABASE_URL 환경 변수가 설정되어 있는지 확인
    echo.
    pause
    exit /b 1
)
echo ✅ Prisma Client 생성 완료
echo.

echo ========================================
echo 완료!
echo ========================================
echo.
echo 이제 빌드를 실행할 수 있습니다:
echo   npm run build
echo.
pause

