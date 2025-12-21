@echo off
chcp 65001 >nul
echo ========================================
echo Vercel Build Settings 자동 수정 스크립트
echo ========================================
echo.

echo 이 스크립트는 Vercel CLI를 사용하여 Build Settings를 자동으로 수정합니다.
echo.
echo 필수 사항:
echo 1. Vercel CLI가 설치되어 있어야 합니다
echo 2. Vercel에 로그인되어 있어야 합니다
echo 3. 프로젝트가 Vercel에 연결되어 있어야 합니다
echo.

pause

echo.
echo [1/3] Vercel CLI 설치 확인...
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo Vercel CLI가 설치되어 있지 않습니다.
    echo.
    echo Vercel CLI 설치 중...
    npm install -g vercel
    if %errorlevel% neq 0 (
        echo 오류: Vercel CLI 설치에 실패했습니다.
        echo 수동으로 설치하세요: npm install -g vercel
        pause
        exit /b 1
    )
    echo Vercel CLI 설치 완료.
) else (
    echo Vercel CLI가 설치되어 있습니다.
)
echo.

echo [2/3] Vercel 로그인 확인...
vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo Vercel에 로그인되어 있지 않습니다.
    echo.
    echo Vercel 로그인 중...
    vercel login
    if %errorlevel% neq 0 (
        echo 오류: Vercel 로그인에 실패했습니다.
        pause
        exit /b 1
    )
    echo Vercel 로그인 완료.
) else (
    echo Vercel에 로그인되어 있습니다.
)
echo.

echo [3/3] vercel.json 파일 확인...
if not exist "..\vercel.json" (
    echo 오류: vercel.json 파일을 찾을 수 없습니다.
    echo 프로젝트 루트에 vercel.json 파일이 있어야 합니다.
    pause
    exit /b 1
)
echo vercel.json 파일이 존재합니다.
echo.

echo ========================================
echo 주의사항
echo ========================================
echo.
echo Vercel CLI로는 Production Overrides를 직접 수정할 수 없습니다.
echo Production Overrides는 Vercel 대시보드에서만 수정 가능합니다.
echo.
echo 하지만 vercel.json 파일이 있으면:
echo - Production Overrides가 비어있을 때 vercel.json의 buildCommand가 사용됩니다
echo - 따라서 Production Overrides를 수동으로 비워야 합니다
echo.
echo ========================================
echo.
echo 다음 단계:
echo 1. Vercel 대시보드에서 Production Overrides의 Build Command를 비우세요
echo 2. 이 스크립트는 vercel.json 파일이 올바른지 확인합니다
echo.
pause

echo.
echo vercel.json 파일 내용 확인:
type "..\vercel.json"
echo.

echo ========================================
echo 확인 완료
echo ========================================
echo.
echo 이제 Vercel 대시보드에서:
echo 1. Settings → General → Build & Development Settings
echo 2. Production Overrides 섹션
echo 3. Build Command 필드를 비우세요
echo 4. 저장
echo 5. 재배포
echo.
pause

