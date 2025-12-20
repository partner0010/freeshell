# 빌드 오류 확인 및 해결

## 🔴 현재 상황

Vercel 대시보드에서 최근 배포 2개가 모두 **Error** 상태:
1. `140a25d trigger fresh deployment` - 1분 전
2. `3cb82ee feat: 2025년 콘텐츠 제작 기능 업그레이드` - 20분 전

## ✅ 해결 방법

### 1단계: 빌드 로그 확인

1. Vercel 대시보드에서 **Error** 상태인 배포 클릭
2. **Build Logs** 탭 클릭
3. 오류 메시지 확인

### 2단계: 일반적인 빌드 오류

#### 오류 1: ESLint 오류
```
Error: Definition for rule '@typescript-eslint/...' was not found
```
**해결**: `next.config.js`에 `eslint.ignoreDuringBuilds: true` 확인

#### 오류 2: 모듈 누락
```
Module not found: Can't resolve 'bcryptjs'
Module not found: Can't resolve 'next-auth'
```
**해결**: `package.json`에 의존성 확인

#### 오류 3: 타입 오류
```
Type error: ...
```
**해결**: TypeScript 오류 수정

### 3단계: 로컬에서 빌드 테스트

프로젝트 루트에서:
```bash
npm run build
```

로컬에서 빌드가 실패하면 동일한 오류가 Vercel에서도 발생합니다.

### 4단계: 오류 수정 후 재배포

1. 오류 수정
2. 커밋 및 푸시:
```bash
git add .
git commit -m "fix: resolve build errors"
git push origin main
```

## 🔍 빠른 확인

### package.json 확인
- `bcryptjs`가 있는지 확인
- `next-auth`가 있는지 확인

### next.config.js 확인
- `eslint.ignoreDuringBuilds: true`가 있는지 확인

### 로컬 빌드 테스트
```bash
npm run build
```

## 📝 다음 단계

1. **Vercel 빌드 로그 확인** → 정확한 오류 메시지 확인
2. **로컬 빌드 테스트** → 동일한 오류 재현
3. **오류 수정** → 코드 수정
4. **재배포** → `git push origin main`

## 💡 중요

빌드 로그를 확인하면 정확한 오류 원인을 알 수 있습니다.
Vercel 대시보드 → Error 배포 클릭 → Build Logs 확인

