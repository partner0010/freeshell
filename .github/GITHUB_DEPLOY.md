# GitHub 배포 가이드

## 📋 GitHub에 코드 업로드하기

### 1단계: Git 초기화 (이미 되어 있다면 생략)

```bash
# 프로젝트 루트에서
git init
```

### 2단계: GitHub 저장소 생성

1. [GitHub](https://github.com) 접속
2. 우측 상단 "+" → "New repository" 클릭
3. 저장소 정보 입력:
   - **Repository name**: `freeshell`
   - **Description**: "Freeshell - 통합 AI 웹 개발 플랫폼"
   - **Visibility**: Public 또는 Private 선택
   - **Initialize this repository with**: 체크하지 않음 (이미 파일이 있음)
4. "Create repository" 클릭

### 3단계: 로컬 코드 커밋 및 푸시

```bash
# 모든 파일 추가
git add .

# 커밋 메시지 작성
git commit -m "Initial commit: Freeshell v2.0 - Complete rewrite with Next.js 14, TypeScript, and modern features"

# 원격 저장소 추가 (your-username을 실제 GitHub 사용자명으로 변경)
git remote add origin https://github.com/your-username/freeshell.git

# 기본 브랜치를 main으로 설정
git branch -M main

# GitHub에 푸시
git push -u origin main
```

### 4단계: Microsoft Edge에서 GitHub 로그인

1. Microsoft Edge 열기
2. `partner0010@gmail.com` 계정으로 로그인되어 있는지 확인
3. GitHub 접속: https://github.com
4. 우측 상단 "Sign in" 클릭
5. Google 계정으로 로그인 (partner0010@gmail.com)
6. GitHub 인증 완료

### 5단계: 저장소 확인

1. GitHub에서 저장소 확인: `https://github.com/your-username/freeshell`
2. 모든 파일이 업로드되었는지 확인
3. README.md가 제대로 표시되는지 확인

## 🔄 업데이트 푸시하기

코드를 수정한 후:

```bash
# 변경사항 확인
git status

# 변경된 파일 추가
git add .

# 커밋
git commit -m "Update: 변경사항 설명"

# GitHub에 푸시
git push origin main
```

## 🌿 브랜치 관리

### 새 기능 개발 시

```bash
# 새 브랜치 생성
git checkout -b feature/new-feature

# 작업 후 커밋
git add .
git commit -m "Add: 새 기능 추가"

# GitHub에 푸시
git push origin feature/new-feature

# GitHub에서 Pull Request 생성
```

### 메인 브랜치로 병합

1. GitHub에서 Pull Request 생성
2. 코드 리뷰 (필요시)
3. "Merge pull request" 클릭
4. 메인 브랜치에 자동으로 반영

## 📝 커밋 메시지 규칙

```
타입: 간단한 설명

예시:
- feat: Google OAuth 인증 추가
- fix: 도메인 설정 오류 수정
- docs: 배포 가이드 추가
- style: 코드 포맷팅
- refactor: 코드 리팩토링
- test: 테스트 코드 추가
```

## 🔐 .env 파일 처리

`.env` 파일은 `.gitignore`에 포함되어 있어 GitHub에 업로드되지 않습니다.

**중요**: 환경 변수는 Vercel에서 직접 설정해야 합니다.

## ✅ 체크리스트

배포 전 확인사항:

- [ ] 모든 파일이 커밋되었는지 확인
- [ ] `.env` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] `node_modules`가 `.gitignore`에 포함되어 있는지 확인
- [ ] README.md가 최신인지 확인
- [ ] package.json 버전이 올바른지 확인
- [ ] GitHub 저장소가 Private/Public으로 올바르게 설정되었는지 확인

## 🚀 Vercel과 자동 연동

GitHub 저장소를 Vercel에 연결하면:

1. **자동 배포**: `main` 브랜치에 푸시할 때마다 자동 배포
2. **Preview 배포**: Pull Request 생성 시 미리보기 배포
3. **빌드 로그**: GitHub에서 직접 빌드 상태 확인

### Vercel 연동 방법

1. Vercel 대시보드 → "Add New Project"
2. "Import Git Repository" 선택
3. GitHub 저장소 선택
4. 프로젝트 설정 확인
5. "Deploy" 클릭

이제 GitHub에 푸시할 때마다 자동으로 배포됩니다!

---

**다음 단계**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)를 참고하여 Vercel 배포 및 도메인 연동을 진행하세요.

