@echo off
chcp 65001 >nul
echo ========================================
echo 커밋 배포 확인
echo ========================================
echo.

echo 커밋 해시: f39d29c868dabf552908a09560108eb7afabc9fa
echo.

cd /d "%~dp0"
cd ..

echo [1/3] 로컬 Git 커밋 확인...
git log --oneline -20 | findstr "f39d29c"
if errorlevel 1 (
    echo ⚠️  로컬에서 이 커밋을 찾을 수 없습니다.
    echo    원격 저장소에서 최신 커밋을 가져오세요:
    echo      git fetch origin
    echo      git pull origin main
) else (
    echo ✅ 로컬에서 커밋 확인됨
)
echo.

echo [2/3] 커밋 상세 정보...
git show f39d29c868dabf552908a09560108eb7afabc9fa --oneline --no-patch
if errorlevel 1 (
    echo ⚠️  커밋 정보를 가져올 수 없습니다.
    echo    원격 저장소에서 가져오세요:
    echo      git fetch origin
) else (
    echo ✅ 커밋 정보 확인됨
)
echo.

echo [3/3] Vercel 배포 확인...
echo.
echo 이 커밋의 배포를 확인하려면:
echo 1. Vercel 대시보드 접속: https://vercel.com/dashboard
echo 2. Freeshell 프로젝트 클릭
echo 3. Deployments 탭에서 커밋 해시로 검색: f39d29c
echo 4. 해당 배포의 상태 및 URL 확인
echo.

echo ========================================
echo 다음 단계
echo ========================================
echo.
echo 1. Vercel 대시보드에서 이 커밋의 배포 찾기
echo 2. 배포 상태 확인 (Ready인지)
echo 3. 배포 URL 확인
echo 4. 해당 URL로 접속 시도
echo.
echo 만약 배포가 Error 상태라면:
echo   - Build Logs 확인
echo   - 오류 메시지 확인
echo   - .github\fix-build.bat 실행
echo.
pause

