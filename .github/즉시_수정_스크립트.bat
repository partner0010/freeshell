@echo off
chcp 65001 >nul
echo ========================================
echo package.json JSON 오류 수정 스크립트
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo [1/3] package.json 확인...
if not exist "package.json" (
    echo ❌ package.json 파일이 없습니다!
    pause
    exit /b 1
)
echo ✅ package.json 파일이 존재합니다
echo.

echo [2/3] package.json 수정...
(
echo {
echo   "name": "freeshell",
echo   "version": "2.0.0",
echo   "private": true,
echo   "scripts": {
echo     "postinstall": "npx prisma generate",
echo     "prebuild": "npx prisma generate",
echo     "dev": "next dev",
echo     "build": "npx prisma generate && next build",
echo     "start": "next start",
echo     "lint": "next lint",
echo     "vercel-build": "npx prisma generate && next build"
echo   },
echo   "dependencies": {
echo     "next": "14.2.35",
echo     "react": "^18.2.0",
echo     "react-dom": "^18.2.0",
echo     "next-auth": "^4.24.5",
echo     "@prisma/client": "^5.22.0",
echo     "bcryptjs": "^2.4.3",
echo     "zustand": "^4.4.7",
echo     "framer-motion": "^10.16.16",
echo     "lucide-react": "^0.294.0",
echo     "tailwindcss": "^3.4.1",
echo     "autoprefixer": "^10.4.16",
echo     "postcss": "^8.4.32"
echo   },
echo   "devDependencies": {
echo     "@types/node": "^20.10.6",
echo     "@types/react": "^18.2.45",
echo     "@types/react-dom": "^18.2.18",
echo     "@types/bcryptjs": "^2.4.6",
echo     "typescript": "^5.3.3",
echo     "prisma": "^5.22.0",
echo     "eslint": "^8.56.0",
echo     "eslint-config-next": "14.2.35"
echo   }
echo }
) > package.json
echo ✅ package.json을 수정했습니다
echo.

echo [3/3] Git 상태 확인...
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Git 저장소가 초기화되지 않았습니다.
    echo    수동으로 Git에 커밋하고 푸시해야 합니다.
    goto :manual
)

git status --short package.json 2>nul | findstr /V "^$" >nul
if %errorlevel% equ 0 (
    echo 변경된 파일이 있습니다.
    echo.
    set /p COMMIT_CHOICE="Git에 커밋하고 푸시하시겠습니까? (Y/N): "
    if /i "%COMMIT_CHOICE%"=="Y" (
        goto :commit
    ) else (
        echo Git 커밋 및 푸시를 건너뜁니다.
        goto :manual
    )
) else (
    echo ✅ package.json이 Git에 커밋되어 있습니다.
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
git add package.json 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  Git add 실패
    goto :manual
)

git commit -m "fix: correct package.json JSON syntax" 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  Git commit 실패 (변경사항이 없을 수 있음)
) else (
    echo ✅ Git commit 완료
)

REM main 브랜치 확인
git branch --list main >nul 2>&1
if %errorlevel% equ 0 (
    set BRANCH=main
) else (
    git branch --list master >nul 2>&1
    if %errorlevel% equ 0 (
        set BRANCH=master
    ) else (
        echo ⚠️  main 또는 master 브랜치를 찾을 수 없습니다.
        goto :manual
    )
)

git push origin %BRANCH% 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  Git push 실패
    echo    수동으로 푸시하세요: git push origin %BRANCH%
    goto :manual
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
echo   git add package.json
echo   git commit -m "fix: correct package.json JSON syntax"
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
echo 1. Vercel에서 자동 재배포 대기
echo 2. Build Logs 확인
echo.
pause

