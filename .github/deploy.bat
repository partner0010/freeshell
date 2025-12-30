@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ========================================
REM Shell Quick Deploy - 완전 재작성 버전
REM ========================================

REM 배치 파일이 있는 디렉토리의 절대 경로 가져오기
set "BATCH_DIR=%~dp0"
set "BATCH_DIR=!BATCH_DIR:~0,-1!"

REM 프로젝트 루트 디렉토리 찾기 (배치 파일이 .github 폴더에 있다고 가정)
if exist "!BATCH_DIR!\..\package.json" (
    set "PROJECT_ROOT=!BATCH_DIR!\.."
) else if exist "!BATCH_DIR!\..\..\package.json" (
    set "PROJECT_ROOT=!BATCH_DIR!\..\.."
) else (
    REM 현재 디렉토리에서 찾기
    if exist "package.json" (
        set "PROJECT_ROOT=%CD%"
    ) else (
        echo [ERROR] 프로젝트 루트를 찾을 수 없습니다.
        echo 배치 파일 위치: !BATCH_DIR!
        echo 현재 디렉토리: %CD%
        pause
        exit /b 1
    )
)

REM 프로젝트 루트로 이동
cd /d "!PROJECT_ROOT!"
set "PROJECT_ROOT=%CD%"

cls
echo ========================================
echo Shell Quick Deploy
echo ========================================
echo.
echo 프로젝트 루트: %PROJECT_ROOT%
echo.

REM 필수 파일 존재 확인
if not exist "package.json" (
    echo [ERROR] package.json을 찾을 수 없습니다.
    echo 위치: %PROJECT_ROOT%
    pause
    exit /b 1
)

if not exist "app" (
    echo [ERROR] app 디렉토리를 찾을 수 없습니다.
    echo 위치: %PROJECT_ROOT%
    pause
    exit /b 1
)

REM Git 저장소 확인 및 초기화
REM 현재 디렉토리에 .git 폴더가 있는지 확인
if not exist ".git" (
    echo [INFO] Git 저장소가 없습니다. 초기화 중...
    git init
    if errorlevel 1 (
        echo [ERROR] Git 초기화 실패
        pause
        exit /b 1
    )
    echo Git 저장소 초기화 완료
) else (
    echo Git 저장소 확인 완료
)
echo.

REM 원격 저장소 설정
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo [INFO] 원격 저장소 설정 중...
    git remote add origin https://github.com/partner0010/freeshell.git
    if errorlevel 1 (
        echo [WARNING] 원격 저장소 추가 실패 (이미 존재할 수 있음)
    )
)

echo [1/4] 의존성 확인 및 설치...
echo.

REM 의존성 확인
if not exist "node_modules\.bin\next.cmd" (
    echo node_modules가 없거나 불완전합니다. 설치 중...
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install 실패!
        pause
        exit /b 1
    )
    echo 의존성 설치 완료!
) else (
    echo 의존성 확인 완료
)
echo.

echo [2/4] 빌드 테스트...
echo.

REM .next 폴더 정리
if exist ".next" (
    echo .next 폴더 삭제 중...
    rmdir /s /q .next 2>nul
)

echo 빌드 시작 (몇 분 소요될 수 있습니다)...
set NODE_OPTIONS=--max-old-space-size=4096
call npm run build
if errorlevel 1 (
    echo.
    echo [ERROR] 빌드 실패!
    echo.
    pause
    exit /b 1
)
echo 빌드 성공!
echo.

echo [3/4] Git 커밋...
echo.

REM 현재 브랜치 확인
for /f "tokens=*" %%i in ('git rev-parse --abbrev-ref HEAD 2^>nul') do set "CURRENT_BRANCH=%%i"
if "!CURRENT_BRANCH!"=="" (
    git checkout -b master 2>nul
    set "CURRENT_BRANCH=master"
)

echo 현재 브랜치: !CURRENT_BRANCH!
echo.

REM 필수 파일 강제 추가
echo 필수 파일 추가 중...
git add -f package.json
if exist "netlify.toml" (
    git add -f netlify.toml
)

REM 모든 변경사항 추가
git add -A

REM 커밋 메시지 입력
echo 커밋 메시지를 입력하세요 (Enter: 기본값 사용):
set /p "COMMIT_MSG="
if "!COMMIT_MSG!"=="" set "COMMIT_MSG=Shell updates and improvements"

REM 커밋
git commit -m "!COMMIT_MSG!"
if errorlevel 1 (
    echo [WARNING] 커밋 실패 또는 변경사항 없음
    git status --short
) else (
    echo 커밋 완료!
)
echo.

echo [4/4] GitHub로 푸시...
echo.

REM master 브랜치로 푸시
echo !CURRENT_BRANCH! 브랜치로 푸시 중...
call git push -u origin !CURRENT_BRANCH!
if errorlevel 1 (
    echo [WARNING] 첫 푸시 실패, 일반 푸시 시도 중...
    call git push origin !CURRENT_BRANCH!
    if errorlevel 1 (
        echo [ERROR] 푸시 실패!
        echo.
        echo 문제 해결:
        echo 1. GitHub 인증 확인
        echo 2. 저장소 권한 확인
        echo 3. 브랜치 이름 확인: !CURRENT_BRANCH!
        echo.
        pause
        exit /b 1
    )
)
echo !CURRENT_BRANCH! 브랜치 푸시 완료!
echo.

REM master 브랜치인 경우 main 브랜치로도 푸시
if /i "!CURRENT_BRANCH!"=="master" (
    echo main 브랜치로도 푸시 중 (Netlify용)...
    call git push origin master:main --force-with-lease
    if errorlevel 1 (
        echo [WARNING] force push 실패, 일반 push 시도 중...
        call git push origin master:main
        if errorlevel 1 (
            echo [ERROR] main 브랜치 푸시 실패!
            echo Netlify는 main 브랜치를 모니터링합니다.
            echo.
        ) else (
            echo main 브랜치 푸시 완료!
        )
    ) else (
        echo main 브랜치 푸시 완료!
    )
    echo.
)

echo ========================================
echo [SUCCESS] 배포 준비 완료!
echo ========================================
echo.
echo GitHub 저장소 확인:
echo https://github.com/partner0010/freeshell/blob/main/package.json
echo https://github.com/partner0010/freeshell/blob/main/netlify.toml
echo.
echo Netlify:
echo - 대시보드: https://app.netlify.com
echo - 자동 배포 시작 (1-2분 소요)
echo - 도메인: https://freeshell.co.kr
echo.
echo ========================================
echo.

pause
