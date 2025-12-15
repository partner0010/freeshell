@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   Freeshell 코드 업로드
echo ========================================
echo.

cd /d "%~dp0"

echo [1/7] Git 사용자 정보 설정...
git config --global user.email "partner0010@gmail.com"
git config --global user.name "partner0010"
echo ✅ Git 사용자 정보 설정 완료

echo.
echo [2/7] Git 초기화...
if not exist .git (
    git init
    echo ✅ Git 초기화 완료
) else (
    echo ℹ️  Git 이미 초기화됨
)

echo.
echo [3/7] 원격 저장소 추가...
git remote remove origin 2>nul
git remote add origin https://github.com/partner0010/freeshell.git
echo ✅ 원격 저장소 추가 완료

echo.
echo [4/7] 파일 추가...
git add .
echo ✅ 파일 추가 완료

echo.
echo [5/7] 커밋...
git commit -m "Initial commit: Freeshell v2.0 - Complete rewrite"
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  커밋 실패 - 이미 커밋되어 있을 수 있습니다
) else (
    echo ✅ 커밋 완료
)

echo.
echo [6/7] 브랜치 이름 변경...
git branch -M main
echo ✅ 브랜치 이름 변경 완료

echo.
echo [7/7] GitHub에 업로드...
echo ⚠️  인증이 필요할 수 있습니다...
git push -u origin main

echo.
echo ========================================
if %ERRORLEVEL% EQU 0 (
    echo ✅ 업로드 완료!
    echo.
    echo 저장소 확인: https://github.com/partner0010/freeshell
) else (
    echo ❌ 업로드 실패
    echo.
    echo 인증 문제일 수 있습니다.
    echo GitHub에 로그인되어 있는지 확인하세요.
)
echo ========================================
echo.
pause
