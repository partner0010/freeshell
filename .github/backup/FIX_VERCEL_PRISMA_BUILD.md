# 🔧 Vercel Prisma 빌드 오류 최종 해결

## ❌ 현재 문제

Vercel 빌드 로그에서 확인된 오류:
```
PrismaClientInitializationError: Prisma has detected that this project was built on Vercel, 
which caches dependencies. This leads to an outdated Prisma Client because Prisma's 
auto-generation isn't triggered.
```

**원인:**
- `package.json`의 `build` 스크립트에 `prisma generate && next build`가 있지만
- Vercel이 `npm run build`를 실행할 때 `prisma generate`가 제대로 실행되지 않음
- 또는 Prisma schema를 찾지 못함

## ✅ 해결 방법

### 방법 1: Vercel Build Settings에서 Build Command 명시적 설정 (권장)

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard

2. **프로젝트 선택**
   - Freeshell 프로젝트 클릭

3. **Settings → General → Build & Development Settings**
   - Build Command: `prisma generate && npm run build`
   - 또는: `npx prisma generate && npm run build`

4. **저장**

5. **재배포**
   - Deployments 탭 → 최신 배포의 "..." → "Redeploy"

---

### 방법 2: package.json의 build 스크립트 수정

현재:
```json
{
  "scripts": {
    "build": "prisma generate && next build"
  }
}
```

수정 (더 명시적):
```json
{
  "scripts": {
    "build": "npx prisma generate && next build"
  }
}
```

또는:
```json
{
  "scripts": {
    "prebuild": "prisma generate",
    "build": "next build"
  }
}
```

---

### 방법 3: vercel.json 파일 생성

프로젝트 루트에 `vercel.json` 파일 생성:

```json
{
  "buildCommand": "prisma generate && npm run build",
  "installCommand": "npm install"
}
```

---

### 방법 4: postinstall 스크립트 강화

`package.json` 수정:

```json
{
  "scripts": {
    "postinstall": "prisma generate || true",
    "build": "prisma generate && next build"
  }
}
```

`|| true`는 postinstall이 실패해도 빌드를 계속 진행하도록 합니다.

---

## 🔍 확인 사항

### 1. Prisma Schema 위치 확인

프로젝트 루트에 다음 파일이 있어야 합니다:
- ✅ `prisma/schema.prisma` (필수!)

확인 방법:
```bash
# 프로젝트 루트에서
ls prisma/schema.prisma
# 또는
dir prisma\schema.prisma
```

### 2. package.json 확인

`package.json`에 다음이 포함되어 있어야 합니다:
```json
{
  "scripts": {
    "build": "prisma generate && next build"
  },
  "dependencies": {
    "@prisma/client": "^5.22.0"
  },
  "devDependencies": {
    "prisma": "^5.22.0"
  }
}
```

### 3. Git에 Prisma Schema 커밋 확인

Prisma schema가 Git에 커밋되었는지 확인:
```bash
git ls-files | grep prisma/schema.prisma
```

---

## 📋 권장 해결 순서

### 1단계: Prisma Schema 확인

```bash
# 프로젝트 루트에서
cat prisma/schema.prisma
# 또는
type prisma\schema.prisma
```

### 2단계: Vercel Build Settings 수정 (가장 확실)

1. Vercel 대시보드 → Settings → General
2. Build & Development Settings
3. Build Command: `prisma generate && npm run build`
4. 저장

### 3단계: 재배포

- Deployments 탭 → 최신 배포 → "..." → "Redeploy"

---

## 🆘 문제가 계속되면

### 로컬 빌드 테스트

```bash
# 프로젝트 루트에서
npm install
npx prisma generate
npm run build
```

로컬에서 빌드가 성공하면:
- Prisma schema는 정상
- 문제는 Vercel 빌드 설정

로컬에서 빌드가 실패하면:
- Prisma schema에 문제가 있을 수 있음
- 또는 다른 빌드 오류

---

## 💡 추가 팁

### Prisma Client 생성 확인

빌드 후 다음 파일이 생성되는지 확인:
- `node_modules/.prisma/client/`
- `node_modules/@prisma/client/`

Vercel에서는 이 파일들이 생성되어야 합니다.

---

## ✅ 최종 확인

1. ✅ `prisma/schema.prisma` 파일이 프로젝트 루트에 있음
2. ✅ `package.json`의 `build` 스크립트에 `prisma generate` 포함
3. ✅ Vercel Build Settings에서 Build Command 명시적 설정
4. ✅ Prisma schema가 Git에 커밋됨
5. ✅ 재배포 실행

이 모든 것이 완료되면 빌드가 성공해야 합니다!

