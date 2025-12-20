@echo off
chcp 65001 >nul
echo ========================================
echo 외부 접속 문제 진단
echo ========================================
echo.

echo [1] 도메인 입력
set /p DOMAIN="도메인을 입력하세요 (예: example.com): "

if "%DOMAIN%"=="" (
    echo 도메인이 입력되지 않았습니다.
    pause
    exit /b 1
)

echo.
echo [2] DNS 설정 확인...
echo.
echo 도메인: %DOMAIN%
echo.

echo A 레코드 확인:
nslookup %DOMAIN%
echo.

echo www 서브도메인 확인:
nslookup www.%DOMAIN%
echo.

echo [3] Vercel 기본 URL 확인...
echo.
echo Vercel 대시보드에서 확인하세요:
echo https://vercel.com/dashboard
echo.
echo 프로젝트의 기본 URL (예: project-name.vercel.app)로
echo 접속이 되는지 먼저 확인하세요.
echo.

echo [4] 다음 단계:
echo.
echo 1. Vercel 기본 URL 접속 테스트
echo    - 접속되면: DNS 설정 문제
echo    - 안 되면: Vercel 배포 문제
echo.
echo 2. Vercel 대시보드 확인
echo    - 배포 상태: Ready인지 확인
echo    - 빌드 로그: 오류 확인
echo.
echo 3. DNS 설정 확인
echo    - Gabia → 도메인 관리 → DNS 관리
echo    - 레코드 확인
echo.
echo ========================================
pause

