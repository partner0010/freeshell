@echo off
chcp 65001 >nul
echo ========================================
echo 자동 수정 및 배포 스크립트
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo [1/6] Prisma schema 확인 및 생성...
if not exist "prisma" (
    echo prisma 폴더 생성 중...
    mkdir prisma
)
if not exist "prisma\schema.prisma" (
    echo prisma\schema.prisma 파일 생성 중...
    copy ".github\prisma\schema.prisma" "prisma\schema.prisma" /Y
    if errorlevel 1 (
        echo ❌ schema.prisma 복사 실패
        echo    수동으로 복사하세요: .github\prisma\schema.prisma → prisma\schema.prisma
        pause
        exit /b 1
    )
    echo ✅ prisma\schema.prisma 파일 생성 완료
) else (
    echo ✅ prisma\schema.prisma 파일이 이미 존재합니다
)
echo.

echo [2/6] package.json 확인...
if not exist "package.json" (
    echo ❌ package.json 파일을 찾을 수 없습니다!
    pause
    exit /b 1
)
echo ✅ package.json 확인됨
echo.

echo [3/6] vercel.json 확인...
if not exist "vercel.json" (
    echo vercel.json 파일 생성 중...
    (
        echo {
        echo   "buildCommand": "npx prisma generate && npx next build"
        echo }
    ) > vercel.json
    echo ✅ vercel.json 파일 생성 완료
) else (
    echo ✅ vercel.json 파일이 이미 존재합니다
)
echo.

echo [4/6] Git 경로 설정...
set REPO_PATH=%CD%
git config --global --add safe.directory "%REPO_PATH%"
if errorlevel 1 (
    echo ⚠️  Git 경로 설정 실패 (계속 진행)
) else (
    echo ✅ Git 경로 설정 완료
)
echo.

echo [5/6] 변경사항 추가 및 커밋...
git add prisma/schema.prisma package.json vercel.json
if errorlevel 1 (
    echo ⚠️  Git add 실패 (파일이 이미 추가되었을 수 있음)
) else (
    echo ✅ 변경사항 추가 완료
)

git commit -m "fix: add Prisma schema to root and ensure build command

- Add prisma/schema.prisma to project root
- Update package.json build script with npx prisma generate
- Add vercel.json with buildCommand"
if errorlevel 1 (
    echo ⚠️  커밋 실패 (변경사항이 없을 수 있음)
    echo    빈 커밋으로 재배포를 트리거합니다...
    git commit --allow-empty -m "chore: trigger redeploy with Prisma fix"
)
echo ✅ 커밋 완료
echo.

echo [6/6] GitHub에 푸시...
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
    echo ⚠️  중요: Vercel Build Settings에서 Production Overrides 수정 필요!
    echo   Settings → General → Build & Development Settings
    echo   Production Overrides → Build Command: npx prisma generate && npx next build
    echo.
    pause
    exit /b 1
)
echo.

echo ========================================
echo ✅ 자동 수정 및 푸시 완료!
echo ========================================
echo.
echo 다음 단계:
echo.
echo ⚠️  중요: Vercel Build Settings에서 Production Overrides 수정 필요!
echo.
echo 1. Vercel 대시보드 접속:
echo    https://vercel.com/dashboard
echo.
echo 2. Freeshell 프로젝트 클릭
echo.
echo 3. Settings → General → Build & Development Settings
echo.
echo 4. Production Overrides 섹션 찾기
echo.
echo 5. Build Command 수정:
echo    현재: npm run build
echo    변경: npx prisma generate && npx next build
echo.
echo 6. 저장 버튼 클릭
echo.
echo 7. 재배포:
echo    Deployments → 최신 배포 → "..." → "Redeploy"
echo.
echo ========================================
echo.
timeout /t 3 >nul
start https://vercel.com/dashboard
pause

