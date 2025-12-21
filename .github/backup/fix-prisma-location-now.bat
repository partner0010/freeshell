@echo off
chcp 65001 >nul
echo ========================================
echo Prisma Schema 표준 위치로 이동 (긴급)
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo [문제] Prisma schema가 .github/prisma에만 있어서 Vercel이 찾지 못함
echo [해결] 프로젝트 루트의 prisma/schema.prisma로 이동 필요
echo.

echo [1/4] 현재 위치 확인...
cd /d "%~dp0"
cd ..
echo 현재 위치: %CD%
echo.

echo [2/4] prisma 폴더 확인...
if exist "prisma\schema.prisma" (
    echo ✅ prisma\schema.prisma 파일이 이미 존재합니다!
    echo    파일 내용을 확인하세요.
    echo.
    type "prisma\schema.prisma" | findstr /C:"generator client" >nul
    if errorlevel 1 (
        echo ⚠️  파일이 비어있거나 잘못된 것 같습니다.
        echo    .github\prisma\schema.prisma를 복사합니다...
        copy ".github\prisma\schema.prisma" "prisma\schema.prisma" /Y
        echo ✅ 복사 완료
    ) else (
        echo ✅ 파일 내용 확인됨
    )
) else (
    echo [2/4] prisma 폴더 생성...
    if not exist "prisma" (
        mkdir prisma
        echo ✅ prisma 폴더 생성됨
    )
    echo.
    echo [3/4] schema.prisma 복사...
    if exist ".github\prisma\schema.prisma" (
        copy ".github\prisma\schema.prisma" "prisma\schema.prisma" /Y
        echo ✅ schema.prisma 복사 완료
    ) else (
        echo ❌ .github\prisma\schema.prisma 파일을 찾을 수 없습니다!
        pause
        exit /b 1
    )
)
echo.

echo [4/4] 파일 확인...
if exist "prisma\schema.prisma" (
    echo ✅ prisma\schema.prisma 파일 확인됨
    echo.
    echo 파일 크기:
    dir "prisma\schema.prisma" | findstr "schema.prisma"
) else (
    echo ❌ prisma\schema.prisma 파일 생성 실패!
    pause
    exit /b 1
)
echo.

echo ========================================
echo ✅ Prisma Schema 위치 수정 완료!
echo ========================================
echo.
echo 다음 단계:
echo   1. git add prisma/schema.prisma
echo   2. git commit -m "fix: move Prisma schema to standard location"
echo   3. git push origin main
echo.
echo 또는 자동으로 진행하려면:
echo   .github\deploy-prisma-fix.bat
echo.
pause

