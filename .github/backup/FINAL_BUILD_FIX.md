# 🚨 최종 빌드 오류 수정 가이드

## 발견된 오류 (빌드 로그 기준)

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

**프로젝트 루트** (`C:\Users\partn\OneDrive\바탕 화면\Cursor\Freeshell`)에서:

1. `package.json` 파일을 엽니다.

2. `dependencies` 섹션에 다음을 추가:
```json
{
  "dependencies": {
    "next-auth": "^4.24.5",
    "bcryptjs": "^2.4.3",
    // ... 기존 의존성들
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    // ... 기존 devDependencies들
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

**빌드가 성공하면** 다음 단계로 진행.

**빌드가 실패하면** 오류 메시지를 확인하고 수정.

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

또는:
```bash
.github\create-package-json.bat
```

---

## 📋 체크리스트

빌드 오류 수정 전:
- [ ] package.json 파일 확인
- [ ] `next-auth@4` 의존성 추가
- [ ] `bcryptjs` 및 `@types/bcryptjs` 의존성 추가
- [ ] `npm install` 실행
- [ ] 로컬에서 `npm run build` 성공 확인

빌드 오류 수정 후:
- [ ] 변경사항 커밋 (`package.json`, `package-lock.json`)
- [ ] GitHub에 푸시
- [ ] Vercel에서 새 배포 시작 확인
- [ ] 배포 상태가 "Ready"인지 확인

---

## ⚠️ 중요

**빌드 오류를 먼저 해결하지 않으면 재배포해도 계속 실패합니다!**

1. **먼저**: package.json에 의존성 추가
2. **그 다음**: 로컬에서 빌드 테스트 (`npm run build`)
3. **빌드 성공 후**: 변경사항 커밋 및 푸시
4. **마지막**: Vercel에서 자동 배포 확인

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

---

## 📞 빠른 해결

**가장 빠른 방법:**

1. 프로젝트 루트에서:
   ```bash
   npm install next-auth@4 bcryptjs @types/bcryptjs
   ```

2. 빌드 테스트:
   ```bash
   npm run build
   ```

3. 성공하면 커밋 및 푸시:
   ```bash
   git add package.json package-lock.json
   git commit -m "fix: add missing dependencies"
   git push origin main
   ```

4. Vercel에서 자동 배포 확인

---

## ✅ 예상 결과

수정 후:
- ✅ 빌드 성공
- ✅ Vercel 배포 성공 (Ready 상태)
- ✅ 사이트 정상 작동

