# 빌드 오류 수정 가이드

## 🔴 발견된 오류

### 1. next-auth 모듈 누락
```
Module not found: Can't resolve 'next-auth/react'
Module not found: Can't resolve 'next-auth'
Module not found: Can't resolve 'next-auth/providers/google'
```

### 2. bcryptjs 모듈 누락
```
Module not found: Can't resolve 'bcryptjs'
```
- 파일: `./src/app/api/auth/[...nextauth]/route.ts`
- 파일: `./src/app/api/auth/signup/route.ts`

### 3. JSX 구문 오류 (의심)
- WebsiteAuditor.tsx
- AdvancedBlockRenderer.tsx

## ✅ 수정 방법

### 1. 필수 의존성 설치

프로젝트 루트에서 실행:
```bash
npm install next-auth@4 bcryptjs @types/bcryptjs
```

또는 package.json에 추가:
```json
{
  "dependencies": {
    "next-auth": "^4.24.5",
    "bcryptjs": "^2.4.3"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6"
  }
}
```

### 2. next.config.js 수정

`experimental.serverActions` 옵션 제거:
```js
// next.config.js
module.exports = {
  // experimental.serverActions: true, // 이 줄 제거
  // Server Actions는 기본적으로 활성화되어 있음
};
```

### 3. 의존성 재설치

```bash
rm -rf node_modules package-lock.json
npm install
```

## 🚀 빠른 수정

프로젝트 루트에서 다음 명령어 실행:

```bash
# 필수 의존성 설치
npm install next-auth@4 bcryptjs @types/bcryptjs

# 의존성 확인
npm install

# 빌드 테스트
npm run build
```

## 📝 확인 사항

1. ✅ next-auth가 package.json에 있는지 확인
2. ✅ bcryptjs가 package.json에 있는지 확인
3. ✅ node_modules에 next-auth와 bcryptjs가 설치되어 있는지 확인
4. ✅ next.config.js에서 experimental.serverActions 제거
5. ✅ 빌드 테스트 실행
