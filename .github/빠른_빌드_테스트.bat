@echo off
chcp 65001 >nul
cls
echo ========================================
echo Freeshell 빠른 빌드 테스트
echo ========================================
echo.

REM 프로젝트 루트로 이동
if exist "..\package.json" (
    cd ..
    echo 프로젝트 루트로 이동: %CD%
    echo.
) else if exist "..\..\package.json" (
    cd ..\..
    echo 프로젝트 루트로 이동: %CD%
    echo.
)

REM 프로젝트 루트 확인
if not exist "package.json" (
    echo [오류] package.json 파일을 찾을 수 없습니다.
    echo 현재 위치: %CD%
    pause
    exit /b 1
)

echo [1/4] 실행 중인 Node.js 프로세스 확인...
tasklist | findstr /i "node.exe" >nul
if not errorlevel 1 (
    echo [경고] Node.js 프로세스가 실행 중입니다.
    echo 종료하시겠습니까? (Y/N)
    set /p kill_node=
    if /i "!kill_node!"=="Y" (
        echo Node.js 프로세스 종료 중...
        taskkill /F /IM node.exe >nul 2>&1
        timeout /t 2 /nobreak >nul
    )
)
echo.

echo [2/4] .next 폴더 정리...
if exist ".next" (
    echo .next 폴더 삭제 중...
    rmdir /s /q .next 2>nul
    echo .next 폴더 삭제 완료!
) else (
    echo .next 폴더가 없습니다.
)
echo.

echo [3/4] Prisma 클라이언트 생성...
call npx prisma generate
if errorlevel 1 (
    echo [오류] Prisma 생성 실패!
    pause
    exit /b 1
)
echo Prisma 생성 완료!
echo.

echo [4/4] Next.js 빌드 시작...
echo.
echo 빌드가 시작됩니다. 시간이 걸릴 수 있습니다...
echo.

REM 메모리 제한 증가
set NODE_OPTIONS=--max-old-space-size=4096

call npm run build
if errorlevel 1 (
    echo.
    echo [오류] 빌드 실패!
    echo.
    echo 문제 해결:
    echo 1. node_modules 재설치: rmdir /s /q node_modules ^&^& npm install
    echo 2. .next 폴더 삭제 후 재시도
    echo 3. TypeScript 오류 확인: npx tsc --noEmit
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo [성공] 빌드 완료!
echo ========================================
echo.
pause

