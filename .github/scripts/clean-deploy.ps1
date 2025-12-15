# 깨끗한 새 배포 스크립트

Write-Host "🧹 깨끗한 새 배포 준비 중..." -ForegroundColor Cyan
Write-Host ""

# 1. Git 초기화 확인
Write-Host "[1/5] Git 상태 확인..." -ForegroundColor Yellow
if (Test-Path .git) {
    Write-Host "   기존 Git 저장소 발견" -ForegroundColor Yellow
    $response = Read-Host "   기존 Git 저장소를 삭제하고 새로 시작하시겠습니까? (y/n)"
    if ($response -eq "y" -or $response -eq "Y") {
        Remove-Item -Path .git -Recurse -Force
        Write-Host "   ✅ 기존 Git 저장소 삭제 완료" -ForegroundColor Green
    }
}

# 2. node_modules 및 빌드 파일 정리
Write-Host "[2/5] 불필요한 파일 정리..." -ForegroundColor Yellow
$cleanDirs = @("node_modules", ".next", "dist", "build")
foreach ($dir in $cleanDirs) {
    if (Test-Path $dir) {
        Write-Host "   $dir 삭제 중..." -ForegroundColor Gray
        Remove-Item -Path $dir -Recurse -Force -ErrorAction SilentlyContinue
    }
}
Write-Host "   ✅ 정리 완료" -ForegroundColor Green

# 3. .env 파일 확인
Write-Host "[3/5] 환경 변수 파일 확인..." -ForegroundColor Yellow
if (-not (Test-Path .env)) {
    Write-Host "   ⚠️  .env 파일이 없습니다. 생성합니다..." -ForegroundColor Yellow
    $envContent = @"
# Google OAuth 설정
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# NextAuth 설정
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# 프로덕션 도메인
NEXT_PUBLIC_DOMAIN=freeshell.co.kr

# 환경 설정
NODE_ENV=development
"@
    $envContent | Out-File -FilePath .env -Encoding utf8
    Write-Host "   ✅ .env 파일 생성 완료" -ForegroundColor Green
} else {
    Write-Host "   ✅ .env 파일 존재" -ForegroundColor Green
}

# 4. 필수 파일 확인
Write-Host "[4/5] 필수 파일 확인..." -ForegroundColor Yellow
$requiredFiles = @("package.json", "next.config.js", "tsconfig.json", "tailwind.config.js", "postcss.config.js")
$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    }
}
if ($missingFiles.Count -gt 0) {
    Write-Host "   ❌ 누락된 파일: $($missingFiles -join ', ')" -ForegroundColor Red
    Write-Host "   ⚠️  필수 파일을 먼저 생성해주세요." -ForegroundColor Yellow
} else {
    Write-Host "   ✅ 모든 필수 파일 존재" -ForegroundColor Green
}

# 5. Git 초기화 및 준비
Write-Host "[5/5] Git 초기화..." -ForegroundColor Yellow
if (-not (Test-Path .git)) {
    git init
    Write-Host "   ✅ Git 초기화 완료" -ForegroundColor Green
} else {
    Write-Host "   ✅ Git 이미 초기화됨" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ 준비 완료!" -ForegroundColor Green
Write-Host ""
Write-Host "다음 단계:" -ForegroundColor Cyan
Write-Host "1. npm install" -ForegroundColor White
Write-Host "2. .env 파일에 Google OAuth 정보 입력" -ForegroundColor White
Write-Host "3. git add ." -ForegroundColor White
Write-Host "4. git commit -m 'Initial commit: Freeshell v2.0'" -ForegroundColor White
Write-Host "5. GitHub에 새 저장소 생성 후 푸시" -ForegroundColor White
Write-Host "6. Vercel에서 새 프로젝트 생성 및 배포" -ForegroundColor White
Write-Host ""

