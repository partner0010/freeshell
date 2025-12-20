@echo off
chcp 65001 >nul
echo ========================================
echo 사이트 접속 확인
echo ========================================
echo.

echo [1/4] Vercel 기본 URL 확인...
echo.
set VERCEL_URL=https://freeshell.vercel.app
echo 테스트 URL: %VERCEL_URL%
echo.

powershell -Command "try { $response = Invoke-WebRequest -Uri '%VERCEL_URL%' -Method Head -TimeoutSec 10 -ErrorAction Stop; Write-Host '✅ 접속 가능! 상태 코드:' $response.StatusCode; Write-Host '서버:' $response.Headers['Server'] } catch { Write-Host '❌ 접속 불가:' $_.Exception.Message; Write-Host '   - 배포가 아직 진행 중일 수 있습니다.'; Write-Host '   - Vercel 대시보드에서 배포 상태를 확인하세요.' }"
echo.

echo [2/4] 커스텀 도메인 확인...
echo.
set CUSTOM_URL=https://freeshell.co.kr
echo 테스트 URL: %CUSTOM_URL%
echo.

powershell -Command "try { $response = Invoke-WebRequest -Uri '%CUSTOM_URL%' -Method Head -TimeoutSec 10 -ErrorAction Stop; Write-Host '✅ 접속 가능! 상태 코드:' $response.StatusCode } catch { Write-Host '❌ 접속 불가:' $_.Exception.Message; Write-Host '   - DNS 전파가 아직 완료되지 않았을 수 있습니다.'; Write-Host '   - DNS 전파는 최대 48시간이 소요될 수 있습니다.' }"
echo.

echo [3/4] DNS 전파 확인...
echo.
echo DNS 전파 상태를 확인하려면:
echo 1. https://dnschecker.org 접속
echo 2. 도메인 입력: freeshell.co.kr
echo 3. 레코드 타입 선택: A 또는 CNAME
echo 4. 전 세계 서버에서 확인
echo.

echo [4/4] Vercel 배포 상태 확인...
echo.
echo Vercel 대시보드에서 확인:
echo https://vercel.com/dashboard
echo.
echo 확인 사항:
echo 1. 최근 배포 상태가 "Ready" (초록색)인지 확인
echo 2. 배포 URL이 올바른지 확인
echo 3. 도메인 설정이 올바른지 확인
echo.

echo ========================================
echo 접속 문제 해결 방법
echo ========================================
echo.
echo 1. Vercel 기본 URL로 접속 시도:
echo    https://freeshell.vercel.app
echo.
echo 2. Vercel 대시보드에서 배포 상태 확인:
echo    - Ready = 정상
echo    - Building = 빌드 중
echo    - Error = 오류 발생
echo.
echo 3. DNS 전파 대기 (커스텀 도메인인 경우):
echo    - 최대 48시간 소요
echo    - 대부분 2-4시간 내 완료
echo.
echo 4. 브라우저 캐시 삭제:
echo    - Ctrl + Shift + Delete
echo    - 또는 시크릿 모드로 접속
echo.
echo 5. 다른 네트워크에서 접속 시도:
echo    - 모바일 데이터 사용
echo    - 다른 WiFi 네트워크
echo.
pause

