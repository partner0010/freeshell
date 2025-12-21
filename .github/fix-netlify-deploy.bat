@echo off
chcp 65001 >nul
echo ========================================
echo Netlify 배포 실패 해결 스크립트
echo ========================================
echo.

set "PROJECT_ROOT=%~dp0.."
cd /d "%PROJECT_ROOT%"

echo [1/3] netlify.toml 파일 복사 중...
if exist ".github\netlify.toml" (
    copy /Y ".github\netlify.toml" "netlify.toml" >nul
    echo ✓ netlify.toml 복사 완료
) else (
    echo ✗ .github\netlify.toml 파일을 찾을 수 없습니다
)

echo.
echo [2/3] prisma 폴더 생성 중...
if not exist "prisma" (
    mkdir "prisma" >nul
    echo ✓ prisma 폴더 생성 완료
) else (
    echo ✓ prisma 폴더 이미 존재
)

echo.
echo [3/3] schema.prisma 파일 복사 중...
if exist ".github\prisma\schema.prisma" (
    copy /Y ".github\prisma\schema.prisma" "prisma\schema.prisma" >nul
    echo ✓ schema.prisma 복사 완료
) else (
    echo ✗ .github\prisma\schema.prisma 파일을 찾을 수 없습니다
)

echo.
echo ========================================
echo 파일 복사 완료
echo ========================================
echo.
echo 다음 단계:
echo 1. Git에 푸시: git add netlify.toml prisma/schema.prisma
echo 2. Git 커밋: git commit -m "fix: add netlify.toml and prisma schema to project root"
echo 3. Git 푸시: git push origin main
echo 4. Netlify에서 재배포 확인
echo.
pause

