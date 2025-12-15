@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo 프로젝트 구조 수정 및 푸시
echo ========================================
echo.

echo [1/5] Git 상태 확인...
git status

echo.
echo [2/5] 모든 변경사항 추가...
git add -A

echo.
echo [3/5] 변경사항 커밋...
git commit -m "fix: 프로젝트 루트에 설정 파일 추가 (package.json, next.config.js 등)"

echo.
echo [4/5] GitHub에 푸시...
git push origin main

echo.
echo [5/5] 완료!
echo Vercel이 자동으로 재배포를 시작합니다.
echo.
pause

