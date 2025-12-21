# 🗑️ 프로젝트 삭제 후 재생성 (가장 확실한 방법)

## 왜 이 방법인가?

Production Overrides가 읽기 전용이고 수정할 수 없어서, 프로젝트를 삭제하고 새로 만드는 것이 가장 확실합니다.

---

## 단계별 가이드

### 1단계: 기존 프로젝트 삭제

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard
   - **Freeshell** 프로젝트 클릭

2. **Settings → General**
   - 왼쪽 메뉴에서 "Settings" 클릭
   - "General" 클릭

3. **프로젝트 삭제**
   - 페이지를 **맨 아래로 스크롤**
   - **"Delete Project"** 버튼 찾기 (빨간색 버튼)
   - 클릭
   - 프로젝트 이름 입력하여 확인
   - **"Delete"** 클릭

### 2단계: 새 프로젝트 생성

1. **"Add New Project" 클릭**
   - Vercel 대시보드 메인 페이지에서
   - 또는 상단의 **"Add New..."** 버튼 클릭

2. **GitHub 저장소 선택**
   - GitHub 계정 선택
   - 저장소 목록에서 **"partner0010/freeshell"** 선택
   - 또는 검색창에 "freeshell" 입력

3. **프로젝트 설정**
   - **Framework Preset**: Next.js (자동 감지됨)
   - **Project Name**: freeshell (또는 원하는 이름)
   - **Root Directory**: (비워둠 - 프로젝트 루트)

4. **Build and Output Settings** (중요!)
   - **"Override"** 토글 켜기 (있는 경우)
   - **Build Command**: `npx prisma generate && npx next build` (직접 입력!) ⭐
   - **Output Directory**: (비워둠 - Next.js 기본값)
   - **Install Command**: (비워둠 - 자동 감지)

5. **"Deploy" 클릭**
   - 프로젝트가 생성되고 배포가 시작됨

### 3단계: 배포 확인

1. **Deployments 탭**
   - 배포 상태 확인

2. **Build Logs 확인**
   - 배포 카드 클릭
   - "Build Logs" 탭 클릭
   - 다음이 보여야 함:
     ```
     Running "npx prisma generate && npx next build"
     ```
     또는
     ```
     > npx prisma generate && next build
     ```

---

## ✅ 성공 확인

Build Logs에서:
- ✅ `npx prisma generate` 실행됨
- ✅ `next build` 실행됨
- ✅ 빌드 성공!

---

## ⚠️ 주의사항

### 삭제 전 확인

1. **환경 변수 백업**
   - Settings → Environment Variables
   - 환경 변수 목록 확인 (필요하면 복사)

2. **도메인 설정 확인**
   - Settings → Domains
   - 도메인 목록 확인

3. **팀 설정 확인**
   - Settings → Team
   - 팀 멤버 확인

### 삭제 후 복원

1. **환경 변수 재설정**
   - 새 프로젝트 → Settings → Environment Variables
   - 환경 변수 다시 추가

2. **도메인 재연결**
   - 새 프로젝트 → Settings → Domains
   - 도메인 다시 연결

---

## 💡 왜 이 방법이 확실한가?

**프로젝트를 새로 생성하면:**
- ✅ Production Overrides가 없음
- ✅ 처음부터 올바른 Build Command 설정 가능
- ✅ `vercel.json`이 자동으로 인식됨
- ✅ `package.json`의 build 스크립트가 사용됨

**따라서 확실하게 해결됩니다!**

---

## 🚀 다음 단계

1. **기존 프로젝트 삭제**
2. **새 프로젝트 생성**
3. **Build Command를 `npx prisma generate && npx next build`로 직접 입력**
4. **배포**

**이것만 하면 확실히 해결됩니다!** 🎉

---

## 요약

**가장 확실한 해결 방법:**
1. Vercel 프로젝트 삭제
2. 새 프로젝트 생성
3. Build Command를 직접 입력: `npx prisma generate && npx next build`
4. 배포

**이것만 하면 됩니다!** 🚀

