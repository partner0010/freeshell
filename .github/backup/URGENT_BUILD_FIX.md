# 🚨 긴급 빌드 오류 수정

## 발견된 오류

빌드 로그에서 다음 오류들이 발견되었습니다:

### 1. next-auth 모듈 누락 (가장 중요!)
```
Module not found: Can't resolve 'next-auth'
Module not found: Can't resolve 'next-auth/react'
Module not found: Can't resolve 'next-auth/providers/google'
```

### 2. JSX 구문 오류
```
./src/components/audit/WebsiteAuditor.tsx
./src/components/editor/AdvancedBlockRenderer.tsx
```

---

## ✅ 해결 방법

### 1단계: package.json 확인 및 수정

프로젝트 루트의 `package.json` 파일을 열고 다음 의존성을 추가:

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

### 2단계: 의존성 설치

프로젝트 루트에서 실행:
```bash
npm install next-auth@4 bcryptjs @types/bcryptjs
```

### 3단계: 로컬 빌드 테스트

```bash
npm run build
```

빌드가 성공하면 다음 단계로 진행.

### 4단계: 변경사항 커밋 및 푸시

```bash
git add package.json package-lock.json
git commit -m "fix: add missing dependencies (next-auth, bcryptjs)"
git push origin main
```

---

## 🚀 빠른 수정 스크립트

프로젝트 루트에서 실행:
```bash
.github\fix-all-build-errors.bat
```

이 스크립트가 자동으로:
1. 필수 의존성 확인 및 설치
2. 로컬 빌드 테스트
3. 오류 메시지 표시

---

## 📋 체크리스트

- [ ] package.json에 `next-auth@4` 추가
- [ ] package.json에 `bcryptjs` 및 `@types/bcryptjs` 추가
- [ ] `npm install` 실행
- [ ] `npm run build` 성공 확인
- [ ] 변경사항 커밋 및 푸시
- [ ] Vercel에서 새 배포 확인

---

## ⚠️ 중요

**빌드 오류를 먼저 해결하지 않으면 재배포해도 계속 실패합니다!**

1. **먼저**: package.json에 의존성 추가
2. **그 다음**: 로컬에서 빌드 테스트
3. **수정 후**: 재배포

---

## 🔍 추가 확인 사항

### JSX 구문 오류가 계속되면:

1. `src/components/audit/WebsiteAuditor.tsx` 파일 확인
2. `src/components/editor/AdvancedBlockRenderer.tsx` 파일 확인
3. 모든 JSX 구문이 올바른지 확인
4. import 문이 올바른지 확인

### next-auth가 설치되어도 오류가 나면:

1. `node_modules` 폴더 삭제
2. `package-lock.json` 삭제
3. `npm install` 재실행
4. `npm run build` 재실행

