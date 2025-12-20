# Vercel 빌드 오류 확인 및 해결

## 🔴 현재 상황

Vercel 대시보드에서 배포가 실패했습니다:
- **에러 메시지**: "feat: 2025년 콘텐츠 제작 기능 업그레이드"
- **발생 시간**: 3분 전

## ✅ 해결 방법

### 1단계: 빌드 로그 확인

1. Vercel 대시보드에서 실패한 배포 클릭
2. **Build Logs** 탭 클릭
3. 오류 메시지 확인

### 2단계: 일반적인 오류 및 해결

#### 오류 1: ESLint 오류
```
Error: Definition for rule '@typescript-eslint/...' was not found
```
**해결**: `next.config.js`에 `eslint.ignoreDuringBuilds: true`가 있는지 확인

#### 오류 2: 모듈 누락
```
Module not found: Can't resolve 'bcryptjs'
```
**해결**: `package.json`에 `bcryptjs`가 있는지 확인

#### 오류 3: 환경 변수 누락
```
Environment variable not found
```
**해결**: Vercel Settings → Environment Variables에서 확인

### 3단계: 로컬에서 빌드 테스트

프로젝트 루트에서:
```bash
npm run build
```

로컬에서 빌드가 성공하면 Vercel에서도 성공할 가능성이 높습니다.

### 4단계: 수정 후 재배포

1. 오류 수정
2. 커밋 및 푸시:
```bash
git add .
git commit -m "fix: resolve build errors"
git push origin main
```

## 🔍 빠른 확인 체크리스트

- [ ] `next.config.js`에 `eslint.ignoreDuringBuilds: true` 있는지 확인
- [ ] `package.json`에 `bcryptjs`와 `next-auth` 있는지 확인
- [ ] 로컬에서 `npm run build` 성공하는지 확인
- [ ] Vercel 빌드 로그에서 정확한 오류 메시지 확인

## 💡 팁

빌드 로그를 확인하면 정확한 오류 원인을 알 수 있습니다.
Vercel 대시보드 → 실패한 배포 → Build Logs 클릭

