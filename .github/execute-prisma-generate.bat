@echo off
chcp 65001 >nul
echo ========================================
echo Prisma Client 생성 (프로젝트 루트에서 실행)
echo ========================================
echo.

REM 현재 스크립트 위치에서 프로젝트 루트로 이동
cd /d "%~dp0"
cd ..

echo 현재 디렉토리: %CD%
echo.

echo [1/3] Prisma schema 확인...
if exist "prisma\schema.prisma" (
    echo ✅ prisma\schema.prisma 확인됨
) else if exist ".github\prisma\schema.prisma" (
    echo ⚠️  schema가 .github\prisma\ 폴더에 있습니다.
    echo    prisma 폴더를 생성하고 복사합니다...
    if not exist "prisma" mkdir prisma
    copy /Y ".github\prisma\schema.prisma" "prisma\schema.prisma" >nul
    if errorlevel 1 (
        echo ❌ schema 파일 복사 실패
        echo    수동으로 복사하세요:
        echo      copy ".github\prisma\schema.prisma" "prisma\schema.prisma"
        pause
        exit /b 1
    )
    echo ✅ schema 파일 복사 완료
) else (
    echo ❌ Prisma schema 파일을 찾을 수 없습니다!
    echo.
    echo 확인 사항:
    echo 1. prisma\schema.prisma 파일이 있는지 확인
    echo 2. .github\prisma\schema.prisma 파일이 있는지 확인
    echo.
    pause
    exit /b 1
)
echo.

echo [2/3] Prisma Client 생성 중...
echo ⚠️  이 작업은 몇 분 걸릴 수 있습니다...
echo.
call npx prisma generate
if errorlevel 1 (
    echo.
    echo ❌ Prisma Client 생성 실패
    echo.
    echo 확인 사항:
    echo 1. Prisma가 설치되어 있는지: npm list prisma
    echo 2. 설치되어 있지 않으면: npm install prisma @prisma/client
    echo 3. schema.prisma 파일이 올바른지 확인
    echo.
    pause
    exit /b 1
)
echo.
echo ✅ Prisma Client 생성 완료!
echo.

echo [3/3] 빌드 테스트...
echo.
call npm run build
if errorlevel 1 (
    echo.
    echo ❌ 빌드 실패
    echo    위의 오류 메시지를 확인하세요.
    echo.
    pause
    exit /b 1
) else (
    echo.
    echo ========================================
    echo ✅ 빌드 성공!
    echo ========================================
    echo.
)
echo.

pause

