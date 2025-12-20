@echo off
chcp 65001 >nul
echo ========================================
echo DNS 설정 복구 가이드
echo ========================================
echo.

echo 현재 DNS 설정 확인 중...
echo.

echo [1] 도메인 입력
set /p DOMAIN="도메인을 입력하세요 (예: example.com): "

if "%DOMAIN%"=="" (
    echo 도메인이 입력되지 않았습니다.
    pause
    exit /b 1
)

echo.
echo [2] 현재 DNS 설정 확인...
echo.
echo 도메인: %DOMAIN%
echo.

nslookup %DOMAIN%
echo.

echo [3] www 서브도메인 확인...
nslookup www.%DOMAIN%
echo.

echo ========================================
echo 다음 단계:
echo ========================================
echo.
echo 1. Gabia 홈페이지 로그인
echo    https://www.gabia.com
echo.
echo 2. 도메인 관리 → 네임서버 설정
echo    "Gabia 네임서버 사용" 선택
echo.
echo 3. DNS 관리 → 모든 레코드 확인/삭제
echo.
echo 4. Vercel 대시보드에서 도메인 추가
echo    https://vercel.com/dashboard
echo.
echo 5. Vercel이 제공하는 DNS 설정을
echo    Gabia DNS 관리에 추가
echo.
echo ========================================
echo.
echo DNS 전파 확인:
echo https://dnschecker.org
echo.
pause

