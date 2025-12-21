@echo off
chcp 65001 >nul
echo ========================================
echo GitHub 저장소 확인 스크립트
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo [1/5] 프로젝트 루트 확인...
if not exist "package.json" (
    echo ❌ 오류: package.json 파일을 찾을 수 없습니다.
    echo 현재 위치: %CD%
    pause
    exit /b 1
)
echo ✅ 프로젝트 루트 확인: %CD%
echo.

echo [2/5] vercel.json 파일 확인...
if exist "vercel.json" (
    echo ✅ vercel.json 파일이 존재합니다
    echo 파일 내용:
    type vercel.json
    echo.
) else (
    echo ❌ vercel.json 파일이 없습니다!
    echo.
    echo vercel.json 파일 생성 중...
    (
        echo {
        echo   "buildCommand": "npx prisma generate && npx next build"
        echo }
    ) > vercel.json
    echo ✅ vercel.json 파일 생성 완료
    echo.
)
echo.

echo [3/5] prisma/schema.prisma 파일 확인...
if not exist "prisma" (
    echo prisma 폴더 생성 중...
    mkdir prisma
)
if exist "prisma\schema.prisma" (
    echo ✅ prisma\schema.prisma 파일이 존재합니다
    echo.
) else (
    echo ❌ prisma\schema.prisma 파일이 없습니다!
    echo.
    if exist ".github\prisma\schema.prisma" (
        echo .github\prisma\schema.prisma에서 복사 중...
        copy ".github\prisma\schema.prisma" "prisma\schema.prisma" /Y
        echo ✅ prisma\schema.prisma 파일 생성 완료
    ) else (
        echo ⚠️  .github\prisma\schema.prisma 파일도 없습니다.
        echo    수동으로 prisma\schema.prisma 파일을 생성하세요.
    )
    echo.
)
echo.

echo [4/5] package.json 확인...
if exist "package.json" (
    echo ✅ package.json 파일이 존재합니다
    echo build 스크립트 확인:
    findstr /C:"\"build\"" package.json
    echo.
) else (
    echo ❌ package.json 파일이 없습니다!
    pause
    exit /b 1
)
echo.

echo [5/5] Git 상태 확인...
git status --short vercel.json prisma/schema.prisma 2>nul | findstr /C:"vercel.json" /C:"prisma" >nul
if %errorlevel% equ 0 (
    echo ⚠️  변경된 파일이 있습니다:
    git status --short vercel.json prisma/schema.prisma
    echo.
    set /p PUSH_CHOICE="Git에 커밋하고 푸시하시겠습니까? (Y/N): "
    if /i "%PUSH_CHOICE%"=="Y" (
        echo.
        echo Git에 커밋 및 푸시 중...
        git add vercel.json prisma/schema.prisma
        git commit -m "fix: add vercel.json and prisma schema for Vercel build"
        git push origin main
        if %errorlevel% equ 0 (
            echo ✅ Git 커밋 및 푸시 완료
        ) else (
            echo ⚠️  Git 푸시에 실패했습니다.
            echo    수동으로 푸시하세요:
            echo    git add vercel.json prisma/schema.prisma
            echo    git commit -m "fix: add vercel.json and prisma schema"
            echo    git push origin main
        )
    ) else (
        echo Git 커밋 및 푸시를 건너뜁니다.
    )
) else (
    echo ✅ 모든 파일이 Git에 커밋되어 있습니다.
)
echo.

echo ========================================
echo 확인 완료
echo ========================================
echo.
echo ✅ 확인된 파일:
if exist "vercel.json" echo   - vercel.json
if exist "prisma\schema.prisma" echo   - prisma/schema.prisma
if exist "package.json" echo   - package.json
echo.
echo ⚠️  다음 단계:
echo   1. Vercel 프로젝트 재연결 (필요한 경우)
echo   2. Production Overrides 확인
echo   3. 재배포
echo.
pause

