# 🔍 배포 실패 원인 상세 분석

## ❌ 발견된 문제들

### 1. Prisma Schema 위치 문제 (가장 중요)

**현재 상태:**
- ❌ 프로젝트 루트에 `prisma/schema.prisma` 파일이 없음
- ✅ `.github/prisma/schema.prisma`에만 존재

**영향:**
- Vercel 빌드 시 Prisma가 schema를 찾지 못함
- `prisma generate` 명령이 실패
- Prisma Client 생성 실패
- 빌드 시 `PrismaClientInitializationError` 발생

**해결:**
```bash
# 프로젝트 루트에서
mkdir prisma
copy .github\prisma\schema.prisma prisma\schema.prisma
```

---

### 2. Prisma Client 초기화 시점 문제

**문제:**
- 여러 파일에서 모듈 최상위 레벨에서 `new PrismaClient()` 호출
- 빌드 시점에 Prisma Client가 필요함

**영향을 받는 파일:**
- `src/lib/auth/options.ts` (라인 9)
- `src/app/api/admin/licenses/route.ts` (라인 5)
- `src/app/api/license/user/route.ts` (라인 5)
- `src/app/api/license/apply/route.ts` (라인 5)
- `src/app/api/license/validate/route.ts` (라인 5)
- `src/app/api/license/generate/route.ts` (라인 5)
- `src/app/api/auth/verify-code/route.ts` (라인 4)
- `src/app/api/auth/verify-phone/route.ts` (라인 4)
- `src/app/api/auth/signup/route.ts` (라인 5)

**문제 코드 예시:**
```typescript
// src/lib/auth/options.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // ❌ 빌드 시점에 실행됨
```

**해결:**
- Prisma schema가 표준 위치에 있으면 자동 해결됨
- 또는 지연 초기화 패턴 사용 (현재 `src/lib/db.ts`에서 사용 중)

---

### 3. 환경 변수 설정 문제

**필요한 환경 변수:**
- `DATABASE_URL` - Prisma 데이터베이스 연결 (필수)
- `NEXTAUTH_SECRET` - NextAuth 인증 (필수)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - Google 로그인 (선택)
- `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET` - Naver 로그인 (선택)
- `KAKAO_CLIENT_ID`, `KAKAO_CLIENT_SECRET` - Kakao 로그인 (선택)

**확인 방법:**
1. Vercel 대시보드 → Settings → Environment Variables
2. 필요한 환경 변수가 모두 설정되어 있는지 확인

**주의:**
- `.gitignore`에 `.env` 파일이 포함되어 있음
- 환경 변수는 Vercel에서 직접 설정해야 함

---

### 4. Vercel 빌드 캐싱 문제

**문제:**
- Vercel이 의존성을 캐시함
- `postinstall` 스크립트가 실행되지 않을 수 있음

**현재 설정:**
```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma generate && next build"
  }
}
```

**해결:**
- `build` 스크립트에 `prisma generate`가 포함되어 있음 ✅
- Prisma schema가 표준 위치에 있으면 정상 작동

---

### 5. Prisma Client 생성 타이밍 문제

**문제:**
- Next.js 빌드 시점에 Prisma Client가 필요함
- "Collecting page data" 단계에서 Prisma Client를 사용하려고 시도
- Prisma Client가 아직 생성되지 않았거나 찾을 수 없음

**오류 메시지:**
```
PrismaClientInitializationError: Prisma has detected that this project was built on Vercel, 
which caches dependencies. This leads to an outdated Prisma Client because Prisma's 
auto-generation isn't triggered.
```

**해결:**
1. Prisma schema를 표준 위치로 이동
2. `build` 스크립트에 `prisma generate` 포함 (이미 있음)
3. Vercel Build Settings 확인

---

## ✅ 해결 방법 (우선순위 순)

### 1단계: Prisma Schema 표준 위치로 이동 (가장 중요)

```bash
# 프로젝트 루트에서
mkdir prisma
copy .github\prisma\schema.prisma prisma\schema.prisma

# 커밋 및 푸시
git add prisma/schema.prisma
git commit -m "fix: move Prisma schema to standard location"
git push origin main
```

### 2단계: 환경 변수 확인

Vercel 대시보드에서:
1. Settings → Environment Variables
2. 다음 변수 확인:
   - `DATABASE_URL` (필수)
   - `NEXTAUTH_SECRET` (필수)
   - 기타 필요한 변수들

### 3단계: Vercel Build Settings 확인

Vercel 대시보드에서:
1. Settings → General → Build & Development Settings
2. Build Command 확인: `npm run build` (기본값)
3. Install Command 확인: `npm install` (기본값)

### 4단계: 빌드 로그 확인

Vercel 대시보드에서:
1. Deployments → 최신 Error 배포
2. Build Logs 탭
3. 정확한 오류 메시지 확인

---

## 📋 체크리스트

- [ ] 프로젝트 루트에 `prisma/schema.prisma` 파일 존재 확인
- [ ] `package.json`의 `build` 스크립트에 `prisma generate` 포함 확인
- [ ] Vercel 환경 변수 설정 확인 (DATABASE_URL, NEXTAUTH_SECRET)
- [ ] Prisma schema 파일이 Git에 커밋되었는지 확인
- [ ] 로컬에서 `npm run build` 테스트 성공 확인

---

## 🔍 추가 확인 사항

### Prisma Client 사용 패턴

**현재 패턴:**
- 일부 파일: 직접 `new PrismaClient()` 사용
- `src/lib/db.ts`: 지연 초기화 패턴 사용

**권장:**
- 모든 파일에서 `src/lib/db.ts`의 `prisma` 인스턴스 사용
- 또는 Prisma schema가 표준 위치에 있으면 현재 패턴도 작동

---

## 🆘 문제가 계속되면

1. **Vercel Build Logs 확인**
   - 정확한 오류 메시지 확인
   - 오류가 발생한 단계 확인

2. **로컬 빌드 테스트**
   ```bash
   npm run build
   ```
   - 로컬에서 빌드가 성공하는지 확인

3. **Prisma Client 생성 테스트**
   ```bash
   npx prisma generate
   ```
   - Prisma Client가 정상 생성되는지 확인

