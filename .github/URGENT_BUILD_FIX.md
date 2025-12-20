# 🚨 긴급 빌드 오류 수정 (업데이트)

## 발견된 오류

1. **next-auth 모듈 누락** (가장 중요!)
   ```
   Module not found: Can't resolve 'next-auth/react'
   Module not found: Can't resolve 'next-auth'
   Module not found: Can't resolve 'next-auth/providers/google'
   ```

2. **bcryptjs 모듈 누락** (중요!)
   ```
   Module not found: Can't resolve 'bcryptjs'
   ```
   - 파일: `./src/app/api/auth/[...nextauth]/route.ts`
   - 파일: `./src/app/api/auth/signup/route.ts`

3. **next.config.js 경고** (선택사항)
   - `experimental.serverActions` 옵션 제거 필요

## ✅ 즉시 수정 방법

### 1. package.json에 필수 의존성 추가

프로젝트 루트의 `package.json` 파일을 열고 `dependencies` 섹션에 추가:

```json
{
  "dependencies": {
    "next-auth": "^4.24.5",
    "bcryptjs": "^2.4.3",
    // ... 기타 의존성
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    // ... 기타 devDependencies
  }
}
```

### 2. 의존성 설치

프로젝트 루트에서 실행:
```bash
npm install
```

또는 직접 설치:
```bash
npm install next-auth@4 bcryptjs @types/bcryptjs
```

### 3. 빌드 테스트

```bash
npm run build
```

## 🔧 자동 수정 스크립트

프로젝트 루트에서 실행:
```bash
.github\fix-build-errors.bat
```

## 📝 수정 후 배포

1. 변경사항 커밋:
```bash
git add package.json package-lock.json
git commit -m "fix: add next-auth and bcryptjs dependencies"
git push origin main
```

2. Vercel이 자동으로 재배포합니다.

## ⚠️ 중요 사항

- **next-auth는 필수 의존성입니다** (인증 기능)
- **bcryptjs는 필수 의존성입니다** (비밀번호 해싱)
- package.json에 추가하지 않으면 빌드가 실패합니다

## ✅ 확인 체크리스트

- [ ] package.json에 `"next-auth": "^4.24.5"` 추가
- [ ] package.json에 `"bcryptjs": "^2.4.3"` 추가
- [ ] package.json에 `"@types/bcryptjs": "^2.4.6"` 추가 (devDependencies)
- [ ] `npm install` 실행
- [ ] `npm run build` 성공 확인
- [ ] 변경사항 커밋 및 푸시
- [ ] Vercel 배포 상태 확인

## 🚀 한 번에 설치

```bash
npm install next-auth@4 bcryptjs @types/bcryptjs
```
