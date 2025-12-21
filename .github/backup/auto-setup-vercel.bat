@echo off
chcp 65001 >nul
echo ========================================
echo Vercel 설정 자동화 스크립트
echo ========================================
echo.

REM 현재 스크립트 위치 확인
set "SCRIPT_DIR=%~dp0"
echo 스크립트 위치: %SCRIPT_DIR%
echo.

REM 프로젝트 루트로 이동
cd /d "%SCRIPT_DIR%"
if exist "..\package.json" (
    cd ..
    echo 프로젝트 루트로 이동: %CD%
) else (
    echo 오류: package.json 파일을 찾을 수 없습니다.
    echo 현재 위치: %CD%
    echo 스크립트 위치: %SCRIPT_DIR%
    echo.
    echo 해결 방법:
    echo 1. 프로젝트 루트에서 실행하세요
    echo 2. 또는 .github 폴더에서 실행하세요
    echo.
    pause
    exit /b 1
)

echo [1/5] 프로젝트 루트 확인...
echo 현재 위치: %CD%
if not exist "package.json" (
    echo 오류: package.json 파일을 찾을 수 없습니다.
    echo 현재 디렉토리: %CD%
    echo.
    pause
    exit /b 1
)
echo ✅ 프로젝트 루트 확인 완료: %CD%
echo.

echo [2/5] vercel.json 파일 확인 및 생성...
if not exist "vercel.json" (
    echo vercel.json 파일이 없습니다. 생성 중...
    (
        echo {
        echo   "buildCommand": "npx prisma generate && npx next build"
        echo }
    ) > vercel.json
    echo ✅ vercel.json 파일 생성 완료
) else (
    echo ✅ vercel.json 파일이 이미 존재합니다
    echo 파일 내용 확인:
    type vercel.json
)
echo.

echo [3/5] prisma/schema.prisma 파일 확인...
if not exist "prisma" (
    echo prisma 폴더 생성 중...
    mkdir prisma
)
if not exist "prisma\schema.prisma" (
    echo prisma\schema.prisma 파일이 없습니다.
    echo .github\prisma\schema.prisma에서 복사 중...
    if exist ".github\prisma\schema.prisma" (
        copy ".github\prisma\schema.prisma" "prisma\schema.prisma" /Y
        echo ✅ prisma\schema.prisma 파일 생성 완료
    ) else (
        echo ⚠️  .github\prisma\schema.prisma 파일을 찾을 수 없습니다.
        echo    수동으로 prisma\schema.prisma 파일을 생성하세요.
    )
) else (
    echo ✅ prisma\schema.prisma 파일이 이미 존재합니다
)
echo.

echo [4/5] Git 상태 확인...
git status --short vercel.json prisma/schema.prisma 2>nul | findstr /C:"vercel.json" /C:"prisma" >nul
if %errorlevel% equ 0 (
    echo 변경된 파일이 있습니다.
    echo.
    set /p COMMIT_CHOICE="Git에 커밋하고 푸시하시겠습니까? (Y/N): "
    if /i "%COMMIT_CHOICE%"=="Y" (
        echo.
        echo Git에 커밋 및 푸시 중...
        git add vercel.json prisma/schema.prisma
        git commit -m "fix: add vercel.json and prisma schema for Vercel build"
        git push origin main
        if %errorlevel% equ 0 (
            echo ✅ Git 커밋 및 푸시 완료
        ) else (
            echo ⚠️  Git 푸시에 실패했습니다. 수동으로 푸시하세요.
        )
    ) else (
        echo Git 커밋 및 푸시를 건너뜁니다.
    )
) else (
    echo ✅ 모든 파일이 Git에 커밋되어 있습니다.
)
echo.

echo [5/5] Production Overrides 비우기 안내
echo ========================================
echo.
echo ⚠️  중요: Production Overrides를 비우는 작업은 수동으로 해야 합니다!
echo.
echo ========================================
echo 단계별 가이드
echo ========================================
echo.
echo 1. Vercel 대시보드 접속:
echo    https://vercel.com/dashboard
echo.
echo 2. Freeshell 프로젝트 클릭
echo.
echo 3. Settings → General → Build & Development Settings
echo.
echo 4. Production Overrides 섹션 찾기
echo    - 페이지를 아래로 스크롤
echo    - "Production Overrides" 섹션 찾기
echo.
echo 5. Build Command 필드 비우기:
echo    - "Build Command" 입력 필드 클릭
echo    - Ctrl + A (전체 선택)
echo    - Delete 또는 Backspace (모든 텍스트 삭제)
echo    - 필드가 완전히 비어있는지 확인
echo.
echo 6. 저장:
echo    - 페이지 하단의 "Save" 버튼 클릭
echo    - 저장 완료 확인
echo.
echo 7. 재배포:
echo    - Deployments → 최신 배포 → "..." → "Redeploy"
echo.
echo ========================================
echo 자동화 완료
echo ========================================
echo.
echo ✅ 완료된 작업:
echo   - vercel.json 파일 확인/생성
echo   - prisma/schema.prisma 파일 확인/생성
echo   - Git 커밋 및 푸시 (선택사항)
echo.
echo ⚠️  남은 작업:
echo   - Production Overrides의 Build Command 비우기 (위 가이드 참고)
echo.
echo ========================================
echo.
echo Production Overrides를 비우면:
echo - vercel.json의 buildCommand가 자동으로 사용됩니다
echo - npx prisma generate && npx next build 실행됩니다
echo - 빌드가 성공합니다!
echo.
echo ========================================
echo.
echo Vercel 대시보드를 열까요? (Y/N)
set /p OPEN_VERCEL="선택: "
if /i "%OPEN_VERCEL%"=="Y" (
    start https://vercel.com/dashboard
    echo Vercel 대시보드를 열었습니다.
)
echo.
pause

