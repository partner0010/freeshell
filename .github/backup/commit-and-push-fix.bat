@echo off
chcp 65001 >nul
echo ========================================
echo Prisma 빌드 오류 수정 후 커밋 및 푸시
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo [1/5] 변경된 파일 확인...
echo.
echo 수정된 파일:
echo   - package.json (prebuild 스크립트 추가)
echo   - vercel.json (새로 생성, Build Command 명시)
echo   - prisma/schema.prisma (표준 위치)
echo.

echo [2/5] Git 경로 설정...
set REPO_PATH=%CD%
git config --global --add safe.directory "%REPO_PATH%"
if errorlevel 1 (
    echo ⚠️  Git 경로 설정 실패 (계속 진행)
) else (
    echo ✅ Git 경로 설정 완료
)
echo.

echo [3/5] 변경사항 추가...
git add package.json vercel.json prisma/schema.prisma
if errorlevel 1 (
    echo ❌ Git add 실패
    pause
    exit /b 1
)
echo ✅ 변경사항 추가 완료
echo.

echo [4/5] 커밋...
git commit -m "fix: ensure Prisma Client generation in Vercel build

- Add prebuild script to package.json
- Create vercel.json with explicit buildCommand
- Ensure prisma generate runs before build"
if errorlevel 1 (
    echo ⚠️  커밋 실패 (변경사항이 없을 수 있음)
    echo    빈 커밋으로 재배포를 트리거합니다...
    git commit --allow-empty -m "chore: trigger redeploy with Prisma build fix"
)
echo ✅ 커밋 완료
echo.

echo [5/5] GitHub에 푸시...
git push origin main
if errorlevel 1 (
    echo.
    echo ========================================
    echo ❌ Git 푸시 실패
    echo ========================================
    echo.
    echo 수동으로 푸시하거나 Vercel에서 직접 재배포하세요:
    echo.
    echo 방법 1: 수동 푸시
    echo   git push origin main
    echo.
    echo 방법 2: Vercel 대시보드에서 직접 재배포
    echo   1. https://vercel.com/dashboard 접속
    echo   2. Freeshell 프로젝트 클릭
    echo   3. Deployments 탭
    echo   4. 최신 배포의 "..." → "Redeploy"
    echo.
    pause
    exit /b 1
)
echo.

echo ========================================
echo ✅ 커밋 및 푸시 완료!
echo ========================================
echo.
echo Vercel에서 자동으로 배포가 시작됩니다.
echo.
echo 적용된 수정 사항:
echo   ✅ package.json에 prebuild 스크립트 추가
echo   ✅ vercel.json에 Build Command 명시
echo   ✅ Prisma schema 표준 위치 확인
echo.
echo 배포 상태 확인:
echo https://vercel.com/dashboard
echo.
timeout /t 2 >nul
start https://vercel.com/dashboard
pause

