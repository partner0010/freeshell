# 🆕 깨끗한 새 시작 가이드

기존 자료를 모두 지우고 완전히 새로 배포하는 방법입니다.

## 🗑️ 1단계: 기존 자료 정리

### GitHub 저장소 정리

**옵션 A: 저장소 완전 삭제 (권장)**
1. GitHub 접속: https://github.com
2. `freeshell` 저장소로 이동
3. Settings → 맨 아래 "Delete this repository" 클릭
4. 저장소 이름 입력하여 삭제 확인
5. **새 저장소 생성** (아래 2단계 참고)

**옵션 B: 저장소 내용만 삭제**
1. GitHub 저장소에서 모든 파일 선택
2. "Delete" 클릭하여 삭제
3. 기존 저장소에 새 파일 푸시

### Vercel 프로젝트 정리

**옵션 A: 프로젝트 완전 삭제 (권장)**
1. Vercel 접속: https://vercel.com
2. `freeshell` 프로젝트로 이동
3. Settings → 맨 아래 "Delete Project" 클릭
4. 프로젝트 이름 입력하여 삭제 확인
5. **새 프로젝트 생성** (아래 3단계 참고)

**옵션 B: 프로젝트 재배포**
1. Vercel 프로젝트 설정에서 환경 변수 확인
2. 새 코드로 재배포

## 🆕 2단계: GitHub 새 저장소 생성

1. GitHub 접속: https://github.com
2. 우측 상단 "+" → "New repository"
3. Repository name: `freeshell` 입력
4. Public 또는 Private 선택
5. **"Initialize this repository with" 체크박스 모두 해제** (중요!)
6. "Create repository" 클릭

## 📤 3단계: 로컬에서 새 코드 푸시

터미널에서 다음 명령어 실행:

```bash
# 1. Git 초기화 (기존 .git 폴더가 있으면 삭제 후)
if (Test-Path .git) {
    Remove-Item -Path .git -Recurse -Force
}
git init

# 2. 모든 파일 추가
git add .

# 3. 커밋
git commit -m "Initial commit: Freeshell v2.0 - Complete rewrite"

# 4. 원격 저장소 추가 (GitHub에서 생성한 저장소 URL 사용)
git remote add origin https://github.com/당신의사용자명/freeshell.git

# 5. 푸시
git branch -M main
git push -u origin main
```

## 🚀 4단계: Vercel 새 프로젝트 생성

1. Vercel 접속: https://vercel.com
2. "Add New Project" 클릭
3. 방금 만든 GitHub 저장소 `freeshell` 선택
4. "Import" 클릭

## ⚙️ 5단계: Vercel 환경 변수 설정

프로젝트 설정 → Environment Variables에서 다음 추가:

- `GOOGLE_CLIENT_ID` = Google에서 복사한 값
- `GOOGLE_CLIENT_SECRET` = Google에서 복사한 값
- `NEXTAUTH_SECRET` = .env 파일에 있는 값
- `NEXTAUTH_URL` = `https://freeshell.co.kr`
- `NEXT_PUBLIC_DOMAIN` = `freeshell.co.kr`

## 🌐 6단계: 배포 및 도메인 연결

1. "Deploy" 버튼 클릭
2. 배포 완료 대기
3. Settings → Domains에서 `freeshell.co.kr` 추가
4. DNS 설정 (도메인 제공업체에서)

## ✅ 완료!

이제 완전히 새로운 버전으로 배포되었습니다!

