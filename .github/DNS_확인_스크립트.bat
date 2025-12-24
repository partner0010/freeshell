@echo off
chcp 65001 >nul
echo ========================================
echo DNS 배포 상태 확인 스크립트
echo ========================================
echo.

REM 도메인 입력 받기
set /p DOMAIN="확인할 도메인을 입력하세요 (예: yourdomain.com): "

if "%DOMAIN%"=="" (
    echo 도메인을 입력하지 않았습니다.
    pause
    exit /b
)

echo.
echo ========================================
echo DNS 레코드 확인 중...
echo ========================================
echo.

echo [1] A 레코드 확인:
nslookup -type=A %DOMAIN%
echo.

echo [2] CNAME 레코드 확인:
nslookup -type=CNAME %DOMAIN%
echo.

echo [3] NS 레코드 확인 (네임서버):
nslookup -type=NS %DOMAIN%
echo.

echo [4] MX 레코드 확인 (메일 서버):
nslookup -type=MX %DOMAIN%
echo.

echo ========================================
echo PowerShell로 상세 확인:
echo ========================================
echo.

powershell -Command "Resolve-DnsName %DOMAIN% -Type A | Format-Table -AutoSize"
echo.

echo ========================================
echo 온라인 도구로 확인:
echo ========================================
echo.
echo 1. DNS Checker: https://dnschecker.org/#A/%DOMAIN%
echo 2. What's My DNS: https://www.whatsmydns.net/#A/%DOMAIN%
echo 3. MXToolbox: https://mxtoolbox.com/SuperTool.aspx?action=a%3a%DOMAIN%
echo.

echo 브라우저에서 위 링크를 열어 전 세계 DNS 전파 상태를 확인하세요.
echo.

pause

