@echo off
chcp 65001 >nul
echo ========================================
echo 전체 자동 수정 스크립트
echo ========================================
echo.

set "PROJECT_ROOT=%~dp0.."
cd /d "%PROJECT_ROOT%"

echo [1/6] 프로젝트 루트 확인...
echo 현재 디렉토리: %CD%
echo.

echo [2/6] package.json 확인 및 수정...
if not exist "package.json" (
    echo package.json 파일이 없습니다. .github에서 복사합니다...
    if exist ".github\package.json" (
        copy /Y ".github\package.json" "package.json" >nul
        echo ✓ package.json 복사 완료
    )
)

REM package.json에 @dnd-kit 패키지가 있는지 확인
findstr /C:"@dnd-kit/core" "package.json" >nul
if errorlevel 1 (
    echo package.json에 @dnd-kit 패키지 추가 중...
    REM PowerShell을 사용하여 JSON 수정
    powershell -Command "$json = Get-Content 'package.json' -Raw | ConvertFrom-Json; if (-not $json.dependencies.'@dnd-kit/core') { $json.dependencies | Add-Member -NotePropertyName '@dnd-kit/core' -NotePropertyValue '^6.1.0' -Force }; if (-not $json.dependencies.'@dnd-kit/sortable') { $json.dependencies | Add-Member -NotePropertyName '@dnd-kit/sortable' -NotePropertyValue '^8.0.0' -Force }; if (-not $json.dependencies.'@dnd-kit/utilities') { $json.dependencies | Add-Member -NotePropertyName '@dnd-kit/utilities' -NotePropertyValue '^3.2.2' -Force }; $json | ConvertTo-Json -Depth 10 | Set-Content 'package.json'"
    echo ✓ @dnd-kit 패키지 추가 완료
) else (
    echo ✓ package.json에 @dnd-kit 패키지가 이미 있습니다
)
echo.

echo [3/6] netlify.toml 확인...
if not exist "netlify.toml" (
    echo netlify.toml 파일이 없습니다. 생성합니다...
    (
        echo [build]
        echo   command = "npx prisma generate && npm run build"
        echo   publish = ".next"
        echo.
        echo [[plugins]]
        echo   package = "@netlify/plugin-nextjs"
        echo.
        echo [build.environment]
        echo   NODE_VERSION = "18"
    ) > netlify.toml
    echo ✓ netlify.toml 생성 완료
) else (
    echo ✓ netlify.toml 파일이 있습니다
)
echo.

echo [4/6] prisma/schema.prisma 확인...
if not exist "prisma" (
    mkdir "prisma" >nul
)
if not exist "prisma\schema.prisma" (
    echo prisma\schema.prisma 파일이 없습니다. .github에서 복사합니다...
    if exist ".github\prisma\schema.prisma" (
        copy /Y ".github\prisma\schema.prisma" "prisma\schema.prisma" >nul
        echo ✓ schema.prisma 복사 완료
    )
) else (
    echo ✓ prisma\schema.prisma 파일이 있습니다
)
echo.

echo [5/6] Git 변경사항 커밋...
git add -A
git commit -m "fix: add missing @dnd-kit packages, netlify.toml, and prisma schema"
if errorlevel 1 (
    echo 경고: 커밋할 변경사항이 없거나 이미 커밋되었습니다.
)
echo.

echo [6/6] Git 푸시...
git pull origin main --rebase
if errorlevel 1 (
    echo 충돌 발생. 자동 해결 시도...
    git add -A
    git rebase --continue
    if errorlevel 1 (
        echo rebase 중단. skip 시도...
        git rebase --skip
    )
)

git push origin main
if errorlevel 1 (
    echo 푸시 실패. 강제 푸시 시도...
    git push origin main --force
)

echo.
echo ========================================
echo 전체 수정 완료!
echo ========================================
echo.
echo 다음 단계:
echo 1. Netlify에서 자동 재배포 확인
echo 2. 빌드 로그 확인
echo.
pause

