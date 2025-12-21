@echo off
chcp 65001 >nul
echo ========================================
echo 프로젝트 정리 스크립트
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo [1/5] 현재 상태 확인...
echo.
echo .github 폴더의 파일 수:
dir /b .github\*.md 2>nul | find /c /v ""
echo 개의 .md 파일
dir /b .github\*.bat 2>nul | find /c /v ""
echo 개의 .bat 파일
echo.

echo [2/5] 백업 폴더 생성...
if not exist ".github\backup" mkdir .github\backup
echo ✅ 백업 폴더 생성 완료
echo.

echo [3/5] 핵심 파일만 남기고 나머지 .md 파일 백업...
echo.
echo 보존할 파일:
echo   - 통합_README.md
echo   - 프로젝트_정리_계획.md
echo   - 프로젝트_정리_스크립트.bat
echo.
set /p CONFIRM="다른 .md 파일들을 백업 폴더로 이동하시겠습니까? (Y/N): "
if /i "%CONFIRM%"=="Y" (
    for %%f in (.github\*.md) do (
        if not "%%~nf"=="통합_README" (
            if not "%%~nf"=="프로젝트_정리_계획" (
                move "%%f" ".github\backup\" >nul 2>&1
                echo ✅ %%f 백업 완료
            )
        )
    )
    echo.
    echo ✅ .md 파일 정리 완료
) else (
    echo 건너뜀
)
echo.

echo [4/5] 핵심 파일만 남기고 나머지 .bat 파일 백업...
echo.
echo 보존할 파일:
echo   - 프로젝트_정리_스크립트.bat
echo   - 최종_해결_방법_자동화.bat
echo.
set /p CONFIRM2="다른 .bat 파일들을 백업 폴더로 이동하시겠습니까? (Y/N): "
if /i "%CONFIRM2%"=="Y" (
    for %%f in (.github\*.bat) do (
        if not "%%~nf"=="프로젝트_정리_스크립트" (
            if not "%%~nf"=="최종_해결_방법_자동화" (
                move "%%f" ".github\backup\" >nul 2>&1
                echo ✅ %%f 백업 완료
            )
        )
    )
    echo.
    echo ✅ .bat 파일 정리 완료
) else (
    echo 건너뜀
)
echo.

echo [5/5] 정리 결과 확인...
echo.
echo .github 폴더의 남은 파일:
dir /b .github\*.md 2>nul
dir /b .github\*.bat 2>nul
echo.
echo 백업 폴더의 파일:
dir /b .github\backup\*.md 2>nul | find /c /v ""
echo 개의 .md 파일
dir /b .github\backup\*.bat 2>nul | find /c /v ""
echo 개의 .bat 파일
echo.

echo ========================================
echo 정리 완료!
echo ========================================
echo.
echo 다음 단계:
echo 1. Git에 커밋 및 푸시
echo 2. Vercel에서 재배포
echo.
pause

