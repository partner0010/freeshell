@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ========================================
REM 배치 파일 실행 로그 확인
REM ========================================

REM 배치 파일이 있는 디렉토리의 절대 경로 가져오기
set "BATCH_DIR=%~dp0"
set "BATCH_DIR=!BATCH_DIR:~0,-1!"

REM 로그 파일 경로 (프로젝트 루트)
set "LOG_FILE=!BATCH_DIR!\..\deploy.log"

if not exist "!LOG_FILE!" (
    echo [ERROR] 로그 파일을 찾을 수 없습니다: !LOG_FILE!
    echo 배치 파일을 먼저 실행하세요.
    pause
    exit /b 1
)

:menu
cls
echo ========================================
echo 배치 파일 실행 로그 확인
echo ========================================
echo.
echo 로그 파일: !LOG_FILE!
echo.
echo ========================================
echo 1. 마지막 50줄 보기
echo 2. 마지막 100줄 보기
echo 3. 전체 로그 보기 (메모장)
echo 4. 실시간 모니터링 (새 로그만)
echo 5. 종료
echo ========================================
echo.
set /p "CHOICE=선택 (1-5): "

if "!CHOICE!"=="1" (
    cls
    echo 마지막 50줄:
    echo ========================================
    powershell -Command "Get-Content '!LOG_FILE!' -Tail 50 -Encoding UTF8"
    echo.
    echo ========================================
    pause
    goto menu
)

if "!CHOICE!"=="2" (
    cls
    echo 마지막 100줄:
    echo ========================================
    powershell -Command "Get-Content '!LOG_FILE!' -Tail 100 -Encoding UTF8"
    echo.
    echo ========================================
    pause
    goto menu
)

if "!CHOICE!"=="3" (
    start notepad "!LOG_FILE!"
    goto menu
)

if "!CHOICE!"=="4" (
    cls
    echo 실시간 모니터링 모드 (새 로그만 표시)
    echo Ctrl+C로 종료
    echo ========================================
    echo.
    powershell -Command "Get-Content '!LOG_FILE!' -Wait -Tail 10 -Encoding UTF8"
    pause
    goto menu
)

if "!CHOICE!"=="5" (
    exit /b 0
)

goto menu

