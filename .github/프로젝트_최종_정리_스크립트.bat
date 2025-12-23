@echo off
chcp 65001 >nul
echo ========================================
echo 프로젝트 최종 정리 스크립트
echo ========================================
echo.

cd /d "%~dp0\.."

echo [1/5] 불필요한 배치 파일 정리...
echo.

REM .github 폴더의 중복 배치 파일 정리 (backup 폴더로 이동)
if exist ".github\backup" (
    echo backup 폴더가 이미 존재합니다.
) else (
    mkdir ".github\backup"
)

REM 중복되거나 불필요한 배치 파일들을 backup으로 이동
echo 중복 배치 파일을 backup 폴더로 이동 중...
move /Y ".github\auto-fix-all.bat" ".github\backup\" >nul 2>&1
move /Y ".github\auto-fix-git.bat" ".github\backup\" >nul 2>&1
move /Y ".github\fix-axios-and-push.bat" ".github\backup\" >nul 2>&1
move /Y ".github\fix-git-push.bat" ".github\backup\" >nul 2>&1
move /Y ".github\fix-netlify-deploy.bat" ".github\backup\" >nul 2>&1
move /Y ".github\모든_누락_패키지_한번에_추가.bat" ".github\backup\" >nul 2>&1
move /Y ".github\즉시_수정_스크립트.bat" ".github\backup\" >nul 2>&1
move /Y ".github\최종_해결_스크립트.bat" ".github\backup\" >nul 2>&1
move /Y ".github\최종_해결_방법_자동화.bat" ".github\backup\" >nul 2>&1
move /Y ".github\프로젝트_전체_정리_스크립트.bat" ".github\backup\" >nul 2>&1
move /Y ".github\프로젝트_전체_정리_자동화.bat" ".github\backup\" >nul 2>&1
move /Y ".github\프로젝트_정리_스크립트.bat" ".github\backup\" >nul 2>&1

echo [2/5] 중복 가이드 문서 정리...
echo.

REM 중복되거나 오래된 가이드 문서들을 backup으로 이동
move /Y ".github\Netlify_배포_실패_해결_최종.md" ".github\backup\" >nul 2>&1
move /Y ".github\Netlify_배포_실패_해결.md" ".github\backup\" >nul 2>&1
move /Y ".github\Netlify_배포_실패_확인_가이드.md" ".github\backup\" >nul 2>&1
move /Y ".github\Netlify_배포_확인_가이드.md" ".github\backup\" >nul 2>&1
move /Y ".github\Netlify_빌드_오류_axios_해결.md" ".github\backup\" >nul 2>&1
move /Y ".github\Netlify_빌드_오류_openai_해결.md" ".github\backup\" >nul 2>&1
move /Y ".github\Netlify_빌드_오류_해결.md" ".github\backup\" >nul 2>&1
move /Y ".github\Netlify_설정_상세_확인.md" ".github\backup\" >nul 2>&1
move /Y ".github\Netlify_설정_최종_확인.md" ".github\backup\" >nul 2>&1
move /Y ".github\Netlify_설정_확인_결과.md" ".github\backup\" >nul 2>&1
move /Y ".github\Netlify_설정_확인_체크리스트.md" ".github\backup\" >nul 2>&1
move /Y ".github\Netlify_전환_가이드.md" ".github\backup\" >nul 2>&1
move /Y ".github\Netlify_전환_즉시_가이드.md" ".github\backup\" >nul 2>&1
move /Y ".github\Netlify_CNAME_값_확인_가이드.md" ".github\backup\" >nul 2>&1
move /Y ".github\Netlify_DNS_설정_방법.md" ".github\backup\" >nul 2>&1
move /Y ".github\Netlify_대시보드_확인_가이드.md" ".github\backup\" >nul 2>&1
move /Y ".github\Netlify_도메인_추가_가이드.md" ".github\backup\" >nul 2>&1
move /Y ".github\Netlify_도메인_추가_간단_가이드.md" ".github\backup\" >nul 2>&1
move /Y ".github\가비아_CNAME_오류_해결.md" ".github\backup\" >nul 2>&1
move /Y ".github\가비아_DNS_설정_가이드.md" ".github\backup\" >nul 2>&1
move /Y ".github\Git_충돌_해결_가이드.md" ".github\backup\" >nul 2>&1
move /Y ".github\Git_푸시_오류_해결.md" ".github\backup\" >nul 2>&1
move /Y ".github\JSON_오류_수정_가이드.md" ".github\backup\" >nul 2>&1
move /Y ".github\도메인_접속_상태_확인.md" ".github\backup\" >nul 2>&1
move /Y ".github\도메인_접속_확인_가이드.md" ".github\backup\" >nul 2>&1
move /Y ".github\빌드_오류_전체_확인_가이드.md" ".github\backup\" >nul 2>&1
move /Y ".github\최종_해결책.md" ".github\backup\" >nul 2>&1
move /Y ".github\긴급_수정_필요.md" ".github\backup\" >nul 2>&1
move /Y ".github\정리_완료_요약.md" ".github\backup\" >nul 2>&1
move /Y ".github\프로젝트_정리_가이드.md" ".github\backup\" >nul 2>&1
move /Y ".github\프로젝트_정리_계획.md" ".github\backup\" >nul 2>&1
move /Y ".github\프로젝트_정리_완료_가이드.md" ".github\backup\" >nul 2>&1
move /Y ".github\프로젝트_최종_정리_및_점검.md" ".github\backup\" >nul 2>&1

echo [3/5] 필수 파일 확인...
echo.

REM 필수 파일들이 프로젝트 루트에 있는지 확인
if not exist "package.json" (
    echo [경고] package.json이 루트에 없습니다. .github에서 복사합니다...
    copy /Y ".github\package.json" "package.json" >nul 2>&1
)

if not exist "netlify.toml" (
    echo [경고] netlify.toml이 루트에 없습니다. .github에서 복사합니다...
    copy /Y ".github\netlify.toml" "netlify.toml" >nul 2>&1
)

if not exist "prisma\schema.prisma" (
    echo [경고] prisma\schema.prisma가 루트에 없습니다. .github에서 복사합니다...
    if not exist "prisma" mkdir "prisma"
    copy /Y ".github\prisma\schema.prisma" "prisma\schema.prisma" >nul 2>&1
)

if not exist "tsconfig.json" (
    echo [경고] tsconfig.json이 루트에 없습니다. .github에서 복사합니다...
    copy /Y ".github\tsconfig.json" "tsconfig.json" >nul 2>&1
)

echo [4/5] .github 폴더 정리...
echo.

REM .github 폴더에는 필수 파일만 남기기
REM vercel.json은 더 이상 사용하지 않으므로 backup으로 이동
if exist ".github\vercel.json" (
    move /Y ".github\vercel.json" ".github\backup\" >nul 2>&1
)

echo [5/5] 정리 완료!
echo.
echo ========================================
echo 정리 결과:
echo - 중복 파일들은 .github\backup 폴더로 이동되었습니다
echo - 필수 파일들은 프로젝트 루트에 확인되었습니다
echo ========================================
echo.
pause

