# 📝 정확한 단계별 가이드

## 현재 상황

새 프로젝트 생성 화면이 보이고, Build Command를 수정해야 합니다.

---

## 정확한 단계

### 1단계: Build Command 필드 찾기

1. **"Build and Output Settings" 섹션** 찾기
   - 페이지를 아래로 스크롤
   - "Build and Output Settings" 섹션 찾기

2. **"Build Command" 필드 찾기**
   - "Build Command" 라벨 옆의 필드
   - 현재 값: `npm run build`
   - 연필 아이콘 (✏️) 또는 필드 자체

### 2단계: Build Command 필드 클릭

1. **Build Command 필드 클릭**
   - 연필 아이콘 클릭 또는 필드 직접 클릭
   - 필드가 편집 가능해짐 (테두리가 활성화됨)

### 3단계: 값 변경

1. **현재 값 선택**
   - `Ctrl + A` (전체 선택)
   - 또는 마우스로 드래그하여 전체 선택

2. **삭제**
   - `Delete` 또는 `Backspace` 키
   - 필드가 비어있어야 함

3. **새 값 입력**
   - 다음 값을 정확히 입력:
     ```
     npx prisma generate && npx next build
     ```
   - 공백 포함, 정확히 이 형식으로 입력

4. **확인**
   - Enter 키 누르기
   - 또는 필드 밖 클릭

### 4단계: 최종 확인

1. **Build Command 필드 확인**
   - 값이 `npx prisma generate && npx next build`인지 확인
   - 정확히 이 값이어야 함

2. **다른 설정 확인**
   - Root Directory: `./` (그대로)
   - Output Directory: "Next.js default" (그대로)
   - Install Command: `npm install` (그대로)

### 5단계: 배포

1. **"Deploy" 버튼 클릭**
   - 페이지 맨 아래의 "Deploy" 버튼 클릭
   - 프로젝트가 생성되고 배포가 시작됨

---

## ✅ 확인 방법

배포 후 Build Logs에서:
- ✅ 성공: `Running "npx prisma generate && npx next build"`
- ❌ 실패: `Running "npm run build"` (여전히 문제 있음)

---

## 💡 팁

**Build Command 필드 수정:**
1. 필드 클릭
2. `Ctrl + A` → `Delete` (전체 삭제)
3. 새 값 입력: `npx prisma generate && npx next build`
4. Enter 키

**이것만 하면 됩니다!**

---

## 🚀 지금 바로 하세요!

1. **Build Command 필드 클릭**
2. **값 변경**: `npm run build` → `npx prisma generate && npx next build`
3. **"Deploy" 버튼 클릭**

**이것만 하면 됩니다!** 🎉

