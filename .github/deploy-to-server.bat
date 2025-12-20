@echo off
chcp 65001 >nul
echo ========================================
echo Freeshell 서버 배포 시작
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] Git 상태 확인...
git status
echo.

echo [2/5] 변경사항 추가...
git add .
if %errorlevel% neq 0 (
    echo 오류: git add 실패
    pause
    exit /b 1
)
echo.

echo [3/5] 커밋 생성...
git commit -m "feat: GENSPARK AI 디자인 적용 및 새로운 AI 서비스 통합

- GENSPARK AI 스타일의 글로벌 디자인 적용
- Rewritify AI 통합 (텍스트 인간화)
- Hugging Face Inference API 통합
- Replicate API 통합
- AI 에이전트 시스템 구현
- 메뉴 재구성 및 최적화
- 전체 디버깅 및 오류 수정"
if %errorlevel% neq 0 (
    echo 경고: 커밋 실패 (변경사항이 없을 수 있음)
)
echo.

echo [4/5] 원격 저장소로 푸시...
git push origin main
if %errorlevel% neq 0 (
    echo 원격 저장소가 main이 아닐 수 있습니다. master를 시도합니다...
    git push origin master
    if %errorlevel% neq 0 (
        echo 오류: git push 실패
        echo 현재 브랜치를 확인하세요: git branch
        pause
        exit /b 1
    )
)
echo.

echo [5/5] 배포 완료!
echo.
echo ========================================
echo 모든 변경사항이 서버에 반영되었습니다.
echo ========================================
echo.
pause

