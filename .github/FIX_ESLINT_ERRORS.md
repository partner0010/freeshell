# ESLint 오류 수정 가이드

## 🔴 발견된 오류

### 주요 오류
```
./src/lib/db.ts (3:3 Error): Definition for rule '@typescript-eslint/no-var-requires' was not found.
./src/lib/db.ts (6:3 Error): Definition for rule '@typescript-eslint/no-var-requires' was not found.
```

## ✅ 수정 방법

### 방법 1: ESLint 주석 수정 (권장)

`src/lib/db.ts` 파일을 열고 다음처럼 수정:

**수정 전:**
```typescript
// eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
PrismaClient = require('@prisma/client').PrismaClient;
```

**수정 후:**
```typescript
// eslint-disable-next-line @typescript-eslint/no-require-imports
PrismaClient = require('@prisma/client').PrismaClient;
```

또는 더 간단하게:
```typescript
// eslint-disable-next-line
PrismaClient = require('@prisma/client').PrismaClient;
```

### 방법 2: ESLint 규칙 비활성화

`.eslintrc.json` 파일에 다음 규칙 추가:

```json
{
  "rules": {
    "@typescript-eslint/no-var-requires": "off"
  }
}
```

### 방법 3: 파일 전체에서 규칙 비활성화

`src/lib/db.ts` 파일 상단에 추가:

```typescript
/* eslint-disable @typescript-eslint/no-var-requires */
```

## 🚀 빠른 수정

프로젝트 루트에서 실행:
```bash
.github\fix-eslint-errors.bat
```

## 📝 추가 경고 해결 (선택사항)

빌드는 성공하지만 다음 경고들도 해결할 수 있습니다:

### 1. Image alt prop 경고
```tsx
// 수정 전
<img src="..." />

// 수정 후
<img src="..." alt="설명" />
// 또는
<Image src="..." alt="설명" /> // next/image 사용
```

### 2. React Hook dependencies 경고
```tsx
// 수정 전
useEffect(() => {
  loadData();
}, []);

// 수정 후
useEffect(() => {
  loadData();
}, [loadData]);
```

## ✅ 확인 사항

1. ✅ src/lib/db.ts의 ESLint 주석 수정
2. ✅ 빌드 테스트 실행
3. ✅ 변경사항 커밋 및 푸시

## 🎯 가장 빠른 해결책

`src/lib/db.ts` 파일을 열고:
- 3번째 줄의 주석을 `// eslint-disable-next-line`로 변경
- 6번째 줄의 주석을 `// eslint-disable-next-line`로 변경

이렇게 하면 빌드가 성공합니다!

