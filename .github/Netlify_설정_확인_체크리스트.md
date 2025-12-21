# ✅ Netlify 설정 확인 체크리스트

## 현재 프로젝트

- **프로젝트 이름:** `imaginative-fudge-4eb324`
- **프로젝트 URL:** `https://app.netlify.com/projects/imaginative-fudge-4eb324/overview`

---

## 확인 항목

### 1. Build & Deploy Settings ✅

**확인 위치:** Netlify 대시보드 → "Project configuration" → "Build & deploy"

**필수 설정:**
- ✅ **Build command:** `npx prisma generate && npm run build`
- ✅ **Publish directory:** `.next`
- ✅ **Node version:** `18` (또는 `>=18.0.0`)

**또는 `netlify.toml` 파일 확인:**
- ✅ 파일이 프로젝트 루트에 있는지 확인
- ✅ Build command가 올바른지 확인

---

### 2. Environment Variables (환경 변수) ⚠️

**확인 위치:** Netlify 대시보드 → "Project configuration" → "Environment variables"

**필수 환경 변수:**
- ⚠️ `DATABASE_URL` - Prisma 데이터베이스 URL
- ⚠️ `NEXTAUTH_SECRET` - NextAuth 시크릿 키
- ⚠️ `NEXTAUTH_URL` - 사이트 URL (배포 후 자동 생성 가능)

**설정 방법:**
1. "Project configuration" → "Environment variables"
2. "Add variable" 클릭
3. 변수 이름과 값 입력
4. "Save" 클릭
5. 재배포 필요

---

### 3. Domain Management (도메인 관리) ⚠️

**확인 위치:** Netlify 대시보드 → "Domain management"

**확인 사항:**
- ⚠️ `freeshell.co.kr` 도메인이 추가되었는지 확인
- ⚠️ `www.freeshell.co.kr` 도메인이 추가되었는지 확인
- ⚠️ DNS 설정 상태 확인:
  - ✅ "DNS configured correctly" (초록색) - 완료
  - ⚠️ "DNS not configured" (노란색) - 아직 전파 중
- ⚠️ SSL 인증서 상태 확인:
  - ✅ "SSL certificate active" (초록색) - 완료
  - ⚠️ "SSL certificate provisioning" (노란색) - 발급 중

---

### 4. Deploy Status (배포 상태) ✅

**확인 위치:** Netlify 대시보드 → "Deploys"

**확인 사항:**
- ✅ 최신 배포 상태 확인
- ✅ Build Logs 확인:
  - ✅ `npx prisma generate` 실행됨
  - ✅ `npm run build` 실행됨
  - ✅ Prisma 오류 없음
  - ✅ 빌드 성공

---

### 5. netlify.toml 파일 확인 ✅

**파일 위치:** 프로젝트 루트

**필수 내용:**
```toml
[build]
  command = "npx prisma generate && npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"
```

---

### 6. package.json 확인 ✅

**필수 스크립트:**
```json
{
  "scripts": {
    "build": "npx prisma generate && next build",
    "vercel-build": "npx prisma generate && next build"
  }
}
```

---

## 확인 방법

### Netlify 대시보드에서 확인

1. **Build & Deploy Settings**
   - "Project configuration" → "Build & deploy"
   - Build command 확인
   - Publish directory 확인

2. **Environment Variables**
   - "Project configuration" → "Environment variables"
   - 필수 변수 확인

3. **Domain Management**
   - "Domain management" 메뉴
   - 도메인 추가 여부 확인
   - DNS 설정 상태 확인
   - SSL 인증서 상태 확인

4. **Deploy Status**
   - "Deploys" 메뉴
   - 최신 배포 상태 확인
   - Build Logs 확인

---

## 문제 해결

### Build 실패 시

1. **Build Logs 확인**
   - "Deploys" → 최신 배포 → Build Logs
   - 오류 메시지 확인

2. **Environment Variables 확인**
   - 모든 필수 변수가 설정되어 있는지 확인

3. **Build Command 확인**
   - `npx prisma generate && npm run build`로 설정되어 있는지 확인

### DNS 설정 문제 시

1. **DNS 전파 확인**
   - `https://dnschecker.org` 사용
   - 도메인 입력
   - DNS 레코드 확인

2. **가비아 DNS 확인**
   - DNS 레코드가 올바르게 설정되어 있는지 확인

3. **Netlify에서 확인**
   - "Domain management" → 도메인 상태 확인

---

## ✅ 완료 체크리스트

- [ ] Build command: `npx prisma generate && npm run build`
- [ ] Publish directory: `.next`
- [ ] Environment variables 설정 (DATABASE_URL, NEXTAUTH_SECRET 등)
- [ ] Domain 추가 (freeshell.co.kr, www.freeshell.co.kr)
- [ ] DNS 설정 완료
- [ ] SSL 인증서 발급 완료
- [ ] 배포 성공
- [ ] 사이트 정상 작동

---

## 🚀 지금 바로 확인하세요!

1. **Netlify 대시보드 열기**
   - `https://app.netlify.com/projects/imaginative-fudge-4eb324/overview`

2. **각 항목 확인**
   - Build & Deploy Settings
   - Environment Variables
   - Domain Management
   - Deploy Status

3. **문제가 있으면 수정**

**이것만 하면 됩니다!** 🎉

