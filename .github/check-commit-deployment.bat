@echo off
chcp 65001 >nul
echo ========================================
echo 커밋 배포 확인
echo ========================================
echo.

echo 커밋 해시: 140a25dbae0cd7df6e920a30fc9c13ebcb3d70ee
echo.

echo [1/3] 로컬 Git 커밋 확인...
cd /d "%~dp0"
cd ..

git log --oneline -10 | findstr "140a25d"
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
git show 140a25dbae0cd7df6e920a30fc9c13ebcb3d70ee --oneline --no-patch
if errorlevel 1 (
    echo ⚠️  커밋 정보를 가져올 수 없습니다.
) else (
    echo ✅ 커밋 정보 확인됨
)
echo.

echo [3/3] Vercel 배포 확인...
echo.
echo 이 커밋의 배포를 확인하려면:
echo 1. Vercel 대시보드 접속: https://vercel.com/dashboard
echo 2. Freeshell 프로젝트 클릭
echo 3. Deployments 탭에서 커밋 해시로 검색
echo 4. 해당 배포의 URL 확인
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
pause

