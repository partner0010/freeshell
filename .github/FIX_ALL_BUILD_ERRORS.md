# 🔴 모든 배포 실패 - 빌드 오류 수정 가이드

## 현재 상황
- **모든 최근 배포가 Error 상태**
- 마지막 성공한 배포: 20시간 전
- 빌드 오류를 먼저 해결해야 재배포 가능

## ✅ 해결 방법

### 1단계: Vercel Build Logs 확인 (가장 중요!)

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard

2. **프로젝트 선택**
   - Freeshell 프로젝트 클릭

3. **Deployments 탭**
   - 왼쪽 메뉴에서 "Deployments" 클릭

4. **최신 Error 배포 선택**
   - 가장 위에 있는 Error 배포 클릭 (예: `9K5x8wBCX`)

5. **Build Logs 확인**
   - "Build Logs" 탭 클릭
   - **오류 메시지 전체 복사**

**일반적인 오류:**
- `Module not found: Can't resolve 'bcryptjs'`
- `Module not found: Can't resolve 'next-auth'`
- `Module not found: Can't resolve '@prisma/client'`
- `TypeScript error: ...`
- `ESLint error: ...`

---

### 2단계: 로컬 빌드 테스트

프로젝트 루트에서 실행:
```bash
.github\check-build-errors.bat
```

이 스크립트가:
1. 필수 의존성 확인
2. 누락된 의존성 설치
3. 로컬 빌드 테스트
4. 오류 메시지 표시

---

### 3단계: 빌드 오류 수정

#### A. 의존성 누락 오류

**오류:** `Module not found: Can't resolve 'xxx'`

**해결:**
```bash
# 누락된 패키지 설치
npm install xxx

# package.json 확인
# package-lock.json 확인

# 커밋 및 푸시
git add package.json package-lock.json
git commit -m "fix: add missing dependency xxx"
git push origin main
```

**일반적으로 누락되는 패키지:**
- `bcryptjs` 및 `@types/bcryptjs`
- `next-auth@4`
- `@prisma/client` 및 `prisma`

#### B. TypeScript 오류

**오류:** `Type error: ...`

**해결:**
1. 오류가 발생한 파일 확인
2. 타입 정의 수정
3. 또는 `@ts-ignore` 주석 추가 (임시)

#### C. ESLint 오류

**오류:** `ESLint error: ...`

**해결:**
`next.config.js`에 추가:
```js
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // ... 기타 설정
};
```

---

### 4단계: 수정 후 재배포

#### 방법 1: 자동 재배포 (권장)
```bash
# 변경사항 커밋 및 푸시
git add .
git commit -m "fix: resolve build errors"
git push origin main
```

#### 방법 2: Vercel에서 수동 재배포
1. Vercel 대시보드 → Deployments
2. 최신 배포의 "..." → "Redeploy"

---

## 🔍 체크리스트

빌드 오류 수정 전:
- [ ] Vercel Build Logs에서 정확한 오류 확인
- [ ] 오류 메시지 전체 복사 및 분석
- [ ] 로컬에서 `npm run build` 실행
- [ ] 로컬 빌드 오류와 Vercel 빌드 오류 비교

빌드 오류 수정 후:
- [ ] 로컬 빌드 성공 확인 (`npm run build`)
- [ ] 변경사항 커밋 및 푸시
- [ ] Vercel에서 새 배포 시작 확인
- [ ] 배포 상태가 "Ready"인지 확인

---

## 📋 빠른 수정 스크립트

프로젝트 루트에서 실행:
```bash
.github\check-build-errors.bat
```

이 스크립트가 자동으로:
1. 필수 의존성 확인 및 설치
2. 로컬 빌드 테스트
3. 오류 메시지 표시
4. 수정 후 배포 옵션 제공

---

## ⚠️ 중요

**빌드 오류를 먼저 해결하지 않으면 재배포해도 계속 실패합니다!**

1. **먼저**: Vercel Build Logs에서 오류 확인
2. **그 다음**: 로컬에서 빌드 테스트
3. **수정 후**: 재배포

---

## 🆘 추가 도움

빌드 오류가 계속되면:
1. `.github\BUILD_ERRORS.md` 참고
2. Vercel Build Logs의 전체 오류 메시지 공유
3. 로컬 빌드 오류 메시지 공유

