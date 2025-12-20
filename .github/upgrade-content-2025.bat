@echo off
chcp 65001 >nul
echo ========================================
echo 콘텐츠 제작 기능 2025 업그레이드
echo ========================================
echo.
echo 최신 트렌드와 기술을 반영한 콘텐츠 제작 기능이 업그레이드되었습니다.
echo.

REM 스크립트 위치로 이동
cd /d "%~dp0"
cd ..

echo [1/3] 의존성 확인...
if not exist "node_modules" (
    echo 패키지 설치 중...
    call npm install
)
echo.

echo [2/3] 타입 체크...
call npm run type-check
if errorlevel 1 (
    echo 경고: 타입 오류가 있을 수 있습니다.
)
echo.

echo [3/3] 빌드 테스트...
call npm run build
if errorlevel 1 (
    echo 오류: 빌드 실패
    pause
    exit /b 1
)
echo.

echo ========================================
echo 업그레이드 완료!
echo.
echo 새로운 기능:
echo   - 숏폼 콘텐츠 생성기 (2025 트렌드 반영)
echo   - AI 블로그 자동 글쓰기 (SEO 최적화)
echo   - 전자책 생성기
echo   - AI 음악 생성기
echo   - SNS 트렌드 모니터링
echo   - 보안 강화
echo   - 성능 최적화
echo.
echo 로컬 프리뷰를 실행하려면:
echo   .github\preview-design.bat
echo ========================================
echo.
pause

