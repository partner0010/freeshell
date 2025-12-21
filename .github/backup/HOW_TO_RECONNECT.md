# 🔄 Vercel 프로젝트 재연결 방법 (단계별)

## 재연결 방법

### 1단계: Vercel 대시보드 접속

1. **브라우저에서 Vercel 대시보드 열기**
   - https://vercel.com/dashboard
   - 로그인 (필요시)

2. **Freeshell 프로젝트 클릭**
   - 프로젝트 목록에서 "Freeshell" 클릭

### 2단계: Git 저장소 연결 해제

1. **Settings 탭 클릭**
   - 왼쪽 메뉴에서 "Settings" 클릭

2. **General 섹션**
   - "General" 섹션이 자동으로 열림
   - 또는 왼쪽 메뉴에서 "General" 클릭

3. **Git 저장소 연결 해제**
   - 페이지를 아래로 스크롤
   - "Git" 섹션 찾기
   - "Disconnect Git Repository" 버튼 찾기
   - 클릭
   - 확인 메시지에서 "Disconnect" 또는 "확인" 클릭

### 3단계: Git 저장소 다시 연결

1. **"Connect Git Repository" 버튼 클릭**
   - Git 섹션에 "Connect Git Repository" 버튼이 보임
   - 클릭

2. **GitHub 저장소 선택**
   - GitHub 계정 선택 (이미 연결되어 있으면 자동으로 표시됨)
   - 저장소 목록에서 "partner0010/freeshell" 선택
   - 또는 저장소 이름으로 검색

3. **프로젝트 설정 확인**
   - Framework Preset: Next.js (자동 감지됨)
   - Root Directory: (비워둠 - 프로젝트 루트)
   - Build Command: (비워둠 - 자동 감지 또는 `npx prisma generate && npx next build` 입력)
   - Output Directory: (비워둠 - Next.js 기본값)

4. **"Deploy" 또는 "Import" 클릭**
   - 프로젝트가 연결되고 자동으로 배포가 시작됨

### 4단계: 빌드 설정 확인

1. **Settings → General → Build & Development Settings**
   - 왼쪽 메뉴에서 "General" 클릭
   - "Build & Development Settings" 섹션으로 스크롤

2. **Production Overrides 확인**
   - "Production Overrides" 섹션 찾기
   - Build Command 필드가 비어있는지 확인
   - 비어있지 않다면 비우기 (이제 수정 가능할 수 있음)

3. **Project Settings 확인**
   - "Project Settings" 섹션 찾기
   - Build Command Override가 켜져있는지 확인
   - Build Command가 `npx prisma generate && npx next build`인지 확인

4. **저장**
   - "Save" 버튼 클릭 (변경사항이 있다면)

### 5단계: 배포 확인

1. **Deployments 탭**
   - 왼쪽 메뉴에서 "Deployments" 클릭
   - 가장 위에 있는 배포 확인

2. **Build Logs 확인**
   - 배포 카드 클릭
   - "Build Logs" 탭 클릭
   - 다음이 보여야 함:
     ```
     Running "npx prisma generate && npx next build"
     ```
   - 또는:
     ```
     Running "npm run build"
     > npx prisma generate && next build
     ```

---

## ⚠️ 주의사항

### 재연결 시 주의할 점

1. **기존 배포 기록**
   - 재연결해도 기존 배포 기록은 유지됩니다
   - 새로운 배포가 생성됩니다

2. **환경 변수**
   - 환경 변수는 유지됩니다
   - 확인: Settings → Environment Variables

3. **도메인 설정**
   - 도메인 설정은 유지됩니다
   - 확인: Settings → Domains

4. **팀 설정**
   - 팀 설정은 유지됩니다
   - 확인: Settings → Team

---

## ✅ 재연결 후 확인 사항

- [ ] Git 저장소가 올바르게 연결됨
- [ ] Production Overrides의 Build Command가 비어있음 (또는 수정 가능)
- [ ] Project Settings의 Build Command가 `npx prisma generate && npx next build`
- [ ] 새로운 배포가 시작됨
- [ ] Build Logs에서 `npx prisma generate` 실행 확인

---

## 🚀 예상 결과

재연결 후:
- ✅ Production Overrides가 초기화됨
- ✅ `vercel.json` 또는 `package.json`의 build 스크립트가 사용됨
- ✅ `npx prisma generate && npx next build` 실행됨
- ✅ 빌드 성공!

---

## 💡 팁

**재연결이 복잡하다면:**

1. **먼저 시도**: Settings → General → "Disconnect Git Repository"
2. **그 다음**: "Connect Git Repository" 클릭
3. **저장소 선택**: partner0010/freeshell
4. **배포**: 자동으로 배포 시작

**이것만 하면 됩니다!**

---

## 🆘 문제가 발생하면

1. **Build Logs 확인**
   - 어떤 명령어가 실행되는지 확인
   - 오류 메시지 확인

2. **Settings 확인**
   - Production Overrides 확인
   - Project Settings 확인

3. **Vercel 지원팀에 문의**
   - 문제가 계속되면 지원팀에 문의

---

## 요약

**재연결 방법:**
1. Settings → General → "Disconnect Git Repository"
2. "Connect Git Repository" 클릭
3. GitHub 저장소 선택
4. 배포 시작
5. 빌드 설정 확인

**이것만 하면 됩니다!** 🚀

