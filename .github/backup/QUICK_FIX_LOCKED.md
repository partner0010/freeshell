# 🚀 빠른 해결: Production Overrides가 잠겨있는 경우

## ✅ 해결 방법 (가장 쉬움)

Production Overrides가 수정 불가능하거나 잠겨있으면, **모든 필드를 비우면** 됩니다!

---

## 📋 단계별 가이드

### 1. Vercel 대시보드 접속
- https://vercel.com/dashboard
- Freeshell 프로젝트 클릭

### 2. Settings → General → Build & Development Settings
- 왼쪽 메뉴에서 "General" 클릭
- 페이지를 아래로 스크롤

### 3. Production Overrides 섹션 찾기
- "Production Overrides" 섹션 찾기
- 접혀있으면 펼치기

### 4. 모든 필드 비우기 ⭐ (중요!)
- **Build Command**: 모든 내용 삭제 (비워둠)
- **Install Command**: 모든 내용 삭제 (비워둠)
- **Development Command**: 모든 내용 삭제 (비워둠)

### 5. 저장
- "Save" 버튼 클릭

### 6. 재배포
- Deployments → 최신 배포 → "..." → "Redeploy"

---

## ✅ 결과

Production Overrides를 비우면:
- ✅ `vercel.json`의 `buildCommand`가 자동으로 사용됨
- ✅ `npx prisma generate && npx next build` 실행됨
- ✅ 빌드 성공!

---

## 💡 왜 이렇게 하면 되는가?

**Vercel의 우선순위:**
1. Production Overrides (최우선) ← 이것을 비우면
2. vercel.json의 buildCommand ← 이것이 사용됨 ✅
3. package.json의 build 스크립트

**따라서 Production Overrides를 비우기만 하면 `vercel.json`이 자동으로 사용됩니다!**

---

## 🔍 확인 방법

재배포 후 Build Logs에서:
- `Running "npx prisma generate && npx next build"`가 보이면 성공 ✅
- `Running "npm run build"`가 보이면 Production Overrides가 여전히 설정된 것

---

## 🆘 여전히 안 되면

1. **Project Settings 확인**
   - Settings → General → Build & Development Settings
   - Project Settings 섹션에서 "Override" 토글 확인

2. **vercel.json 확인**
   - 프로젝트 루트에 `vercel.json` 파일이 있는지 확인
   - 내용이 올바른지 확인:
     ```json
     {
       "buildCommand": "npx prisma generate && npx next build"
     }
     ```

3. **Git에 푸시 확인**
   - `vercel.json` 파일이 Git에 커밋되어 있는지 확인
   - 변경사항이 Vercel에 반영되었는지 확인

