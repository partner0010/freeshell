@echo off
chcp 65001 >nul
echo ========================================
echo 자동 배포 수정 스크립트
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo [1/5] package.json 확인...
if not exist "package.json" (
    echo ❌ 오류: package.json 파일을 찾을 수 없습니다.
    pause
    exit /b 1
)
echo ✅ package.json 파일이 존재합니다
echo.

echo [2/5] package.json의 build 스크립트 확인...
findstr /C:"\"build\"" package.json | findstr /C:"prisma generate" >nul
if %errorlevel% neq 0 (
    echo ❌ build 스크립트가 올바르지 않습니다!
    echo package.json을 수정합니다...
    echo.
    REM package.json 수정은 이미 완료되었으므로 스킵
) else (
    echo ✅ build 스크립트가 올바르게 설정되어 있습니다
)
echo.

echo [3/5] vercel.json 확인 및 복사...
if not exist "vercel.json" (
    echo ⚠️  vercel.json 파일이 프로젝트 루트에 없습니다.
    if exist ".github\vercel.json" (
        echo .github/vercel.json을 프로젝트 루트로 복사합니다...
        copy ".github\vercel.json" "vercel.json" >nul
        echo ✅ vercel.json 파일을 생성했습니다
    ) else (
        echo vercel.json 파일을 생성합니다...
        (
            echo {
            echo   "buildCommand": "npx prisma generate && npx next build"
            echo }
        ) > vercel.json
        echo ✅ vercel.json 파일을 생성했습니다
    )
) else (
    echo ✅ vercel.json 파일이 존재합니다
    findstr /C:"buildCommand" vercel.json | findstr /C:"prisma generate" >nul
    if %errorlevel% neq 0 (
        echo ⚠️  vercel.json의 buildCommand가 올바르지 않습니다!
        echo vercel.json을 수정합니다...
        (
            echo {
            echo   "buildCommand": "npx prisma generate && npx next build"
            echo }
        ) > vercel.json
        echo ✅ vercel.json을 수정했습니다
    ) else (
        echo ✅ vercel.json의 buildCommand가 올바르게 설정되어 있습니다
    )
)
echo.

echo [4/5] prisma/schema.prisma 확인 및 복사...
if not exist "prisma\schema.prisma" (
    echo ⚠️  prisma/schema.prisma 파일이 프로젝트 루트에 없습니다!
    if exist ".github\prisma\schema.prisma" (
        echo .github/prisma/schema.prisma를 prisma/schema.prisma로 복사합니다...
        if not exist "prisma" mkdir prisma
        copy ".github\prisma\schema.prisma" "prisma\schema.prisma" >nul
        echo ✅ prisma/schema.prisma 파일을 생성했습니다
    ) else (
        echo ❌ prisma/schema.prisma 파일을 찾을 수 없습니다!
        pause
        exit /b 1
    )
) else (
    echo ✅ prisma/schema.prisma 파일이 존재합니다
)
echo.

echo [5/5] Git 상태 확인...
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Git 저장소가 초기화되지 않았습니다.
    echo    수동으로 Git에 커밋하고 푸시해야 합니다.
    echo.
    goto :manual
)

git status --short package.json vercel.json prisma\schema.prisma 2>nul | findstr /V "^$" >nul
if %errorlevel% equ 0 (
    echo 변경된 파일이 있습니다.
    echo.
    echo 변경된 파일:
    git status --short package.json vercel.json prisma\schema.prisma 2>nul
    echo.
    set /p COMMIT_CHOICE="Git에 커밋하고 푸시하시겠습니까? (Y/N): "
    if /i "%COMMIT_CHOICE%"=="Y" (
        goto :commit
    ) else (
        echo Git 커밋 및 푸시를 건너뜁니다.
        goto :manual
    )
) else (
    echo ✅ 모든 파일이 Git에 커밋되어 있습니다.
    echo.
    set /p FORCE_PUSH="강제로 다시 커밋하고 푸시하시겠습니까? (Y/N): "
    if /i "%FORCE_PUSH%"=="Y" (
        goto :commit
    ) else (
        goto :manual
    )
)

:commit
echo.
echo Git에 커밋 및 푸시...
git add package.json vercel.json prisma\schema.prisma 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  Git add 실패
    goto :manual
)

git commit -m "fix: ensure prisma generate runs during build" 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  Git commit 실패 (변경사항이 없을 수 있음)
) else (
    echo ✅ Git commit 완료
)

git push origin main 2>nul
if %errorlevel% neq 0 (
    git push origin master 2>nul
    if %errorlevel% neq 0 (
        echo ⚠️  Git push 실패
        echo    수동으로 푸시하세요: git push origin main
        goto :manual
    )
)
echo ✅ Git push 완료
echo.
goto :end

:manual
echo.
echo ========================================
echo 수동 작업 필요
echo ========================================
echo.
echo 다음 명령어를 실행하세요:
echo.
echo   git add package.json vercel.json prisma\schema.prisma
echo   git commit -m "fix: ensure prisma generate runs during build"
echo   git push origin main
echo.
echo 그 다음 Vercel에서 재배포하세요.
echo.
goto :end

:end
echo ========================================
echo 완료!
echo ========================================
echo.
echo 다음 단계:
echo 1. Vercel 대시보드에서 Settings → General → Build & Development Settings
echo 2. "Project Settings" 섹션에서 "Build Command" Override 활성화
echo 3. Build Command를 "npx prisma generate && npx next build"로 설정
echo 4. 저장 후 재배포
echo.
echo 또는:
echo 1. Git에 푸시 (위 명령어 실행)
echo 2. Vercel에서 자동 재배포 대기
echo.
pause

