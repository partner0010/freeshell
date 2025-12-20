@echo off
chcp 65001 >nul
echo ========================================
echo Vercel 배포 URL 접속 테스트
echo ========================================
echo.

echo [1/3] Vercel Git 배포 URL 테스트...
set URL1=https://freeshell-git-main-partner0010s-projects.vercel.app
echo 테스트 URL: %URL1%
echo.

powershell -Command "try { $response = Invoke-WebRequest -Uri '%URL1%' -Method Head -TimeoutSec 10 -ErrorAction Stop; Write-Host '✅ 접속 가능! 상태 코드:' $response.StatusCode; Write-Host '서버:' $response.Headers['Server'] } catch { Write-Host '❌ 접속 불가:' $_.Exception.Message }"
echo.

echo [2/3] Vercel 배포 ID URL 테스트...
set URL2=https://freeshell-1jqhpcnho-partner0010s-projects.vercel.app
echo 테스트 URL: %URL2%
echo.

powershell -Command "try { $response = Invoke-WebRequest -Uri '%URL2%' -Method Head -TimeoutSec 10 -ErrorAction Stop; Write-Host '✅ 접속 가능! 상태 코드:' $response.StatusCode; Write-Host '서버:' $response.Headers['Server'] } catch { Write-Host '❌ 접속 불가:' $_.Exception.Message }"
echo.

echo [3/3] 커스텀 도메인 테스트...
set URL3=https://freeshell.co.kr
echo 테스트 URL: %URL3%
echo.

powershell -Command "try { $response = Invoke-WebRequest -Uri '%URL3%' -Method Head -TimeoutSec 10 -ErrorAction Stop; Write-Host '✅ 접속 가능! 상태 코드:' $response.StatusCode } catch { Write-Host '❌ 접속 불가:' $_.Exception.Message; Write-Host '   - DNS 전파가 아직 완료되지 않았을 수 있습니다.' }"
echo.

echo ========================================
echo 테스트 완료!
echo ========================================
echo.
echo 확인된 URL들:
echo 1. https://freeshell-git-main-partner0010s-projects.vercel.app
echo 2. https://freeshell-1jqhpcnho-partner0010s-projects.vercel.app
echo 3. https://freeshell.co.kr
echo.
echo 브라우저에서 직접 접속해 보세요!
echo.
pause

