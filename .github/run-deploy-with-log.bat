@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ========================================
REM 배치 파일 실행 + 로그 확인
REM ========================================

set "BATCH_DIR=%~dp0"
set "LOG_FILE=%BATCH_DIR%..\deploy.log"

echo ========================================
echo 배치 파일 실행 (로그 기록)
echo ========================================
echo.
echo 배치 파일: %BATCH_DIR%deploy.bat
echo 로그 파일: !LOG_FILE!
echo.
echo 실행 중 새 창에서 로그를 확인할 수 있습니다:
echo   .github\view-log.bat
echo.
echo 계속하려면 아무 키나 누르세요...
pause >nul

REM 배치 파일 실행 (출력을 로그 파일과 화면에 동시에 기록)
powershell -Command "& { $process = Start-Process -FilePath 'cmd.exe' -ArgumentList '/c', 'chcp 65001 >nul && cd /d \"%BATCH_DIR%..\" && .github\deploy.bat' -NoNewWindow -PassThru; $process.WaitForExit(); exit $process.ExitCode }" 2>&1 | Tee-Object -FilePath "!LOG_FILE!" -Append

echo.
echo ========================================
echo 배치 파일 실행 완료
echo ========================================
echo.
echo 로그 파일: !LOG_FILE!
echo.
pause

