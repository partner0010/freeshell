@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   Freeshell 코드 업로드 (에러 수정 포함)
echo ========================================
echo.

cd /d "C:\Users\partn\OneDrive\바탕 화면\Cursor\Freeshell"

echo [1/7] Git 사용자 정보 설정...
git config --global user.email "partner0010@gmail.com"
git config --global user.name "partner0010"
echo ✅ Git 사용자 정보 설정 완료

echo.
echo [2/7] Git 초기화 확인...
if not exist .git (
    git init
    echo ✅ Git 초기화 완료
) else (
    echo ℹ️  Git 이미 초기화됨
)

echo.
echo [3/7] 원격 저장소 설정...
git remote remove origin 2>nul
git remote add origin https://github.com/partner0010/freeshell.git
echo ✅ 원격 저장소 설정 완료

echo.
echo [4/7] 파일 추가...
git add .
echo ✅ 파일 추가 완료

echo.
echo [5/7] 커밋...
git commit -m "Initial commit: Freeshell v2.0 - Complete rewrite"
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  커밋 실패 - 이미 커밋되어 있거나 변경사항이 없을 수 있습니다
    echo    계속 진행합니다...
) else (
    echo ✅ 커밋 완료
)

echo.
echo [6/7] 브랜치 이름 변경...
git branch -M main
echo ✅ 브랜치 이름 변경 완료

echo.
echo [7/7] GitHub에 업로드...
echo ⚠️  인증이 필요할 수 있습니다. 브라우저가 열리면 로그인하세요...
git push -u origin main

echo.
echo ========================================
if %ERRORLEVEL% EQU 0 (
    echo ✅ 업로드 완료!
    echo.
    echo 저장소 확인: https://github.com/partner0010/freeshell
    echo.
    echo 다음 단계: Vercel에서 배포하세요!
) else (
    echo ❌ 업로드 실패
    echo.
    echo 가능한 원인:
    echo - GitHub 인증 필요 (브라우저에서 로그인)
    echo - 네트워크 문제
    echo.
    echo 다시 시도하거나 수동으로 실행하세요.
)
echo ========================================
echo.
pause

