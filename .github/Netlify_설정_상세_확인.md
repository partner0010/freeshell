# 🔍 Netlify 설정 상세 확인

## 프로젝트 정보

- **프로젝트 이름:** `imaginative-fudge-4eb324`
- **프로젝트 URL:** `https://app.netlify.com/projects/imaginative-fudge-4eb324/overview`
- **도메인:** `freeshell.co.kr`

---

## 1. Build & Deploy Settings 확인

### 확인 위치
Netlify 대시보드 → "Project configuration" → "Build & deploy"

### 필수 설정

**Build command:**
```
npx prisma generate && npm run build
```

**Publish directory:**
```
.next
```

**Node version:**
```
18
```

### netlify.toml 파일 확인

프로젝트 루트에 `netlify.toml` 파일이 있어야 합니다:

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

## 2. Environment Variables 확인

### 확인 위치
Netlify 대시보드 → "Project configuration" → "Environment variables"

### 필수 환경 변수

**DATABASE_URL:**
- Prisma 데이터베이스 연결 URL
- 형식: `postgresql://user:password@host:port/database`

**NEXTAUTH_SECRET:**
- NextAuth 시크릿 키
- 생성 방법: `openssl rand -base64 32`

**NEXTAUTH_URL:**
- 사이트 URL
- 예: `https://freeshell.co.kr` 또는 `https://imaginative-fudge-4eb324.netlify.app`

**기타 필요한 변수:**
- Google OAuth (필요 시): `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- Naver OAuth (필요 시): `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`
- Kakao OAuth (필요 시): `KAKAO_CLIENT_ID`, `KAKAO_CLIENT_SECRET`

---

## 3. Domain Management 확인

### 확인 위치
Netlify 대시보드 → "Domain management"

### 확인 사항

**도메인 추가:**
- ✅ `freeshell.co.kr` (루트 도메인)
- ✅ `www.freeshell.co.kr` (www 서브도메인)

**DNS 설정 상태:**
- ✅ "DNS configured correctly" (초록색) - 완료
- ⚠️ "DNS not configured" (노란색) - 아직 전파 중

**SSL 인증서 상태:**
- ✅ "SSL certificate active" (초록색) - 완료
- ⚠️ "SSL certificate provisioning" (노란색) - 발급 중

---

## 4. Deploy Status 확인

### 확인 위치
Netlify 대시보드 → "Deploys"

### 확인 사항

**최신 배포 상태:**
- ✅ "Published" (초록색) - 성공
- ⚠️ "Building" (노란색) - 진행 중
- ❌ "Failed" (빨간색) - 실패

**Build Logs 확인:**
- ✅ `npx prisma generate` 실행됨
- ✅ `npm run build` 실행됨
- ✅ Prisma 오류 없음
- ✅ 빌드 성공

---

## 5. package.json 확인

### 필수 스크립트

```json
{
  "scripts": {
    "build": "npx prisma generate && next build",
    "vercel-build": "npx prisma generate && next build"
  }
}
```

---

## 6. prisma/schema.prisma 확인

### 파일 위치
프로젝트 루트에 `prisma/schema.prisma` 파일이 있어야 합니다.

---

## 확인 방법

### Netlify 대시보드에서 확인

1. **Build & Deploy Settings**
   ```
   https://app.netlify.com/projects/imaginative-fudge-4eb324/configuration/deploys
   ```

2. **Environment Variables**
   ```
   https://app.netlify.com/projects/imaginative-fudge-4eb324/configuration/env
   ```

3. **Domain Management**
   ```
   https://app.netlify.com/projects/imaginative-fudge-4eb324/domains
   ```

4. **Deploy Status**
   ```
   https://app.netlify.com/projects/imaginative-fudge-4eb324/deploys
   ```

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
   - 도메인 입력: `freeshell.co.kr`
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

