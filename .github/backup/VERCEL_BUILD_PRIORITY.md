# 🔍 Vercel Build Command 우선순위

## 📋 Vercel Build Command 우선순위 (높은 순서)

1. **Production Overrides** (최우선) ⚠️
   - Settings → General → Build & Development Settings → Production Overrides
   - 이것이 설정되어 있으면 다른 모든 설정이 무시됨

2. **Project Settings** (Override 토글이 켜져 있을 때)
   - Settings → General → Build & Development Settings → Project Settings
   - Build Command Override 토글이 켜져 있으면 사용됨

3. **vercel.json** (Project Settings가 없을 때)
   - 프로젝트 루트의 `vercel.json` 파일
   - `buildCommand` 필드

4. **package.json** (위의 것들이 없을 때)
   - `package.json`의 `scripts.build` 필드

5. **Framework Preset** (기본값)
   - Next.js의 경우: `next build`

## ❌ 현재 문제

빌드 로그를 보면:
- `Running "npm run build"`가 실행됨
- 이것은 Production Overrides의 Build Command가 `npm run build`로 설정되어 있다는 것을 의미함

**해결:**
- Production Overrides의 Build Command를 `npx prisma generate && npx next build`로 변경
- 또는 Production Overrides를 완전히 제거

---

## ✅ 해결 방법

### 방법 1: Production Overrides 수정 (권장)

1. Vercel 대시보드 → Settings → General → Build & Development Settings
2. Production Overrides 섹션
3. Build Command: `npx prisma generate && npx next build`
4. 저장
5. 재배포

### 방법 2: Production Overrides 제거

1. Production Overrides 섹션의 모든 필드를 비움
2. 저장
3. Project Settings만 사용
4. 재배포

---

## 🔍 확인 방법

빌드 로그에서 확인:
- `Running "npm run build"` → Production Overrides 사용 중
- `Running "npx prisma generate && npx next build"` → 올바른 설정 사용 중

---

## 💡 중요 사항

**Production Overrides가 있으면 다른 모든 설정이 무시됩니다!**

따라서:
- Production Overrides의 Build Command를 수정하거나
- Production Overrides를 완전히 제거해야 합니다

