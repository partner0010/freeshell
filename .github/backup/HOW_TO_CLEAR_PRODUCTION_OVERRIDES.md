# 📝 Production Overrides 비우는 방법 (단계별)

## 현재 상황

스크린샷을 보니:
- **Production Overrides** 섹션에 `npm run build`가 설정되어 있음
- 이것을 비워야 Project Settings의 `npx prisma generate && npx next build`가 사용됨

## 해결 방법 (단계별)

### 1단계: Production Overrides 섹션 찾기

1. **Vercel 대시보드**에서:
   - Settings → General → Build & Development Settings
   - 페이지를 아래로 스크롤

2. **Production Overrides 섹션** 찾기
   - "Production Overrides" 제목 아래에 있는 섹션
   - 현재 펼쳐져 있음 (▼ 화살표)

### 2단계: Build Command 필드 비우기

1. **Build Command 입력 필드 클릭**
   - "Build Command" 라벨 옆의 입력 필드를 클릭
   - 현재 값: `npm run build`

2. **모든 텍스트 선택 및 삭제**
   - 방법 1: `Ctrl + A` (전체 선택) → `Delete` 또는 `Backspace`
   - 방법 2: 마우스로 드래그하여 전체 선택 → `Delete` 또는 `Backspace`
   - 방법 3: 필드 내에서 `Ctrl + A` → 텍스트 삭제

3. **필드가 완전히 비어있는지 확인**
   - 입력 필드에 아무것도 없어야 함
   - 빈 필드여야 함

### 3단계: Install Command와 Development Command도 비우기 (선택사항)

1. **Install Command 필드**
   - 현재 값: `npm install`
   - 같은 방법으로 비우기 (선택사항이지만 권장)

2. **Development Command 필드**
   - 현재 값: `npm run dev`
   - 같은 방법으로 비우기 (선택사항이지만 권장)

### 4단계: 저장

1. **페이지 하단의 "Save" 버튼 찾기**
   - 페이지를 아래로 스크롤
   - 오른쪽에 "Save" 버튼이 있음

2. **"Save" 버튼 클릭**
   - 클릭하면 설정이 저장됨
   - 저장 완료 메시지가 표시될 수 있음

3. **저장 확인**
   - 페이지를 새로고침 (F5)
   - Production Overrides의 Build Command가 비어있는지 확인

### 5단계: 재배포

1. **Deployments 탭**
   - 왼쪽 메뉴에서 "Deployments" 클릭

2. **최신 배포 선택**
   - 가장 위에 있는 배포 카드 클릭

3. **Redeploy 실행**
   - 배포 카드 오른쪽 상단의 **"..."** (점 3개) 메뉴 클릭
   - **"Redeploy"** 선택
   - 확인

---

## ✅ 확인 방법

### 저장 후 확인

1. **페이지 새로고침** (F5)
2. **Production Overrides 섹션 확인**
   - Build Command 필드가 비어있어야 함
   - 빈 필드여야 함

### 재배포 후 확인

1. **Build Logs 확인**
   - Deployments → 최신 배포 → "Build Logs" 탭
   - 다음이 보여야 함:
     ```
     Running "npx prisma generate && npx next build"
     ```
   - 다음이 보이면 안 됨:
     ```
     Running "npm run build"
     ```

---

## 💡 팁

### 입력 필드가 비활성화되어 있는 경우

만약 입력 필드가 회색으로 보이고 클릭할 수 없다면:
- Production Overrides가 잠겨있을 수 있음
- "Revert to @username/projectname" 링크를 클릭해보세요
- 또는 Vercel 지원팀에 문의하세요

### 필드를 비울 수 없는 경우

1. **"Revert" 링크 확인**
   - Production Overrides 섹션에 "Revert to @username/projectname" 링크가 있는지 확인
   - 있다면 클릭하여 기본값으로 되돌리기

2. **Project Settings만 사용**
   - Production Overrides를 비울 수 없다면
   - Project Settings의 Build Command Override가 켜져있는지 확인
   - 이미 켜져있으므로, Production Overrides를 비우는 것만 하면 됨

---

## 🚀 최종 확인

모든 단계를 완료하면:
- ✅ Production Overrides의 Build Command가 비어있음
- ✅ Project Settings의 Build Command가 `npx prisma generate && npx next build`
- ✅ Project Settings의 Build Command Override가 켜져있음 (ON)
- ✅ 저장 완료
- ✅ 재배포 완료
- ✅ Build Logs에서 `npx prisma generate && npx next build` 확인

이렇게 하면 빌드가 성공할 것입니다! 🎉

