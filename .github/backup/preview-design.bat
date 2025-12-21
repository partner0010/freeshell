@echo off
chcp 65001 >nul
echo ========================================
echo Freeshell 디자인 프리뷰 서버
echo ========================================
echo.
echo 실제 서버에 배포하기 전에 디자인을 미리 확인할 수 있습니다.
echo 로컬 개발 서버가 시작되면 브라우저가 자동으로 열립니다.
echo.

REM 스크립트 위치로 이동
cd /d "%~dp0"
cd ..

echo [1/4] 의존성 확인...
if not exist "node_modules" (
    echo node_modules 폴더가 없습니다. 패키지를 설치합니다...
    call npm install
    if errorlevel 1 (
        echo 오류: 패키지 설치 실패
        pause
        exit /b 1
    )
    echo 패키지 설치 완료!
) else (
    echo 패키지가 이미 설치되어 있습니다.
)
echo.

echo [2/4] 환경 변수 확인...
if not exist ".env.local" (
    echo 경고: .env.local 파일이 없습니다.
    echo 기본 환경 변수로 실행됩니다.
    echo.
    echo 참고: 회원가입/로그인 기능을 사용하려면 .env.local 파일이 필요합니다.
    echo.
) else (
    echo .env.local 파일을 찾았습니다.
)
echo.

echo [3/4] 빌드 확인...
echo 최신 변경사항을 반영하기 위해 빌드를 확인합니다...
call npm run build >nul 2>&1
if errorlevel 1 (
    echo 경고: 빌드 오류가 있을 수 있습니다. 개발 모드로 계속 진행합니다.
) else (
    echo 빌드 확인 완료!
)
echo.

echo [4/4] 개발 서버 시작...
echo.
echo ========================================
echo 서버가 시작되었습니다!
echo.
echo 브라우저에서 다음 주소로 접속하세요:
echo   http://localhost:3000
echo.
echo 주요 페이지:
echo   - 메인: http://localhost:3000
echo   - 에디터: http://localhost:3000/editor
echo   - 회원가입: http://localhost:3000/auth/signup
echo   - 로그인: http://localhost:3000/auth/signin
echo   - AI 검색: http://localhost:3000/genspark
echo   - 최신 트렌드: http://localhost:3000/trends
echo.
echo 서버를 중지하려면 Ctrl+C를 누르세요.
echo ========================================
echo.

REM 3초 후 브라우저 자동 열기
timeout /t 3 /nobreak >nul
start http://localhost:3000

REM 개발 서버 시작
call npm run dev

pause

