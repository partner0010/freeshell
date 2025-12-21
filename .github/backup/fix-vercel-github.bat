@echo off
chcp 65001 >nul
echo ========================================
echo Vercel-GitHub 연결 및 빌드 오류 수정
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo [문제 진단]
echo.
echo 1. 모든 최근 배포가 Error 상태입니다.
echo 2. 빌드 로그를 확인해야 합니다.
echo 3. GitHub 연결 상태를 확인해야 합니다.
echo.

echo ========================================
echo 해결 방법
echo ========================================
echo.

echo [방법 1] Vercel 대시보드에서 GitHub 재연결
echo.
echo 1. https://vercel.com/dashboard 접속
echo 2. Freeshell 프로젝트 클릭
echo 3. Settings 탭 클릭
echo 4. Git 섹션에서:
echo    - GitHub 연결 확인
echo    - 연결이 안 되어 있으면 "Connect Git Repository" 클릭
echo    - partner0010/freeshell 저장소 선택
echo    - 권한 승인
echo.

echo [방법 2] 빌드 로그 확인 및 오류 수정
echo.
echo 1. Vercel 대시보드 → Deployments
echo 2. 최신 Error 배포 클릭
echo 3. "Build Logs" 탭 클릭
echo 4. 오류 메시지 확인
echo 5. 아래 스크립트로 수정:
echo    .github\fix-build.bat
echo.

echo [방법 3] 로컬 빌드 테스트
echo.
echo 로컬에서 빌드 테스트를 실행합니다...
echo.

if not exist "package.json" (
    echo ❌ package.json 파일을 찾을 수 없습니다!
    echo    프로젝트 루트에서 실행하세요.
    pause
    exit /b 1
)

echo [1/3] 의존성 설치...
call npm install
if errorlevel 1 (
    echo ❌ npm install 실패
    pause
    exit /b 1
)
echo ✅ 의존성 설치 완료
echo.

echo [2/3] 빌드 테스트...
call npm run build
if errorlevel 1 (
    echo.
    echo ========================================
    echo ❌ 빌드 실패!
    echo ========================================
    echo.
    echo 위의 오류 메시지를 확인하세요.
    echo.
    echo 일반적인 해결 방법:
    echo 1. package.json에 누락된 의존성 추가
    echo 2. next.config.js 설정 확인
    echo 3. TypeScript 오류 수정
    echo.
    echo 자세한 내용:
    echo   .github\BUILD_ERRORS.md
    echo.
    pause
    exit /b 1
)
echo ✅ 빌드 성공!
echo.

echo [3/3] 변경사항 커밋 및 푸시...
echo.
git status --short
echo.

set /p PUSH="변경사항을 GitHub에 푸시하시겠습니까? (Y/N): "
if /i "%PUSH%"=="Y" (
    git add .
    git commit -m "fix: resolve build errors and verify dependencies"
    git push origin main
    if errorlevel 1 (
        echo ⚠️  Git 푸시 실패
        echo    수동으로 푸시하세요:
        echo      git push origin main
    ) else (
        echo ✅ 푸시 완료! Vercel에서 자동 배포가 시작됩니다.
    )
)
echo.

echo ========================================
echo 다음 단계
echo ========================================
echo.
echo 1. Vercel 대시보드에서 GitHub 연결 확인
echo 2. 빌드 로그에서 오류 확인
echo 3. 오류 수정 후 재배포
echo.
pause

