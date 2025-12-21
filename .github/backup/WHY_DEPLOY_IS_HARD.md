# 🤔 배포가 이렇게 복잡한 이유

## 일반적인 배포 vs Prisma 사용 시 배포

### 일반적인 Next.js 배포 (간단함)
1. 코드 작성
2. Git에 푸시
3. Vercel이 자동으로 빌드 및 배포
4. 완료! ✅

### Prisma를 사용하는 경우 (복잡함)
1. 코드 작성
2. **Prisma Schema 작성** (`prisma/schema.prisma`)
3. **Prisma Client 생성** (`npx prisma generate`)
4. Git에 푸시
5. **Vercel 빌드 설정 수정** (Prisma Client 생성 명령 추가)
6. Vercel이 빌드 시 **Prisma Client를 먼저 생성**해야 함
7. 그 다음 Next.js 빌드
8. 배포 완료

---

## 왜 Prisma가 특별한가?

### Prisma의 작동 방식

1. **Prisma Schema** (`prisma/schema.prisma`) 작성
   - 데이터베이스 모델 정의

2. **Prisma Client 생성** (`npx prisma generate`)
   - Schema를 기반으로 TypeScript 타입과 클라이언트 코드 생성
   - 이 코드는 **빌드 시점에 생성되어야 함**

3. **코드에서 Prisma Client 사용**
   ```typescript
   import { PrismaClient } from '@prisma/client'
   const prisma = new PrismaClient()
   ```

### 문제점

**Vercel은 의존성을 캐시합니다:**
- 첫 빌드 후 `node_modules`를 캐시
- 다음 빌드에서는 캐시된 `node_modules` 사용
- **하지만 Prisma Client는 빌드 시점에 생성되어야 함!**
- 캐시된 `node_modules`에는 이전 빌드의 Prisma Client가 있음
- Schema가 변경되면 새로운 Prisma Client가 필요함
- **따라서 매 빌드마다 `npx prisma generate`를 실행해야 함**

---

## 해결 방법

### 방법 1: 빌드 명령에 Prisma Generate 추가 (현재 방법)

```json
// vercel.json
{
  "buildCommand": "npx prisma generate && npx next build"
}
```

**장점:**
- 확실함
- 매 빌드마다 최신 Prisma Client 생성

**단점:**
- Vercel Build Settings 수정 필요
- Production Overrides 설정 필요

### 방법 2: postinstall 스크립트 사용

```json
// package.json
{
  "scripts": {
    "postinstall": "npx prisma generate"
  }
}
```

**장점:**
- 간단함
- 자동 실행

**단점:**
- Vercel 캐시 때문에 항상 작동하지 않음
- 불안정함

### 방법 3: 빌드 스크립트에 포함

```json
// package.json
{
  "scripts": {
    "build": "npx prisma generate && next build"
  }
}
```

**장점:**
- 간단함
- 로컬과 동일

**단점:**
- Production Overrides가 있으면 무시됨

---

## 현재 문제

1. **Production Overrides가 `npm run build`로 설정됨**
   - 이것이 최우선이므로 다른 설정이 무시됨
   - `vercel.json`의 `buildCommand`가 무시됨
   - `package.json`의 `build` 스크립트도 무시됨

2. **해결 방법:**
   - Production Overrides를 비우거나
   - Production Overrides의 Build Command를 `npx prisma generate && npx next build`로 수정

---

## 결론

**일반적인 배포는 간단하지만, Prisma를 사용하면:**
- ✅ Prisma Client 생성이 필요
- ✅ 빌드 시점에 생성되어야 함
- ✅ Vercel 캐시 때문에 특별한 설정 필요
- ✅ Production Overrides 수정 필요

**이것은 Prisma의 특성 때문이며, 한 번만 설정하면 이후로는 자동으로 작동합니다!**

---

## ✅ 한 번만 설정하면 됩니다!

1. **Production Overrides 수정** (한 번만)
2. **이후로는 자동으로 작동**
3. **코드만 작성하고 푸시하면 자동 배포**

**처음만 복잡하고, 이후로는 간단합니다!** 🚀

