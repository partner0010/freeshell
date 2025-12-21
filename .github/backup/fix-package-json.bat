@echo off
chcp 65001 >nul
echo ========================================
echo package.json 자동 수정 및 푸시 스크립트
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo [1/4] package.json 확인...
if not exist "package.json" (
    echo ❌ 오류: package.json 파일을 찾을 수 없습니다.
    pause
    exit /b 1
)
echo ✅ package.json 파일이 존재합니다
echo.

echo [2/4] build 스크립트 확인...
findstr /C:"\"build\"" package.json | findstr /C:"prisma generate" >nul
if %errorlevel% equ 0 (
    echo ✅ build 스크립트가 올바르게 설정되어 있습니다
    echo 현재 build 스크립트:
    findstr /C:"\"build\"" package.json
) else (
    echo ❌ build 스크립트가 올바르지 않습니다!
    echo 현재 build 스크립트:
    findstr /C:"\"build\"" package.json
    echo.
    echo package.json을 수정해야 합니다.
    pause
    exit /b 1
)
echo.

echo [3/4] Git 상태 확인...
git status --short package.json 2>nul | findstr package.json >nul
if %errorlevel% equ 0 (
    echo 변경된 파일이 있습니다.
    echo.
    set /p COMMIT_CHOICE="Git에 커밋하고 푸시하시겠습니까? (Y/N): "
    if /i "%COMMIT_CHOICE%"=="Y" (
        goto :commit
    ) else (
        echo Git 커밋 및 푸시를 건너뜁니다.
        goto :end
    )
) else (
    echo ✅ package.json이 Git에 커밋되어 있습니다.
    echo.
    set /p FORCE_PUSH="강제로 다시 커밋하고 푸시하시겠습니까? (Y/N): "
    if /i "%FORCE_PUSH%"=="Y" (
        goto :commit
    ) else (
        goto :end
    )
)

:commit
echo.
echo [4/4] Git에 커밋 및 푸시...
git add package.json
if %errorlevel% neq 0 (
    echo ⚠️  Git add 실패
    pause
    exit /b 1
)

git commit -m "fix: ensure build script includes prisma generate"
if %errorlevel% neq 0 (
    echo ⚠️  Git commit 실패 (변경사항이 없을 수 있음)
) else (
    echo ✅ Git commit 완료
)

git push origin main
if %errorlevel% neq 0 (
    echo ⚠️  Git push 실패
    echo    수동으로 푸시하세요: git push origin main
) else (
    echo ✅ Git push 완료
)
echo.

:end
echo ========================================
echo 완료!
echo ========================================
echo.
echo 다음 단계:
echo 1. Vercel에서 재배포
echo 2. Build Logs 확인
echo.
pause

