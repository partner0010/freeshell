@echo off
chcp 65001 >nul
echo ========================================
echo Vercel 배포 URL 확인
echo ========================================
echo.

echo [중요] Vercel 대시보드에서 확인하세요:
echo.
echo 1. https://vercel.com/dashboard 접속
echo 2. Freeshell 프로젝트 클릭
echo 3. Deployments 탭에서 최근 배포 확인
echo 4. 배포 URL 확인 (예: https://freeshell-xxxxx.vercel.app)
echo.
echo ⚠️  주의: 프로젝트 이름이 'freeshell'이 아닐 수 있습니다.
echo    정확한 URL은 Vercel 대시보드에서 확인하세요.
echo.

echo ========================================
echo 403 오류 해결 방법
echo ========================================
echo.
echo 1. Vercel 대시보드에서 정확한 배포 URL 확인
echo 2. 그 URL로 직접 접속 시도
echo 3. 배포 상태가 Ready인지 확인
echo 4. 필요시 배포 재시도
echo.
echo ========================================
echo.
pause

