# 🔗 Vercel-GitHub 연결 가이드

## 현재 문제
- 모든 최근 배포가 **Error** 상태
- 사이트에 내용이 표시되지 않음
- GitHub 연결 확인 필요

## ✅ 해결 방법

### 1단계: Vercel 대시보드에서 GitHub 연결 확인

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard

2. **프로젝트 선택**
   - **Freeshell** 프로젝트 클릭

3. **Settings 탭**
   - 왼쪽 메뉴에서 **Settings** 클릭

4. **Git 섹션 확인**
   - **Git** 섹션으로 스크롤
   - **Connected Git Repository** 확인
   - 현재 상태:
     - ✅ 연결됨: `partner0010/freeshell`
     - ❌ 연결 안 됨: "Connect Git Repository" 버튼 표시

5. **GitHub 재연결 (필요한 경우)**
   - "Connect Git Repository" 클릭
   - GitHub 로그인
   - `partner0010/freeshell` 저장소 선택
   - 권한 승인

---

### 2단계: 빌드 로그 확인

1. **Deployments 탭**
   - 왼쪽 메뉴에서 **Deployments** 클릭

2. **최신 Error 배포 선택**
   - 가장 위에 있는 Error 배포 클릭

3. **Build Logs 확인**
   - **Build Logs** 탭 클릭
   - 오류 메시지 확인

**일반적인 오류:**
- `Module not found: Can't resolve 'bcryptjs'`
- `Module not found: Can't resolve 'next-auth'`
- `TypeScript error`
- `ESLint error`

---

### 3단계: 빌드 오류 수정

#### 방법 A: 자동 수정 스크립트 실행

프로젝트 루트에서 실행:
```bash
.github\fix-vercel-github.bat
```

이 스크립트가:
1. 로컬 빌드 테스트
2. 누락된 의존성 확인
3. 빌드 오류 수정
4. GitHub에 푸시

#### 방법 B: 수동 수정

1. **package.json 확인**
   - 필수 의존성 확인:
     - `bcryptjs`
     - `next-auth@4`
     - `@types/bcryptjs`

2. **의존성 설치**
   ```bash
   npm install bcryptjs @types/bcryptjs next-auth@4
   ```

3. **next.config.js 확인**
   ```js
   const nextConfig = {
     eslint: {
       ignoreDuringBuilds: true,
     },
   };
   ```

4. **로컬 빌드 테스트**
   ```bash
   npm run build
   ```

5. **변경사항 커밋 및 푸시**
   ```bash
   git add .
   git commit -m "fix: resolve build errors"
   git push origin main
   ```

---

### 4단계: 재배포

#### 방법 1: 자동 재배포 (권장)
- GitHub에 푸시하면 Vercel에서 자동 배포 시작

#### 방법 2: 수동 재배포
1. Vercel 대시보드 → Deployments
2. 최신 배포의 "..." 메뉴
3. **"Redeploy"** 선택

---

## 🔍 문제 진단 체크리스트

- [ ] Vercel에서 GitHub 연결 확인
- [ ] 빌드 로그에서 오류 확인
- [ ] package.json에 필수 의존성 확인
- [ ] 로컬에서 `npm run build` 성공 확인
- [ ] 변경사항 GitHub에 푸시 확인
- [ ] Vercel에서 새 배포 시작 확인

---

## 📞 추가 도움

### 빌드 오류가 계속되면:
1. `.github\BUILD_ERRORS.md` 참고
2. Vercel Build Logs의 전체 오류 메시지 확인
3. 로컬 빌드 오류와 비교

### GitHub 연결이 안 되면:
1. Vercel Settings → Git → "Disconnect" 후 재연결
2. GitHub 저장소 권한 확인
3. Vercel GitHub App 권한 확인

---

## ✅ 빠른 해결

**가장 빠른 방법:**
1. Vercel 대시보드 → Settings → Git → GitHub 연결 확인
2. `.github\fix-vercel-github.bat` 실행
3. 빌드 성공 후 자동 배포 확인

