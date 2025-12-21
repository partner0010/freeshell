@echo off
chcp 65001 >nul
echo ========================================
echo 긴급 빌드 오류 수정 (즉시 실행)
echo ========================================
echo.

echo [주의] 이 스크립트는 프로젝트 루트에서 실행해야 합니다!
echo.
echo 현재 위치 확인 중...
cd /d "%~dp0"
cd ..

echo 현재 디렉토리: %CD%
echo.

if not exist "package.json" (
    echo ❌ package.json 파일을 찾을 수 없습니다!
    echo.
    echo 프로젝트 루트에서 실행하세요:
    echo   C:\Users\partn\OneDrive\바탕 화면\Cursor\Freeshell
    echo.
    pause
    exit /b 1
)

echo ✅ package.json 확인됨
echo.

echo [1/3] 필수 의존성 설치...
echo.
echo 설치할 패키지:
echo   - next-auth@4
echo   - bcryptjs
echo   - @types/bcryptjs
echo.
call npm install next-auth@4 bcryptjs @types/bcryptjs
if errorlevel 1 (
    echo ❌ 의존성 설치 실패
    pause
    exit /b 1
)
echo ✅ 의존성 설치 완료
echo.

echo [2/3] 로컬 빌드 테스트...
echo.
echo ⚠️  빌드 테스트를 시작합니다. 시간이 걸릴 수 있습니다...
echo.
call npm run build
if errorlevel 1 (
    echo.
    echo ========================================
    echo ❌ 빌드 실패!
    echo ========================================
    echo.
    echo 위의 오류 메시지를 확인하세요.
    echo.
    echo 추가 확인 사항:
    echo 1. WebsiteAuditor.tsx의 JSX 구문 확인
    echo 2. AdvancedBlockRenderer.tsx의 JSX 구문 확인
    echo 3. 모든 import 문이 올바른지 확인
    echo.
    pause
    exit /b 1
) else (
    echo.
    echo ========================================
    echo ✅ 빌드 성공!
    echo ========================================
    echo.
    echo 이제 배포할 수 있습니다.
    echo.
)
echo.

echo [3/3] 변경사항 커밋 및 푸시...
echo.
set /p DEPLOY="변경사항을 커밋하고 푸시하시겠습니까? (Y/N): "
if /i "%DEPLOY%"=="Y" (
    echo.
    echo 변경사항 추가...
    git add package.json package-lock.json
    echo.
    echo 커밋 생성...
    git commit -m "fix: add missing dependencies (next-auth, bcryptjs)"
    echo.
    echo GitHub에 푸시...
    git push origin main
    if errorlevel 1 (
        echo.
        echo ⚠️  Git 푸시 실패
        echo    수동으로 푸시하거나 Vercel에서 수동 재배포하세요.
        echo.
        echo 수동 푸시:
        echo   git push origin main
        echo.
        echo 또는 Vercel 대시보드에서:
        echo   1. https://vercel.com/dashboard
        echo   2. Freeshell 프로젝트 → Deployments
        echo   3. 최신 배포의 "..." → "Redeploy"
        echo.
    ) else (
        echo.
        echo ========================================
        echo ✅ 푸시 완료!
        echo ========================================
        echo.
        echo Vercel에서 자동 배포가 시작됩니다.
        echo.
        echo 배포 상태 확인:
        echo https://vercel.com/dashboard
        echo.
    )
) else (
    echo.
    echo ⚠️  커밋 및 푸시를 건너뜁니다.
    echo    수동으로 실행하세요:
    echo      git add package.json package-lock.json
    echo      git commit -m "fix: add missing dependencies"
    echo      git push origin main
    echo.
)
echo.

pause

