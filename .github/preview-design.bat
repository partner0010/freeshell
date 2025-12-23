@echo off
chcp 65001 >nul
cls
echo ========================================
echo Freeshell 디자인 프리뷰 서버
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
    echo.
    pause
    exit /b 1
)

echo [1/6] 의존성 확인...
if not exist "node_modules" (
    echo node_modules 폴더가 없습니다. 패키지를 설치합니다...
    call npm install
    if errorlevel 1 (
        echo [오류] 패키지 설치 실패
        pause
        exit /b 1
    )
    echo 패키지 설치 완료!
) else (
    echo 패키지가 이미 설치되어 있습니다.
)
echo.

echo [2/6] 환경 변수 확인...
if not exist ".env.local" (
    echo [경고] .env.local 파일이 없습니다.
    echo 기본 환경 변수로 실행됩니다.
    echo.
) else (
    echo .env.local 파일을 찾았습니다.
)
echo.

echo [3/6] 포트 확인...
netstat -ano | findstr :3000 >nul 2>&1
if errorlevel 1 (
    echo 포트 3000이 사용 가능합니다.
) else (
    echo [경고] 포트 3000이 이미 사용 중입니다.
    echo 기존 서버를 종료하시겠습니까? (Y/N)
    set /p kill_process=
    if /i "!kill_process!"=="Y" (
        echo 포트 3000을 사용하는 프로세스를 종료합니다...
        for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
            taskkill /F /PID %%a >nul 2>&1
        )
        timeout /t 2 /nobreak >nul
        echo 프로세스 종료 완료.
    )
)
echo.

echo [4/6] Prisma 클라이언트 생성...
if exist "prisma\schema.prisma" (
    echo Prisma 클라이언트를 생성합니다...
    call npx prisma generate >nul 2>&1
    if errorlevel 1 (
        echo [경고] Prisma 생성 중 오류가 발생했지만 계속 진행합니다.
    ) else (
        echo Prisma 클라이언트 생성 완료!
    )
) else (
    echo Prisma 스키마 파일이 없습니다. 건너뜁니다.
)
echo.

echo [5/6] 개발 서버 시작...
echo.
echo ========================================
echo 서버를 시작하는 중입니다...
echo.
echo 참고: 서버 시작에는 10-30초 정도 걸릴 수 있습니다.
echo       첫 실행 시 더 오래 걸릴 수 있습니다.
echo ========================================
echo.

REM 개발 서버를 별도 창에서 시작
start "Freeshell Dev Server" cmd /k "npm run dev"

REM 서버가 시작될 때까지 대기 (최대 60초)
echo 서버 시작 대기 중...
set /a wait_count=0
set /a max_wait=60

:wait_loop
timeout /t 2 /nobreak >nul
netstat -ano | findstr :3000 >nul 2>&1
if errorlevel 1 (
    set /a wait_count+=2
    if %wait_count% geq %max_wait% (
        echo.
        echo [경고] 서버 시작이 지연되고 있습니다.
        echo 서버 창을 확인하거나 수동으로 http://localhost:3000 에 접속해보세요.
        echo.
        goto open_browser
    )
    echo 서버 시작 대기 중... (%wait_count%초 경과)
    goto wait_loop
)

echo.
echo ========================================
echo [성공] 서버가 정상적으로 시작되었습니다!
echo.
echo 브라우저에서 다음 주소로 접속하세요:
echo   http://localhost:3000
echo.
echo 주요 페이지:
echo   - 메인: http://localhost:3000
echo   - 에디터: http://localhost:3000/editor
echo   - AI 검색: http://localhost:3000/genspark
echo   - 콘텐츠 생성: http://localhost:3000/creator
echo   - AI 에이전트: http://localhost:3000/agents
echo   - 최신 트렌드: http://localhost:3000/trends
echo   - 디버깅: http://localhost:3000/debug
echo   - 사이트 검증: http://localhost:3000/validate
echo   - 원격 솔루션: http://localhost:3000/remote
echo   - 커뮤니티: http://localhost:3000/community
echo   - 템플릿: http://localhost:3000/templates
echo   - 분석: http://localhost:3000/analytics
echo   - 도움말: http://localhost:3000/help
echo   - 관리자: http://localhost:3000/admin
echo   - 마이페이지: http://localhost:3000/mypage
echo   - 회원 혜택: http://localhost:3000/mypage/benefits
echo   - 보안 설정: http://localhost:3000/mypage/security
echo.
echo 서버를 중지하려면 서버 창을 닫거나 Ctrl+C를 누르세요.
echo ========================================
echo.

:open_browser
REM 브라우저 자동 열기
timeout /t 2 /nobreak >nul
start http://localhost:3000

echo.
echo [6/6] 브라우저가 열렸습니다!
echo.
echo 서버 창에서 로그를 확인할 수 있습니다.
echo 이 창을 닫아도 서버는 계속 실행됩니다.
echo.
pause
