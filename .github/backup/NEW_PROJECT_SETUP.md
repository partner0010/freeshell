# 🆕 새 프로젝트 생성 가이드 (스크린샷 기반)

## 현재 화면

새 프로젝트 생성 화면이 보입니다. Build Command 필드를 수정해야 합니다.

---

## 단계별 가이드

### 1단계: Build Command 필드 수정

1. **Build and Output Settings 섹션** 찾기
   - 페이지를 아래로 스크롤
   - "Build and Output Settings" 섹션 찾기

2. **Build Command 필드 수정**
   - "Build Command" 필드 찾기
   - 현재 값: `npm run build`
   - **연필 아이콘 (✏️) 클릭** 또는 **필드 클릭**
   - 필드가 편집 가능해짐
   - 현재 값 삭제: `npm run build`
   - **새 값 입력**: `npx prisma generate && npx next build`
   - 정확히 이 값으로 입력 (복사해서 붙여넣기)

3. **확인**
   - Enter 키 누르거나 필드 밖 클릭

### 2단계: 다른 설정 확인

1. **Root Directory**
   - 현재 값: `./` (프로젝트 루트)
   - 그대로 두기 (수정 불필요)

2. **Output Directory**
   - 현재 값: "Next.js default"
   - 토글이 켜져있으면 그대로 두기
   - 그대로 두기 (수정 불필요)

3. **Install Command**
   - 현재 값: `npm install`
   - 그대로 두기 (수정 불필요)

### 3단계: Environment Variables 확인

1. **Environment Variables 섹션**
   - "EXAMPLE_NAME" 환경 변수가 있으면 삭제 (필요한 경우)
   - 실제 필요한 환경 변수만 추가

### 4단계: 배포

1. **"Deploy" 버튼 클릭**
   - 페이지 맨 아래의 "Deploy" 버튼 클릭
   - 프로젝트가 생성되고 배포가 시작됨

---

## ✅ 확인 사항

### Build Command 필드 수정 후

- ✅ Build Command: `npx prisma generate && npx next build`
- ✅ Root Directory: `./` (그대로)
- ✅ Output Directory: "Next.js default" (그대로)
- ✅ Install Command: `npm install` (그대로)

---

## 🔍 확인 방법

배포 후 Build Logs에서:
- ✅ 성공: `Running "npx prisma generate && npx next build"`
- ❌ 실패: `Running "npm run build"` (여전히 문제 있음)

---

## 💡 팁

**Build Command 필드 수정:**
- 연필 아이콘 클릭 또는 필드 직접 클릭
- 현재 값 삭제
- 새 값 입력: `npx prisma generate && npx next build`
- Enter 키 또는 필드 밖 클릭

**다른 필드는 그대로 두면 됩니다!**

---

## 🚀 지금 바로 하세요!

1. **Build Command 필드 클릭**
2. **값 변경**: `npm run build` → `npx prisma generate && npx next build`
3. **"Deploy" 버튼 클릭**

**이것만 하면 됩니다!** 🎉

---

## 요약

**새 프로젝트 생성 시:**
1. Build Command만 수정: `npx prisma generate && npx next build`
2. 다른 설정은 그대로 두기
3. Deploy 클릭

**이것만 하면 됩니다!** 🚀

