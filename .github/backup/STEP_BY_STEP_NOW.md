# 📝 지금 바로 따라하세요 (단계별)

## 🎯 목표

Vercel 프로젝트를 재연결하여 Production Overrides를 초기화하고 올바른 빌드 명령이 실행되도록 하기

---

## 📋 단계별 가이드

### ✅ 1단계: Vercel 대시보드 접속

1. 브라우저에서 **https://vercel.com/dashboard** 열기
2. 로그인 (필요시)
3. 프로젝트 목록에서 **"Freeshell"** 클릭

### ✅ 2단계: Settings 열기

1. 왼쪽 메뉴에서 **"Settings"** 클릭
2. **"General"** 클릭 (자동으로 열림)

### ✅ 3단계: Git 저장소 연결 해제

1. 페이지를 **아래로 스크롤**
2. **"Git"** 섹션 찾기
3. **"Disconnect Git Repository"** 버튼 찾기
4. **클릭**
5. 확인 메시지에서 **"Disconnect"** 또는 **"확인"** 클릭

### ✅ 4단계: Git 저장소 다시 연결

1. **"Connect Git Repository"** 버튼 클릭
2. GitHub 계정 선택 (이미 연결되어 있으면 자동으로 표시됨)
3. 저장소 목록에서 **"partner0010/freeshell"** 찾기
   - 검색창에 "freeshell" 입력하면 빠르게 찾을 수 있음
4. **"Deploy"** 또는 **"Import"** 버튼 클릭

### ✅ 5단계: 배포 확인

1. 자동으로 배포가 시작됨
2. **Deployments** 탭에서 배포 상태 확인
3. 배포가 완료되면:
   - 배포 카드 클릭
   - **"Build Logs"** 탭 클릭
   - 다음이 보이는지 확인:
     ```
     Running "npx prisma generate && npx next build"
     ```
     또는
     ```
     > npx prisma generate && next build
     ```

---

## ✅ 성공 확인

Build Logs에서 다음이 보이면 성공:
- ✅ `npx prisma generate` 실행됨
- ✅ `next build` 실행됨
- ✅ 빌드 성공!

---

## ❌ 실패 시

여전히 `Running "npm run build"`가 보이면:

1. **Settings → General → Build & Development Settings** 확인
2. **Production Overrides** 섹션 확인
3. **Project Settings** 섹션 확인
4. **Vercel 지원팀에 문의**

---

## 💡 팁

**재연결 후:**
- Production Overrides가 초기화됨
- `vercel.json`의 `buildCommand`가 사용됨
- 또는 `package.json`의 `build` 스크립트가 사용됨
- 둘 다 올바르게 설정되어 있으므로 작동할 것입니다!

---

## 🚀 지금 바로 하세요!

1. Vercel 대시보드 접속
2. Settings → General
3. "Disconnect Git Repository" 클릭
4. "Connect Git Repository" 클릭
5. GitHub 저장소 선택
6. 배포 시작

**이것만 하면 됩니다!** 🎉

