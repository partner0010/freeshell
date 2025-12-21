@echo off
chcp 65001 >nul
echo ========================================
echo Freeshell 로컬 프리뷰 서버
echo ========================================
echo.
echo 실제 서버에 배포하기 전에 디자인을 미리 확인할 수 있습니다.
echo.

REM 스크립트 위치로 이동
cd /d "%~dp0"
cd ..

echo [1/3] 의존성 확인...
if not exist "node_modules" (
    echo node_modules 폴더가 없습니다. 패키지를 설치합니다...
    call npm install
    if errorlevel 1 (
        echo 오류: 패키지 설치 실패
        pause
        exit /b 1
    )
) else (
    echo 패키지가 이미 설치되어 있습니다.
)
echo.

echo [2/3] 환경 변수 확인...
if not exist ".env.local" (
    echo 경고: .env.local 파일이 없습니다.
    echo 기본 환경 변수로 실행됩니다.
    echo.
) else (
    echo .env.local 파일을 찾았습니다.
)
echo.

echo [3/3] 개발 서버 시작...
echo.
echo ========================================
echo 서버가 시작되었습니다!
echo.
echo 브라우저에서 다음 주소로 접속하세요:
echo   http://localhost:3000
echo.
echo 서버를 중지하려면 Ctrl+C를 누르세요.
echo ========================================
echo.

REM 개발 서버 시작
call npm run dev

pause

