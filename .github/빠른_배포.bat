@echo off
REM UTF-8 인코딩 설정 (실패 시 계속 진행)
chcp 65001 >nul 2>&1
if errorlevel 1 chcp 949 >nul 2>&1
cls
echo ========================================
echo Freeshell 빠른 배포
echo ========================================
echo.

REM .github 폴더에서 실행 중이면 프로젝트 루트로 이동
if exist "..\package.json" (
    cd ..
    echo 프로젝트 루트로 이동: %CD%
    echo.
) else if exist "..\..\package.json" (
    cd ..\..
    echo 프로젝트 루트로 이동: %CD%
    echo.
)

REM 프로젝트 루트 확인
if not exist "package.json" (
    echo [오류] package.json 파일을 찾을 수 없습니다.
    echo 현재 위치: %CD%
    echo 프로젝트 루트 폴더에서 실행해주세요.
    pause
    exit /b 1
)

if not exist "src\app" (
    echo [오류] src\app 디렉토리를 찾을 수 없습니다.
    echo 현재 위치: %CD%
    pause
    exit /b 1
)

echo 현재 작업 디렉토리: %CD%
echo.

echo [1/4] 빌드 테스트...
echo.
echo .next 폴더 정리 중...
if exist ".next" rmdir /s /q .next 2>nul
echo.

echo 빌드 시작 (시간이 걸릴 수 있습니다)...
set NODE_OPTIONS=--max-old-space-size=4096
call npm run build
if errorlevel 1 (
    echo [오류] 빌드 실패! 오류를 확인하고 수정해주세요.
    echo.
    echo 문제 해결:
    echo 1. .next 폴더 삭제: rmdir /s /q .next
    echo 2. node_modules 재설치: rmdir /s /q node_modules ^&^& npm install
    echo 3. TypeScript 오류 확인: npx tsc --noEmit
    echo.
    pause
    exit /b 1
)
echo 빌드 성공!
echo.

echo [2/4] Git 상태 확인...
git status
echo.

echo [3/4] 변경사항 커밋...
echo Enter commit message (default: "Feature updates and improvements"):
echo 커밋 메시지를 입력하세요 (기본: "기능 추가 및 개선"):
set /p commit_msg=
if "%commit_msg%"=="" set commit_msg=Feature updates and improvements

git add .
git commit -m "%commit_msg%"
if errorlevel 1 (
    echo [경고] 커밋 실패 또는 변경사항이 없습니다.
) else (
    echo 커밋 완료!
)
echo.

echo [4/4] GitHub에 푸시...
REM 현재 브랜치 이름 가져오기
for /f "tokens=*" %%i in ('git branch --show-current 2^>nul') do set current_branch=%%i
if "%current_branch%"=="" (
    for /f "tokens=*" %%i in ('git rev-parse --abbrev-ref HEAD 2^>nul') do set current_branch=%%i
)
if "%current_branch%"=="" set current_branch=main

echo 현재 브랜치: %current_branch%
echo GitHub에 푸시하시겠습니까? (Y/N)
set /p push_confirm=
if /i "%push_confirm%"=="Y" (
    git push origin %current_branch%
    if errorlevel 1 (
        echo [오류] 푸시 실패!
        echo 브랜치 이름을 확인하세요: git branch
        echo 푸시 시도한 브랜치: %current_branch%
        pause
        exit /b 1
    )
    echo.
    echo ========================================
    echo [성공] GitHub에 푸시 완료!
    echo.
    echo Netlify/Vercel에 연결되어 있다면 자동으로 배포가 시작됩니다.
    echo 배포 상태는 각 플랫폼의 대시보드에서 확인하세요.
    echo ========================================
) else (
    echo 푸시를 건너뜁니다.
)

echo.
pause
