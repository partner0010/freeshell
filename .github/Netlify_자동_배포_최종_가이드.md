# ✅ Netlify 자동 배포 최종 가이드

## 🔍 현재 상태 확인

### ✅ 완료된 사항
- ✅ `netlify.toml` 파일이 프로젝트 루트에 있음
- ✅ 빌드 명령어: `npx prisma generate && npm run build`
- ✅ 배포 디렉토리: `.next`
- ✅ Node.js 버전: 18
- ✅ Next.js 플러그인 설정됨

## 🚀 Netlify 대시보드 설정 확인

### 1. 빌드 설정 확인
1. https://app.netlify.com 접속
2. 사이트 선택
3. **Site settings** → **Build & deploy** → **Build settings**

**확인 사항**:
- [ ] **Build command**: `npx prisma generate && npm run build` (또는 비워두기 - netlify.toml 사용)
- [ ] **Publish directory**: `.next` (또는 비워두기 - netlify.toml 사용)
- [ ] **Base directory**: (비워두기)

**참고**: `netlify.toml` 파일이 있으면 대시보드 설정보다 우선합니다.

### 2. GitHub 연동 확인
**Site settings** → **Build & deploy** → **Continuous Deployment**

**확인 사항**:
- [ ] **Branch to deploy**: `main` 또는 `master`
- [ ] **Deploy contexts**: `Production` 설정 확인
- [ ] 저장소가 올바르게 연결되어 있는지 확인

### 3. 환경 변수 확인
**Site settings** → **Build & deploy** → **Environment variables**

**필요한 환경 변수** (프로젝트에 따라 다름):
- [ ] `DATABASE_URL` (Prisma 사용 시)
- [ ] `NEXTAUTH_SECRET` (NextAuth 사용 시)
- [ ] `NEXTAUTH_URL` (NextAuth 사용 시)
- [ ] 기타 필요한 환경 변수

### 4. 플러그인 확인
**Site settings** → **Build & deploy** → **Plugins**

**확인 사항**:
- [ ] `@netlify/plugin-nextjs` 플러그인이 설치되어 있는지 확인
- 없으면 **Add plugin** 클릭하여 설치

## 🔧 문제 해결

### 문제 1: 자동 배포가 시작되지 않음

#### 해결 방법:
1. **GitHub 웹훅 확인**
   - GitHub 저장소 → **Settings** → **Webhooks**
   - Netlify 웹훅이 있는지 확인
   - 없으면 Netlify에서 저장소 다시 연결

2. **수동 배포 테스트**
   - Netlify 대시보드 → **Deploys** 탭
   - **Trigger deploy** → **Deploy site** 클릭
   - 빌드가 성공하는지 확인

3. **GitHub에 푸시 확인**
   - 변경사항을 GitHub에 푸시했는지 확인
   - 푸시한 브랜치가 `main` 또는 `master`인지 확인

### 문제 2: 빌드 실패

#### 해결 방법:
1. **빌드 로그 확인**
   - **Deploys** 탭 → 최근 배포 클릭
   - **Deploy log** 확인
   - 오류 메시지 확인

2. **일반적인 오류**:
   - **Prisma 오류**: `npx prisma generate` 포함 확인 ✅
   - **패키지 오류**: `package.json` 확인
   - **타임아웃**: 빌드 시간 확인 (기본 15분)

### 문제 3: 배포는 되지만 사이트가 작동하지 않음

#### 해결 방법:
1. **배포 디렉토리 확인**
   - `.next` 폴더가 올바른지 확인
   - Next.js 플러그인이 설치되어 있는지 확인

2. **환경 변수 확인**
   - 필요한 환경 변수가 모두 설정되어 있는지 확인

3. **함수 로그 확인**
   - **Functions** 탭에서 API 라우트 오류 확인

## 📋 체크리스트

### 필수 확인 사항
- [ ] `netlify.toml` 파일이 프로젝트 루트에 있음
- [ ] 빌드 명령어에 `npx prisma generate` 포함
- [ ] 배포 디렉토리가 `.next`로 설정됨
- [ ] Next.js 플러그인이 설치됨
- [ ] GitHub 저장소가 연결됨
- [ ] 브랜치가 `main` 또는 `master`로 설정됨
- [ ] 필요한 환경 변수가 설정됨

### Netlify 대시보드 설정
- [ ] 빌드 명령어 확인 (또는 netlify.toml 사용)
- [ ] 배포 디렉토리 확인 (또는 netlify.toml 사용)
- [ ] GitHub 연동 확인
- [ ] 플러그인 설치 확인
- [ ] 환경 변수 설정 확인

## 🚀 다음 단계

### 1. 즉시 확인
1. Netlify 대시보드 접속
2. **Site settings** → **Build & deploy** 확인
3. **Deploys** 탭에서 최근 배포 확인

### 2. 수동 배포 테스트
1. **Deploys** 탭 → **Trigger deploy** → **Deploy site**
2. 빌드 로그 확인
3. 성공 여부 확인

### 3. 자동 배포 테스트
1. 작은 변경사항을 GitHub에 푸시
2. Netlify 대시보드에서 자동 배포 시작 확인
3. 빌드 로그 확인

## 📝 추가 정보

### netlify.toml 파일 위치
```
C:\Users\partn\OneDrive\바탕 화면\Cursor\Freeshell\netlify.toml
```

### 주요 설정
- **빌드 명령어**: `npx prisma generate && npm run build`
- **배포 디렉토리**: `.next`
- **Node.js 버전**: 18
- **플러그인**: `@netlify/plugin-nextjs`

### 참고 문서
- `Netlify_자동_배포_해결_가이드.md` - 상세 해결 가이드
- `.github/Netlify_자동_배포_체크리스트.md` - 체크리스트

## ✅ 완료

모든 설정이 완료되었습니다. 이제 Netlify 대시보드에서 설정을 확인하고, GitHub에 푸시하면 자동 배포가 시작됩니다!

---

**중요**: 
- Netlify는 GitHub에 푸시할 때마다 자동으로 배포를 시도합니다.
- 빌드가 실패하면 자동 배포가 중단될 수 있으므로, 빌드 로그를 확인하여 오류를 해결하세요.
- 첫 배포는 수동으로 트리거하는 것이 좋습니다.

