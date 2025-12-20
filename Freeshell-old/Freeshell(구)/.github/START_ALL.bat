@echo off
echo ========================================
echo    Freeshell 전체 서버 시작
echo ========================================
echo.

REM 기존 Node 프로세스 종료
echo [1/4] 기존 서버 종료 중...
taskkill /F /IM node.exe /T >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/4] 백엔드 시작 중...
cd /d "%~dp0backend"
start "Freeshell Backend" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

echo [3/4] 프론트엔드 시작 중...
cd /d "%~dp0"
start "Freeshell Frontend" cmd /k "npm run dev"

echo [4/4] 서버 시작 완료!
echo.
echo ========================================
echo    서버가 시작되었습니다!
echo ========================================
echo.
echo 백엔드: http://localhost:3001
echo 프론트엔드: http://localhost:3000
echo.
echo 관리자 로그인:
echo - 아이디: admin
echo - 비밀번호: Admin123!@#
echo - OTP: 생략 가능
echo.
echo 브라우저가 자동으로 열립니다...
timeout /t 5 /nobreak >nul

REM 브라우저 자동 실행
start http://localhost:3000

echo.
echo 서버를 종료하려면 각 창을 닫으세요
pause

