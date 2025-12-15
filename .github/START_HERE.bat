@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   Freeshell 자동 설정 시작
echo ========================================
echo.

REM .env 파일 생성
if not exist .env (
    echo [1/3] .env 파일 생성 중...
    copy .env.example .env >nul 2>&1
    if exist .env (
        echo ✅ .env 파일 생성 완료
    ) else (
        echo ⚠️  .env.example 파일이 없습니다. 수동으로 .env 파일을 만들어주세요.
    )
) else (
    echo ℹ️  .env 파일이 이미 존재합니다.
)

echo.
echo [2/3] 필요한 웹사이트 열기...
echo.

REM Google Cloud Console
start https://console.cloud.google.com
timeout /t 2 >nul

REM GitHub
start https://github.com
timeout /t 2 >nul

REM Vercel
start https://vercel.com
timeout /t 2 >nul

echo ✅ 브라우저가 열렸습니다!
echo.

echo [3/3] 다음 단계:
echo.
echo 1. Google Cloud Console에서 OAuth 설정
echo 2. GitHub에서 저장소 생성
echo 3. Vercel에서 프로젝트 배포
echo.
echo 자세한 내용은 QUICK_START.md 파일을 참고하세요.
echo.
pause

