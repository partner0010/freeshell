@echo off
chcp 65001 >nul
cls
echo ========================================
echo Freeshell 빠른 미리보기
echo ========================================
echo.

REM .github 폴더에서 실행 중이면 프로젝트 루트로 이동
if exist "..\package.json" (
    cd ..
    echo 프로젝트 루트로 이동: %CD%
    echo.
) else if exist "..\..\package.json" (
    cd ..\..
    echo 프로젝트 루트로 이동: %CD%
    echo.
)

REM 현재 디렉토리가 프로젝트 루트인지 확인
if not exist "package.json" (
    echo [오류] package.json 파일을 찾을 수 없습니다.
    echo 현재 위치: %CD%
    echo 프로젝트 루트 폴더에서 실행해주세요.
    pause
    exit /b 1
)

REM 포트 확인 및 종료
netstat -ano | findstr :3000 >nul 2>&1
if not errorlevel 1 (
    echo 포트 3000을 사용하는 프로세스를 종료합니다...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
        taskkill /F /PID %%a >nul 2>&1
    )
    timeout /t 1 /nobreak >nul
)

echo 서버를 빠르게 시작합니다...
echo.

REM 개발 서버를 별도 창에서 시작
start "Freeshell Dev Server" cmd /k "npm run dev"

echo 서버 시작 대기 중 (최대 30초)...
set /a wait_count=0

:wait_loop
timeout /t 1 /nobreak >nul
netstat -ano | findstr :3000 >nul 2>&1
if errorlevel 1 (
    set /a wait_count+=1
    if %wait_count% geq 30 (
        echo.
        echo [경고] 서버 시작이 지연되고 있습니다.
        echo 수동으로 http://localhost:3000 에 접속해보세요.
        goto end
    )
    goto wait_loop
)

echo.
echo [성공] 서버가 시작되었습니다!
timeout /t 2 /nobreak >nul
start http://localhost:3000

:end
echo.
echo 서버 창에서 로그를 확인할 수 있습니다.
echo 이 창을 닫아도 서버는 계속 실행됩니다.
pause

