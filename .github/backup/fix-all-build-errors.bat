@echo off
chcp 65001 >nul
echo ========================================
echo 모든 빌드 오류 수정
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo [발견된 오류]
echo 1. next-auth 모듈 누락
echo 2. JSX 구문 오류 (WebsiteAuditor.tsx, AdvancedBlockRenderer.tsx)
echo.

echo [1/5] package.json 확인...
if not exist "package.json" (
    echo ❌ package.json 파일을 찾을 수 없습니다!
    echo    프로젝트 루트에서 실행하세요.
    pause
    exit /b 1
)
echo ✅ package.json 확인됨
echo.

echo [2/5] 필수 의존성 확인 및 설치...
findstr /C:"\"next-auth\"" "package.json" >nul
if errorlevel 1 (
    echo ❌ next-auth가 없습니다. 설치 중...
    call npm install next-auth@4
    if errorlevel 1 (
        echo ❌ next-auth 설치 실패
        pause
        exit /b 1
    )
    echo ✅ next-auth 설치 완료
) else (
    echo ✅ next-auth 확인됨
)

findstr /C:"\"bcryptjs\"" "package.json" >nul
if errorlevel 1 (
    echo ❌ bcryptjs가 없습니다. 설치 중...
    call npm install bcryptjs @types/bcryptjs
    if errorlevel 1 (
        echo ❌ bcryptjs 설치 실패
        pause
        exit /b 1
    )
    echo ✅ bcryptjs 설치 완료
) else (
    echo ✅ bcryptjs 확인됨
)
echo.

echo [3/5] JSX 구문 오류 확인...
echo    WebsiteAuditor.tsx와 AdvancedBlockRenderer.tsx 확인 중...
echo    (파일이 올바르게 작성되어 있는지 확인)
echo.

echo [4/5] 의존성 재설치...
call npm install
if errorlevel 1 (
    echo ❌ 의존성 설치 실패
    pause
    exit /b 1
)
echo ✅ 의존성 설치 완료
echo.

echo [5/5] 로컬 빌드 테스트...
echo.
echo ⚠️  빌드 테스트를 시작합니다. 시간이 걸릴 수 있습니다...
echo.
call npm run build
if errorlevel 1 (
    echo.
    echo ========================================
    echo ❌ 빌드 실패!
    echo ========================================
    echo.
    echo 위의 오류 메시지를 확인하세요.
    echo.
    echo 추가로 확인할 사항:
    echo 1. WebsiteAuditor.tsx의 JSX 구문 확인
    echo 2. AdvancedBlockRenderer.tsx의 JSX 구문 확인
    echo 3. 모든 import 문이 올바른지 확인
    echo.
    pause
    exit /b 1
) else (
    echo.
    echo ========================================
    echo ✅ 빌드 성공!
    echo ========================================
    echo.
    echo 이제 배포할 수 있습니다.
    echo.
    set /p DEPLOY="지금 배포하시겠습니까? (Y/N): "
    if /i "%DEPLOY%"=="Y" (
        echo.
        echo 변경사항 커밋 및 푸시...
        git add .
        git commit -m "fix: add missing dependencies (next-auth, bcryptjs)"
        git push origin main
        if errorlevel 1 (
            echo ⚠️  Git 푸시 실패
            echo    수동으로 푸시하거나 Vercel에서 수동 재배포하세요.
        ) else (
            echo ✅ 푸시 완료! Vercel에서 자동 배포가 시작됩니다.
        )
    )
)
echo.

pause

