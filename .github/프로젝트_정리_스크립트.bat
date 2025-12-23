@echo off
chcp 65001 >nul
echo ========================================
echo 프로젝트 폴더 정리 스크립트
echo ========================================
echo.

cd /d "%~dp0\.."

echo 현재 위치: %CD%
echo.

echo [1단계] 불필요한 파일 확인 중...
echo.

REM .github 폴더의 backup 폴더 확인
if exist ".github\backup" (
    echo .github\backup 폴더 발견
    echo 이 폴더는 백업용이므로 유지합니다.
)

REM 임시 파일 삭제
echo [2단계] 임시 파일 삭제 중...
del /q /s /f "*.tmp" 2>nul
del /q /s /f "*.log" 2>nul
del /q /s /f "*.cache" 2>nul
del /q /s /f "*.swp" 2>nul
del /q /s /f "*.swo" 2>nul
del /q /s /f "*~" 2>nul
del /q /s /f ".DS_Store" 2>nul
del /q /s /f "Thumbs.db" 2>nul
echo 임시 파일 삭제 완료
echo.

REM 빌드 산출물 삭제 (필요시)
echo [3단계] 빌드 산출물 확인 중...
if exist ".next" (
    echo .next 폴더 발견 (Next.js 빌드 산출물)
    echo 이 폴더는 빌드 시 자동 생성되므로 유지합니다.
)
echo.

REM 불필요한 문서 파일 확인
echo [4단계] 중복 문서 파일 확인 중...
if exist "새 텍스트 문서.txt" (
    echo "새 텍스트 문서.txt" 삭제 중...
    del /q "새 텍스트 문서.txt"
    echo 삭제 완료
)

if exist "troubleshoot.html" (
    echo troubleshoot.html 삭제 중...
    del /q "troubleshoot.html"
    echo 삭제 완료
)
echo.

REM .github 폴더의 중복 가이드 파일 정리
echo [5단계] .github 폴더 정리 중...
cd .github
if exist "backup" (
    echo backup 폴더는 백업용이므로 유지합니다.
)
cd ..
echo.

echo [6단계] Git 상태 확인 중...
git status --short
echo.

echo ========================================
echo 정리 완료!
echo ========================================
echo.
echo 다음 단계:
echo 1. 변경사항 확인: git status
echo 2. 변경사항 커밋: git add . ^&^& git commit -m "프로젝트 정리"
echo 3. GitHub에 푸시: git push
echo.
pause
