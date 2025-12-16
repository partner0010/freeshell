@echo off
chcp 65001 >nul
cd /d "%~dp0"
git add .
git commit -m "fix: WAFPanel 타입 오류 수정"
git push origin main
pause

