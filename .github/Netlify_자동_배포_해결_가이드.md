# 🔧 Netlify 자동 배포 문제 해결 가이드

## 문제 진단

### 일반적인 원인
1. **netlify.toml 파일 위치 문제** - 프로젝트 루트에 있어야 함
2. **빌드 명령어 오류** - Prisma 클라이언트 생성 필요
3. **GitHub 연동 문제** - 웹훅 설정 확인 필요
4. **환경 변수 누락** - 필요한 환경 변수 설정 확인
5. **빌드 디렉토리 오류** - Next.js는 `.next` 폴더 사용

## ✅ 해결 방법

### 1. netlify.toml 파일 확인
프로젝트 루트에 `netlify.toml` 파일이 있어야 합니다.

**올바른 위치**: `C:\Users\partn\OneDrive\바탕 화면\Cursor\Freeshell\netlify.toml`

**내용 확인**:
```toml
[build]
  command = "npx prisma generate && npm run build"
  publish = ".next"
  
[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"
```

### 2. Netlify 대시보드 설정 확인

#### 빌드 설정
1. Netlify 대시보드 접속: https://app.netlify.com
2. 사이트 선택 → **Site settings** → **Build & deploy**
3. **Build settings** 확인:
   - **Build command**: `npx prisma generate && npm run build`
   - **Publish directory**: `.next`
   - **Base directory**: (비워두기)

#### 환경 변수 설정
**Site settings** → **Build & deploy** → **Environment variables**:
- `DATABASE_URL` (필요시)
- `NEXTAUTH_SECRET` (필요시)
- `NEXTAUTH_URL` (필요시)
- 기타 필요한 환경 변수

### 3. GitHub 연동 확인

#### 저장소 연결 확인
1. **Site settings** → **Build & deploy** → **Continuous Deployment**
2. **Build settings** 확인:
   - 연결된 저장소가 올바른지 확인
   - 브랜치가 `main` 또는 `master`인지 확인
   - **Deploy contexts** 확인

#### 웹훅 확인
1. GitHub 저장소 → **Settings** → **Webhooks**
2. Netlify 웹훅이 있는지 확인
3. 없으면 Netlify에서 다시 연결

### 4. 수동 배포 테스트
1. Netlify 대시보드 → **Deploys** 탭
2. **Trigger deploy** → **Deploy site** 클릭
3. 빌드 로그 확인

### 5. 빌드 로그 확인
1. **Deploys** 탭 → 최근 배포 클릭
2. **Deploy log** 확인
3. 오류 메시지 확인:
   - Prisma 오류 → `npx prisma generate` 추가
   - 패키지 오류 → `package.json` 확인
   - 빌드 오류 → 빌드 명령어 확인

## 🔧 수정된 파일

### netlify.toml (프로젝트 루트)
- ✅ Prisma 클라이언트 생성 포함
- ✅ 올바른 빌드 명령어
- ✅ Next.js 플러그인 설정
- ✅ Node.js 버전 지정

## 📋 체크리스트

### 필수 확인 사항
- [ ] `netlify.toml` 파일이 프로젝트 루트에 있음
- [ ] 빌드 명령어에 `npx prisma generate` 포함
- [ ] 배포 디렉토리가 `.next`로 설정됨
- [ ] GitHub 저장소가 연결되어 있음
- [ ] 브랜치가 `main` 또는 `master`로 설정됨
- [ ] 필요한 환경 변수가 설정되어 있음
- [ ] Netlify 플러그인이 설치되어 있음

### Netlify 대시보드 설정
- [ ] 빌드 명령어: `npx prisma generate && npm run build`
- [ ] 배포 디렉토리: `.next`
- [ ] Node.js 버전: 18
- [ ] Next.js 플러그인 활성화

## 🚀 빠른 해결 방법

### 방법 1: netlify.toml 파일 확인
프로젝트 루트에 `netlify.toml` 파일이 있는지 확인하고, 위의 내용으로 업데이트하세요.

### 방법 2: Netlify 대시보드에서 수동 설정
1. Netlify 대시보드 접속
2. **Site settings** → **Build & deploy**
3. 빌드 명령어를 `npx prisma generate && npm run build`로 설정
4. 배포 디렉토리를 `.next`로 설정
5. **Save** 클릭

### 방법 3: GitHub에서 다시 연결
1. Netlify 대시보드 → **Site settings** → **Build & deploy**
2. **Link repository** 클릭
3. GitHub 저장소 다시 선택
4. 브랜치 선택 (`main` 또는 `master`)

## 📝 추가 확인 사항

### Prisma 스키마 위치
- Prisma 스키마가 `prisma/schema.prisma`에 있는지 확인
- 또는 `package.json`의 `postinstall` 스크립트 확인

### 환경 변수
- 데이터베이스 연결이 필요한 경우 `DATABASE_URL` 설정
- 인증이 필요한 경우 `NEXTAUTH_SECRET`, `NEXTAUTH_URL` 설정

### 빌드 타임아웃
- 빌드가 오래 걸리는 경우 타임아웃 설정 확인
- Netlify 기본 타임아웃: 15분

## 🔍 문제 해결 단계

1. **빌드 로그 확인** - 가장 먼저 확인
2. **netlify.toml 파일 확인** - 프로젝트 루트에 있는지
3. **빌드 명령어 확인** - Prisma 포함 여부
4. **GitHub 연동 확인** - 웹훅 설정
5. **환경 변수 확인** - 필요한 변수 설정
6. **수동 배포 테스트** - 문제 격리

## ✅ 해결 완료

프로젝트 루트에 `netlify.toml` 파일을 생성했습니다.
이제 Netlify 대시보드에서 설정을 확인하고, 필요시 수동으로 빌드 명령어를 업데이트하세요.

---

**참고**: Netlify는 GitHub에 푸시할 때마다 자동으로 배포를 시도합니다.
빌드가 실패하면 자동 배포가 중단될 수 있으므로, 빌드 로그를 확인하여 오류를 해결하세요.

