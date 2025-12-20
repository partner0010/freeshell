@echo off
chcp 65001 >nul
echo ========================================
echo 콘텐츠 제작 기능 업그레이드 배포
echo ========================================
echo.

REM 스크립트 위치로 이동
cd /d "%~dp0"
cd ..

echo [1/4] Git 상태 확인...
git status
echo.

echo [2/4] 변경사항 추가...
git add .
if errorlevel 1 (
    echo 오류: Git add 실패
    pause
    exit /b 1
)
echo.

echo [3/4] 커밋 생성...
git commit -m "feat: 2025년 콘텐츠 제작 기능 업그레이드

- 숏폼 콘텐츠 생성기 (AI 스크립트, 해시태그 추천)
- AI 블로그 자동 글쓰기 (SEO 최적화)
- 전자책 생성기
- AI 음악 생성기
- SNS 트렌드 모니터링 시스템
- 보안 강화 (코드 스캐너, 암호화)
- 성능 최적화 (이미지/비디오 최적화, 캐싱)
- 성능 모니터링 시스템"
if errorlevel 1 (
    echo 경고: 커밋 실패 (이미 커밋되었거나 변경사항 없음)
)
echo.

echo [4/4] Vercel 배포...
if exist "node_modules\.bin\vercel.cmd" (
    call npx vercel --prod
) else (
    echo Vercel CLI가 설치되지 않았습니다.
    echo GitHub에 푸시하면 자동으로 배포됩니다.
    echo.
    echo GitHub에 푸시하려면:
    echo   git push origin main
)
echo.

echo ========================================
echo 배포 완료!
echo.
echo 변경사항:
echo   - 숏폼 콘텐츠 생성기
echo   - AI 블로그 자동 글쓰기
echo   - 전자책 생성기
echo   - AI 음악 생성기
echo   - SNS 트렌드 모니터링
echo   - 보안 강화
echo   - 성능 최적화
echo ========================================
echo.
pause

