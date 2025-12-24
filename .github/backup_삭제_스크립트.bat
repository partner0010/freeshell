@echo off
chcp 65001 >nul
echo ========================================
echo backup 폴더 삭제 스크립트
echo ========================================
echo.
echo [주의] backup 폴더의 모든 파일(178개)이 삭제됩니다.
echo.
echo 삭제하시겠습니까? (Y/N)
set /p confirm=
if /i "%confirm%"=="Y" (
    if exist "backup" (
        echo backup 폴더 삭제 중...
        rmdir /s /q backup
        if exist "backup" (
            echo [오류] backup 폴더 삭제 실패
        ) else (
            echo [완료] backup 폴더 삭제 완료!
        )
    ) else (
        echo backup 폴더가 존재하지 않습니다.
    )
) else (
    echo 삭제를 취소했습니다.
)
echo.
pause

