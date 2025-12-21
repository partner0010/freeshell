@echo off
chcp 65001 >nul
echo ========================================
echo package.json 생성 및 의존성 추가
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo [1/3] package.json 확인...
if exist "package.json" (
    echo ✅ package.json 파일이 존재합니다.
    echo    파일을 확인하고 의존성을 추가합니다...
    echo.
    type package.json
    echo.
    echo.
    echo ⚠️  package.json에 다음을 추가해야 합니다:
    echo    "next-auth": "^4.24.5"
    echo    "bcryptjs": "^2.4.3"
    echo    "@types/bcryptjs": "^2.4.6"
    echo.
    echo 수동으로 package.json을 수정하거나 아래 명령을 실행하세요:
    echo    npm install next-auth@4 bcryptjs @types/bcryptjs
    echo.
) else (
    echo ❌ package.json 파일이 없습니다!
    echo.
    echo package.json을 생성합니다...
    echo.
    echo {
    echo   "name": "freeshell",
    echo   "version": "2.0.0",
    echo   "private": true,
    echo   "scripts": {
    echo     "dev": "next dev",
    echo     "build": "next build",
    echo     "start": "next start",
    echo     "lint": "next lint"
    echo   },
    echo   "dependencies": {
    echo     "next": "14.2.35",
    echo     "react": "^18.2.0",
    echo     "react-dom": "^18.2.0",
    echo     "next-auth": "^4.24.5",
    echo     "bcryptjs": "^2.4.3",
    echo     "@prisma/client": "^5.0.0"
    echo   },
    echo   "devDependencies": {
    echo     "@types/node": "^20.0.0",
    echo     "@types/react": "^18.2.0",
    echo     "@types/react-dom": "^18.2.0",
    echo     "@types/bcryptjs": "^2.4.6",
    echo     "typescript": "^5.0.0",
    echo     "prisma": "^5.0.0"
    echo   }
    echo }
    echo.
    echo ⚠️  위 내용으로 package.json을 생성하세요.
    echo.
)
echo.

echo [2/3] 의존성 설치...
if exist "package.json" (
    echo npm install 실행 중...
    call npm install next-auth@4 bcryptjs @types/bcryptjs
    if errorlevel 1 (
        echo ❌ 의존성 설치 실패
        pause
        exit /b 1
    )
    echo ✅ 의존성 설치 완료
) else (
    echo ⚠️  package.json이 없어 의존성을 설치할 수 없습니다.
    echo    먼저 package.json을 생성하세요.
)
echo.

echo [3/3] 빌드 테스트...
if exist "package.json" (
    echo npm run build 실행 중...
    call npm run build
    if errorlevel 1 (
        echo.
        echo ❌ 빌드 실패!
        echo    위의 오류 메시지를 확인하세요.
        echo.
        pause
        exit /b 1
    ) else (
        echo.
        echo ✅ 빌드 성공!
        echo.
        echo 이제 배포할 수 있습니다.
        echo.
    )
) else (
    echo ⚠️  package.json이 없어 빌드를 테스트할 수 없습니다.
)
echo.

pause

