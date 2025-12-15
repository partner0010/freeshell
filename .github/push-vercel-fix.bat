@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo vercel.json 수정사항 푸시
echo ========================================
echo.

echo [1/5] Git 상태 확인...
git status

echo.
echo [2/5] 변경사항 추가...
git add vercel.json .github/vercel.json

echo.
echo [3/5] 변경사항 커밋...
git commit -m "fix: vercel.json rewrites 설정 제거 (404 오류 수정)"

echo.
echo [4/5] GitHub에 푸시...
git push origin main

echo.
echo [5/5] 완료!
echo Vercel이 자동으로 재배포를 시작합니다.
echo.
pause

